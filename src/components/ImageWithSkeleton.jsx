"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageWithSkeleton({ className = "", onLoad, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        {...props}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
      {!loaded && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-pulse bg-line/40"
        />
      )}
    </>
  );
}
