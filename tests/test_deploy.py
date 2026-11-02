import contextlib
import io
import unittest
from unittest.mock import MagicMock, patch

from tools import deploy


class DeployTests(unittest.TestCase):
    def run_upload(self, status):
        output = MagicMock()
        output.is_dir.return_value = True
        output.rglob.return_value = [MagicMock()]
        connection = MagicMock()
        response = connection.getresponse.return_value
        response.status = status
        response.reason = "test"
        response.read.return_value = b"test response"
        with (
            patch.dict(deploy.os.environ, {"STORE_UPLOAD_SECRET": "test", "STORE_UPLOAD_URL": ""}),
            patch.object(deploy, "OUTPUT", output),
            patch.object(deploy, "zip_site"),
            patch.object(deploy, "multipart", return_value=(b"zip", "boundary")),
            patch.object(deploy.http.client, "HTTPSConnection", return_value=connection) as client,
            contextlib.redirect_stdout(io.StringIO()),
            contextlib.redirect_stderr(io.StringIO()),
        ):
            result = deploy.main()
        return result, connection, client

    def test_unset_actions_variable_uses_default_endpoint(self):
        result, connection, client = self.run_upload(200)
        self.assertEqual(result, 0)
        client.assert_called_once_with("itsmagic.com.br", timeout=120)
        self.assertEqual(connection.request.call_args.args[:2], ("POST", "/devtools/updateStore.php"))
        connection.close.assert_called_once()

    def test_redirect_is_not_a_successful_upload(self):
        result, connection, _ = self.run_upload(302)
        self.assertEqual(result, 1)
        connection.close.assert_called_once()


if __name__ == "__main__":
    unittest.main()
