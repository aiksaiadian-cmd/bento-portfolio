"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { validateFile, getFileType } from "@/lib/media";

interface FileUploaderProps {
  onFile: (file: File) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
}

export function FileUploader({
  onFile,
  accept = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm",
  label = "Upload file",
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    setError(null);
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid file");
      return;
    }
    setLoading(true);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setLoading(false);
    onFile(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isImage = preview && getFileType(preview) !== "video";

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center w-full h-full cursor-pointer rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-indigo-400 bg-indigo-50/50"
            : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300"
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-8 w-8 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : preview ? (
          isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-full object-contain p-2"
            />
          ) : (
            <video
              src={preview}
              className="max-w-full max-h-full object-contain p-2"
              controls
              preload="metadata"
            />
          )
        ) : (
          <>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-300 mb-2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-xs text-zinc-400">
              {dragOver ? "Drop file here" : label}
            </span>
          </>
        )}

        {error && (
          <span className="text-xs text-red-400 mt-2 px-2 text-center">
            {error}
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
