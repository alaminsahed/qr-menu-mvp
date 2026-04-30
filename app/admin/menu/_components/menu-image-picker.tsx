"use client";

import { useEffect, useMemo, useState } from "react";

type MenuImagePickerProps = {
  inputId: string;
  inputName: string;
  required?: boolean;
  currentImageUrl?: string;
  helpText?: string;
};

export function MenuImagePicker({
  inputId,
  inputName,
  required = false,
  currentImageUrl,
  helpText,
}: MenuImagePickerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resolvedPreview = previewUrl || currentImageUrl || "";

  return (
    <div className="space-y-3">
      <input
        id={inputId}
        name={inputName}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        required={required}
        onChange={(event) => {
          const nextFile = event.currentTarget.files?.[0] ?? null;
          setSelectedFile(nextFile);
        }}
        className="ui-input file:mr-3 file:rounded-full file:border-0 file:bg-surface-soft file:px-3 file:py-1.5 file:text-sm file:font-medium"
      />
      {helpText ? <p className="text-xs text-muted-ui">{helpText}</p> : null}
      {resolvedPreview ? (
        <>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-default bg-surface px-3 py-1.5 text-xs font-semibold text-secondary-ui hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Preview image
          </button>
          {isPreviewOpen ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Image preview"
              onClick={() => setIsPreviewOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="cursor-pointer absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-[#121212] shadow-md"
                aria-label="Close image preview"
              >
                ×
              </button>
              <div
                className="relative h-[76vh] w-full max-w-md overflow-hidden rounded-2xl bg-black/30"
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={resolvedPreview}
                  alt="Selected preview"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
