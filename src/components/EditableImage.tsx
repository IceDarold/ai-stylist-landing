"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  slotId: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  containerClassName?: string;
};

export function EditableImage({
  slotId,
  fallbackSrc,
  alt,
  className,
  priority,
  sizes,
  fill,
  width,
  height,
  containerClassName,
}: Props) {
  const [src, setSrc] = useState<string>(fallbackSrc);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // resolve current URL for the slot
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/images/${encodeURIComponent(slotId)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to resolve image");
        const data = (await res.json()) as { url?: string };
        if (!cancelled && data?.url) setSrc(data.url);
      } catch {
        // fallback already set
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slotId, fallbackSrc]);

  // detect admin-mode (non-httpOnly cookie just to show UI)
  useEffect(() => {
    const check = () => setIsAdmin(document.cookie.includes("admin_mode=1"));
    check();
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const onPick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("slotId", slotId);
      fd.append("file", file, file.name);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Upload failed");
      }
      const data = (await res.json()) as { url?: string };
      if (data?.url) {
        // bust client cache
        setSrc(`${data.url}${data.url.includes("?") ? "&" : "?"}t=${Date.now()}`);
      }
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить изображение. Проверьте формат/размер и авторизацию.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [slotId]);

  return (
    <div className={`group relative ${containerClassName ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        priority={priority}
        sizes={sizes}
        {...(fill ? { fill: true } : { width, height })}
        className={className}
        unoptimized={/^https?:\/\//.test(src)}
      />

      {isAdmin && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
          <button
            type="button"
            onClick={onPick}
            className="absolute right-2 top-2 z-20 rounded-md bg-black/60 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            disabled={loading}
            aria-label="Загрузить изображение"
            title="Загрузить изображение"
          >
            {loading ? "Загрузка…" : "Upload"}
          </button>
        </>
      )}
    </div>
  );
}
