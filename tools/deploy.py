from __future__ import annotations

import base64
import http.client
import mimetypes
import os
import sys
import tempfile
import uuid
import zipfile
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "out"
DEFAULT_URL = "https://itsmagic.com.br/devtools/updateStore.php"


def zip_site() -> Path:
    temp_root = Path(tempfile.mkdtemp(prefix="itsmagic-store-"))
    archive = temp_root / "store.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as zipped:
        for path in OUTPUT.rglob("*"):
            if path.is_file():
                zipped.write(path, path.relative_to(OUTPUT).as_posix())
    return archive


def multipart(secret: str, archive: Path) -> tuple[bytes, str]:
    boundary = "----StoreUpload" + uuid.uuid4().hex
    chunks: list[bytes] = []
    for key, value in (("secret_b64", base64.b64encode(secret.encode()).decode("ascii")),):
        chunks.extend([
            f"--{boundary}".encode(),
            f'Content-Disposition: form-data; name="{key}"'.encode(),
            b"",
            value.encode(),
        ])
    mime = mimetypes.guess_type(archive.name)[0] or "application/octet-stream"
    chunks.extend([
        f"--{boundary}".encode(),
        f'Content-Disposition: form-data; name="build"; filename="{archive.name}"'.encode(),
        f"Content-Type: {mime}".encode(),
        b"",
        archive.read_bytes(),
        f"--{boundary}--".encode(),
        b"",
    ])
    return b"\r\n".join(chunks), boundary


def main() -> int:
    secret = os.getenv("STORE_UPLOAD_SECRET", "")
    upload_url = os.getenv("STORE_UPLOAD_URL", DEFAULT_URL)
    if not secret:
        print("STORE_UPLOAD_SECRET is required", file=sys.stderr)
        return 1
    if not OUTPUT.is_dir() or not any(OUTPUT.rglob("*")):
        print("Next.js static export output not found: out/", file=sys.stderr)
        return 1

    parsed = urlparse(upload_url)
    if parsed.scheme != "https" or not parsed.netloc:
        print("STORE_UPLOAD_URL must be an HTTPS URL", file=sys.stderr)
        return 1

    archive = zip_site()
    body, boundary = multipart(secret, archive)
    path = parsed.path or "/"
    if parsed.query:
        path += "?" + parsed.query
    connection = http.client.HTTPSConnection(parsed.netloc, timeout=120)
    try:
        connection.request("POST", path, body=body, headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Content-Length": str(len(body)),
            "User-Agent": "itsmagic-store-uploader/1.0",
        })
        response = connection.getresponse()
        message = response.read().decode("utf-8", errors="replace")
        print(message)
        if response.status >= 400:
            print(f"Store upload failed: HTTP {response.status} {response.reason}", file=sys.stderr)
            return 1
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    raise SystemExit(main())
