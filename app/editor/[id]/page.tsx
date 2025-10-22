"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Canvas } from "@/components/Canvas";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const stored = localStorage.getItem(`image-${id}`);

    if (!stored) {
      router.push("/");
      return;
    }

    setImageData(stored);
  }, [params.id, router]);

  if (!imageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Canvas imageData={imageData} imageId={params.id as string} />
    </div>
  );
}
