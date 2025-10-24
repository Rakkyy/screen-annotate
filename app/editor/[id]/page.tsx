"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Canvas } from "@/components/Canvas";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const id = params.id as string;

      try {
        // Fetch image URL from API
        const response = await fetch(`/api/image/${id}`);

        if (!response.ok) {
          router.push("/");
          return;
        }

        const { url } = await response.json();
        setImageData(url);
      } catch (error) {
        console.error('Failed to fetch image:', error);
        router.push("/");
      }
    };

    fetchImage();
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
