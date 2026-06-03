import { getFileType, validateFile } from "@/lib/media";

describe("getFileType", () => {
  it("returns 'gif' for gif base64", () => {
    expect(getFileType("data:image/gif;base64,abc")).toBe("gif");
  });

  it("returns 'image' for image base64", () => {
    expect(getFileType("data:image/png;base64,abc")).toBe("image");
    expect(getFileType("data:image/jpeg;base64,abc")).toBe("image");
    expect(getFileType("data:image/webp;base64,abc")).toBe("image");
  });

  it("returns 'video' for video base64", () => {
    expect(getFileType("data:video/mp4;base64,abc")).toBe("video");
    expect(getFileType("data:video/webm;base64,abc")).toBe("video");
  });

  it("defaults to 'image' for unknown", () => {
    expect(getFileType("data:application/pdf;base64,abc")).toBe("image");
  });
});

describe("validateFile", () => {
  it("rejects unsupported file type", () => {
    const file = new File(["dummy"], "test.pdf", { type: "application/pdf" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unsupported file type");
  });

  it("accepts a valid image within size limit", () => {
    const blob = new Blob(["x".repeat(1024 * 1024)]); // 1MB
    const file = new File([blob], "test.jpg", { type: "image/jpeg" });
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects an image exceeding 5MB", () => {
    const blob = new Blob(["x".repeat(6 * 1024 * 1024)]); // 6MB
    const file = new File([blob], "test.jpg", { type: "image/jpeg" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("File too large");
  });

  it("accepts a valid video within size limit", () => {
    const blob = new Blob(["x".repeat(1024 * 1024)]); // 1MB
    const file = new File([blob], "test.mp4", { type: "video/mp4" });
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects a video exceeding 20MB", () => {
    const blob = new Blob(["x".repeat(21 * 1024 * 1024)]); // 21MB
    const file = new File([blob], "test.mp4", { type: "video/mp4" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("File too large");
  });

  it("accepts valid file types: png, webp, gif, webm", () => {
    const blob = new Blob(["x"]);
    const types = ["image/png", "image/webp", "image/gif", "video/webm"];
    for (const type of types) {
      expect(validateFile(new File([blob], `test.${type.split("/")[1]}`, { type })).valid).toBe(true);
    }
  });
});
