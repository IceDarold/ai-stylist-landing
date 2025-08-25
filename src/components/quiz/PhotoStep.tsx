import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Неподдерживаемый формат файла";
  }
  if (file.size > 15 * 1024 * 1024) {
    return "Файл слишком большой. До 15 МБ";
  }
  return null;
}

interface PhotoStepProps {
  file: File | null;
  hideFace: boolean;
  onChange: (file: File | null) => void;
  onHideFaceChange: (v: boolean) => void;
  onValidChange: (v: boolean) => void;
}

export default function PhotoStep({
  file,
  hideFace,
  onChange,
  onHideFaceChange,
  onValidChange,
}: PhotoStepProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setError(null);
      onValidChange(true);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
      onValidChange(false);
    }
  }, [file, onValidChange]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const err = validateFile(f);
    if (err) {
      setError(err);
      onChange(null);
      return;
    }
    onChange(f);
  };

  const openFile = () => inputRef.current?.click();

  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...dropProps}
          role="button"
          tabIndex={0}
          onClick={openFile}
          className={clsx(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center cursor-pointer",
            dragOver ? "bg-gray-50" : "bg-[#FAFAFC]",
            error ? "border-red-500" : "border-[#D9DBE1]"
          )}
        >
          <p className="mb-2 font-medium">
            Перетащите фото сюда или выберите файл
          </p>
          <p className="text-sm text-gray-500">
            JPG/PNG/HEIC/WEBP, до 15 МБ, лучше в полный рост
          </p>
          <button className="button mt-4" onClick={openFile}>
            Выбрать файл
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-lg bg-gray-50">
            <img
              src={preview}
              alt="Загруженное фото"
              className={clsx(
                "max-h-96 w-full object-contain",
                hideFace && "blur-md"
              )}
            />
            <div className="absolute inset-0 flex items-start justify-end gap-2 p-2">
              <button className="button" onClick={openFile}>
                Заменить фото
              </button>
              <button
                className="button"
                onClick={() => {
                  onChange(null);
                  setError(null);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
          {hideFace && (
            <div className="text-xs text-gray-600">
              Лицо будет скрыто на визуализациях
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={hideFace}
          onChange={(e) => onHideFaceChange(e.target.checked)}
        />
        Скрыть лицо
      </label>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <ul className="list-disc space-y-1 pl-5 text-xs text-gray-500">
        <li>Попросите ровную стойку, руки свободны</li>
        <li>Хороший свет, без сильных теней</li>
        <li>Одежда прилегающая — так точнее</li>
      </ul>
    </div>
  );
}

