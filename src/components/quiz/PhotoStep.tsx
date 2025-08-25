import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface PhotoStepProps {
  file: File | null;
  hideFace: boolean;
  onFileChange: (file: File | null) => void;
  onHideFaceChange: (value: boolean) => void;
  onReadyChange: (ready: boolean) => void;
}

export default function PhotoStep({
  file,
  hideFace,
  onFileChange,
  onHideFaceChange,
  onReadyChange,
}: PhotoStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [faces, setFaces] = useState<DOMRect[]>([]);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);

  // load preview from existing file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onReadyChange(true);
      detectFaces(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
    onReadyChange(false);
  }, [file, detectFaces, onReadyChange]);

  const accepted = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setError(null);
    setProcessing(true);
    onReadyChange(false);

    if (!accepted.includes(f.type)) {
      setError("Неподдерживаемый формат файла");
      setProcessing(false);
      sendEvent("photo_upload_error", { reason: "type" });
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setError("Файл слишком большой. До 15 МБ");
      setProcessing(false);
      sendEvent("photo_upload_error", { reason: "size" });
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(f);
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    img.onload = () => {
      const { width, height } = img;
      setImgSize({ w: width, h: height });
      if (width < 800 || height < 1200 || width * height < 1_000_000) {
        setError("Фото низкого качества (слишком маленькое/размытое)");
        setProcessing(false);
        sendEvent("photo_upload_error", { reason: "quality" });
        cleanup();
        return;
      }
      onFileChange(f);
      setProcessing(false);
      onReadyChange(true);
      sendEvent("photo_upload_success", {
        size: f.size,
        width,
        height,
        format: f.type,
      });
      cleanup();
    };
    img.onerror = () => {
      setError("Не удалось обработать фото. Повторить?");
      setProcessing(false);
      sendEvent("photo_upload_error", { reason: "load" });
      cleanup();
    };
    img.src = objectUrl;
  };

  const detectFaces = useCallback(
    (url: string) => {
      if (!hideFace) {
        setFaces([]);
        return;
      }
      if (typeof window === "undefined") return;
      interface FaceDetectorType {
        detect: (img: HTMLImageElement) => Promise<{
          boundingBox: DOMRect;
        }[]>;
      }
      const FaceDetectorCtor = (window as unknown as {
        FaceDetector?: new () => FaceDetectorType;
      }).FaceDetector;
      if (!FaceDetectorCtor) {
        setFaces([]);
        return;
      }
      const detector = new FaceDetectorCtor();
      const img = new Image();
      img.onload = async () => {
        try {
          const res = await detector.detect(img);
          setImgSize({ w: img.width, h: img.height });
          setFaces(res.map((r) => r.boundingBox));
        } catch {
          setFaces([]);
        }
      };
      img.src = url;
    },
    [hideFace]
  );

  const openDialog = () => {
    inputRef.current?.click();
    sendEvent("photo_select_click");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
    sendEvent("photo_drag_drop");
  };

  const deleteFile = () => {
    setPreview(null);
    onFileChange(null);
    onReadyChange(false);
    setFaces([]);
    setImgSize(null);
  };

  const toggleHide = (v: boolean) => {
    onHideFaceChange(v);
    if (preview) detectFaces(preview);
    sendEvent("hide_face_toggle", { value: v });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Фото</h2>
      {!preview && (
        <div
          role="button"
          tabIndex={0}
          onClick={openDialog}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openDialog();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={clsx(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center",
            drag
              ? "border-[var(--brand-500)] bg-[var(--brand-50)]"
              : "border-gray-300 bg-[#FAFAFC]"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-label="Выберите файл"
          />
          <div className="mb-2 text-sm font-medium">
            Перетащите фото сюда или выберите файл
          </div>
          <div className="text-xs text-gray-500">
            JPG/PNG/HEIC/WEBP, до 15 МБ. Лучше — в полный рост при хорошем
            свете.
          </div>
          <button type="button" className="button mt-4">
            Выбрать файл
          </button>
        </div>
      )}
      {preview && (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={preview}
              alt="Предпросмотр"
              className="mx-auto max-h-80 w-full object-contain"
            />
            {hideFace &&
              faces.map((f, idx) => (
                <div
                  key={idx}
                  className="absolute bg-white/40 backdrop-blur-sm"
                  style={{
                    left: `${(f.left / (imgSize?.w || 1)) * 100}%`,
                    top: `${(f.top / (imgSize?.h || 1)) * 100}%`,
                    width: `${(f.width / (imgSize?.w || 1)) * 100}%`,
                    height: `${(f.height / (imgSize?.h || 1)) * 100}%`,
                  }}
                />
              ))}
            {hideFace && faces.length === 0 && (
              <div className="absolute bottom-2 left-1/2 w-max -translate-x-1/2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                Лицо на фото не обнаружено — блюр не применён
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3">
            <button type="button" className="button" onClick={openDialog}>
              Заменить фото
            </button>
            <button type="button" className="button" onClick={deleteFile}>
              Удалить
            </button>
          </div>
        </div>
      )}
      {processing && <div className="text-sm">Загрузка...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <label className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={hideFace}
          onChange={(e) => toggleHide(e.target.checked)}
        />
        Скрыть лицо
      </label>
      <ul className="list-disc space-y-1 pl-5 text-xs text-gray-500">
        <li>Попросите ровную стойку, руки свободны</li>
        <li>Хороший свет, без сильных теней</li>
        <li>Одежда прилегающая — так точнее</li>
      </ul>
    </div>
  );
}

function sendEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    const win = window as {
      plausible?: (e: string, o?: Record<string, unknown>) => void;
    };
    win.plausible?.(event, props);
  }
}

