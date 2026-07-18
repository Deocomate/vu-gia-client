"use client";

import { useState } from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/media";

export default function SafeImage({ src, alt = "", ...props }) {
  const [failed, setFailed] = useState(false);
  const useFallback = failed || !src;
  return (
    <Image
      {...props}
      src={useFallback ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      onError={() => setFailed(true)}
      unoptimized={useFallback || props.unoptimized}
    />
  );
}
