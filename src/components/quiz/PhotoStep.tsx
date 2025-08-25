import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface PhotoStepProps {
  file?: File | null;
  hideFace: boolean;
  onFileChange: (file: File | null) => void;
  onHideFaceChange: (hide: boolean) => void;
  onValidityChange: (valid: boolean) => void;
  onProcessingChange?: (processing: boolean) => void;
}

const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const MIN_WIDTH = 800;
const MIN_HEIGHT = 1200;

export default function PhotoStep({
  file,
  hideFace,
  onFileChange,
  onHideFaceChange,
  onValidityChange,
  onProcessingChange,
}: PhotoStepProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const reset = () => {
    setPreview(null);
    setError(null);
    onValidityChange(false);
    setProcessing(false);
    onProcessingChange?.(false);
  };

  useEffect(() => {
    if (!file) {
      reset();
      return;
    }
    setProcessing(true);
    onProcessingChange?.(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (
          img.width < MIN_WIDTH ||
          img.height < MIN_HEIGHT ||
          img.width * img.height < 1_000_000
        ) {
          setError("Фото низкого качества (слишком маленькое/размытое)");
          setPreview(null);
          onValidityChange(false);
        } else {
          setPreview(url);
          setError(null);
          onValidityChange(true);
        }
        setProcessing(false);
        onProcessingChange?.(false);
      };
      img.onerror = () => {
        setError("Не удалось обработать фото. Повторить?");
        setProcessing(false);
        onProcessingChange?.(false);
        onValidityChange(false);
      };
      img.src = url;
    };
    reader.onerror = () => {
      setError("Не удалось обработать фото. Повторить?");
      setProcessing(false);
      onProcessingChange?.(false);
      onValidityChange(false);
    };
    reader.readAsDataURL(file);
  }, [file, onValidityChange]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const f = accepted[0];
      onFileChange(f);
    },
    [onFileChange]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/heic": [],
    },
    maxSize: MAX_SIZE,
    multiple: false,
    onDrop,
    onDropRejected: (rejections) => {
      const err = rejections[0];
      if (err.errors.some((e) => e.code === "file-too-large")) {
        setError("Файл слишком большой. До 15 МБ");
      } else {
        setError("Неподдерживаемый формат файла");
      }
      onFileChange(null);
      onValidityChange(false);
    },
  });

  const handleRemove = () => {
    onFileChange(null);
    setPreview(null);
    setError(null);
    onValidityChange(false);
    setProcessing(false);
    onProcessingChange?.(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Фото</h2>
      <div
        {...getRootProps({
          className:
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D9DBE1] bg-[#FAFAFC] p-8 text-center focus:outline-none",
          tabIndex: 0,
        })}
      >
        <input
          {...getInputProps({ accept: "image/*", capture: "environment" })}
          aria-labelledby="upload-label"
        />
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Предпросмотр"
              className="mx-auto max-h-80 w-full object-contain"
            />
            {hideFace && (
              <div className="absolute inset-0 backdrop-blur-md" aria-hidden="true" />
            )}
            {processing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2" id="upload-label">
            <span className="text-sm">Перетащите фото сюда или выберите файл</span>
            <span className="text-xs text-gray-600">
              JPG/PNG/HEIC/WEBP, до 15 МБ. Лучше — в полный рост при хорошем свете.
            </span>
            <button type="button" className="button mt-2">
              Выбрать файл
            </button>
          </div>
        )}
        {isDragActive && !preview && (
          <div className="absolute inset-0 rounded-xl border-2 border-[var(--brand-500)]" />
        )}
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={hideFace}
          onChange={(e) => onHideFaceChange(e.target.checked)}
        />
        Скрыть лицо
      </label>
      {preview && (
        <div className="flex gap-4">
          <button type="button" className="text-sm underline" onClick={() => onFileChange(null)}>
            Заменить фото
          </button>
          <button type="button" className="text-sm text-red-600 underline" onClick={handleRemove}>
            Удалить
          </button>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

