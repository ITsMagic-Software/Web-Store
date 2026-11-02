import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SafeImage } from "@/components/ui/SafeImage";

vi.mock("next/image", async () => {
  const { createElement } = await import("react");
  return {
    default: (props: {
      src: string;
      alt: string;
      sizes: string;
      className?: string;
      onError?: () => void;
    }) => createElement("img", {
      src: props.src,
      alt: props.alt,
      sizes: props.sizes,
      className: props.className,
      onError: props.onError,
    }),
  };
});

const imageProps = {
  alt: "",
  seed: "asset-id",
  sizes: "100vw",
  className: "object-cover",
};

describe("SafeImage", () => {
  it.each([
    ["HTTP URL", "http://raw.githubusercontent.com/assets/thumb.jpg"],
    ["host not allowed", "https://images.example.com/thumb.jpg"],
    ["empty source", null],
  ])("uses the local gradient for %s", (_case, src) => {
    const { container } = render(<SafeImage {...imageProps} src={src} />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("replaces a failed image with a local gradient after one error", () => {
    const src = "https://raw.githubusercontent.com/assets/thumb.jpg";
    const { container, rerender } = render(<SafeImage {...imageProps} src={src} />);
    const image = container.querySelector("img");

    expect(image).not.toBeNull();
    if (!image) throw new Error("Expected a permitted image to render");
    fireEvent.error(image);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();

    rerender(<SafeImage {...imageProps} src={src} />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("tries a new source after the source changes", () => {
    const firstSrc = "https://raw.githubusercontent.com/assets/first.jpg";
    const nextSrc = "https://raw.githubusercontent.com/assets/next.jpg";
    const { container, rerender } = render(<SafeImage {...imageProps} src={firstSrc} />);
    const firstImage = container.querySelector("img");

    expect(firstImage).not.toBeNull();
    if (!firstImage) throw new Error("Expected the first permitted image to render");
    fireEvent.error(firstImage);
    rerender(<SafeImage {...imageProps} src={nextSrc} />);

    expect(container.querySelector("img")?.getAttribute("src")).toBe(nextSrc);
  });
});
