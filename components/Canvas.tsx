"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Toolbar } from "./Toolbar";
import { nanoid } from "nanoid";

type Tool = "select" | "arrow" | "rectangle" | "text";

interface CanvasProps {
  imageData: string;
  imageId: string;
}

export function Canvas({ imageData, imageId }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>("select");
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f3f4f6",
      selection: currentTool === "select",
    });

    fabricCanvasRef.current = canvas;

    // Load background image
    fabric.Image.fromURL(imageData, (img) => {
      const maxWidth = window.innerWidth - 100;
      const maxHeight = window.innerHeight - 200;

      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;

      const scale = Math.min(
        maxWidth / imgWidth,
        maxHeight / imgHeight,
        1
      );

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      canvas.setWidth(scaledWidth);
      canvas.setHeight(scaledHeight);

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: scale,
        scaleY: scale,
      });

      // Save initial state
      saveHistory();
    });

    return () => {
      canvas.dispose();
    };
  }, [imageData]);

  const saveHistory = () => {
    if (!fabricCanvasRef.current) return;

    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryStep((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyStep <= 0 || !fabricCanvasRef.current) return;

    const newStep = historyStep - 1;
    setHistoryStep(newStep);

    const json = history[newStep];
    fabricCanvasRef.current.loadFromJSON(json, () => {
      fabricCanvasRef.current?.renderAll();
    });
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = currentTool === "select";
    canvas.isDrawingMode = false;

    // Remove all event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    if (currentTool === "select") {
      canvas.defaultCursor = "default";
      return;
    }

    canvas.defaultCursor = "crosshair";
    canvas.selection = false;

    const handleMouseDown = (e: fabric.IEvent) => {
      if (!e.pointer) return;

      isDrawingRef.current = true;
      startPointRef.current = { x: e.pointer.x, y: e.pointer.y };

      if (currentTool === "text") {
        const text = new fabric.IText("Click to edit", {
          left: e.pointer.x,
          top: e.pointer.y,
          fill: currentColor,
          fontSize: 20,
          fontFamily: "Arial",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        isDrawingRef.current = false;
        saveHistory();
      }
    };

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isDrawingRef.current || !startPointRef.current || !e.pointer) return;

      const currentPoint = { x: e.pointer.x, y: e.pointer.y };
      const objects = canvas.getObjects();
      const lastObject = objects[objects.length - 1];

      if (currentTool === "rectangle") {
        if (lastObject && lastObject.data?.isDrawing) {
          canvas.remove(lastObject);
        }

        const width = currentPoint.x - startPointRef.current.x;
        const height = currentPoint.y - startPointRef.current.y;

        const rect = new fabric.Rect({
          left: startPointRef.current.x,
          top: startPointRef.current.y,
          width: Math.abs(width),
          height: Math.abs(height),
          fill: "transparent",
          stroke: currentColor,
          strokeWidth: 3,
          data: { isDrawing: true },
        });

        if (width < 0) rect.set({ left: currentPoint.x });
        if (height < 0) rect.set({ top: currentPoint.y });

        canvas.add(rect);
        canvas.renderAll();
      } else if (currentTool === "arrow") {
        if (lastObject && lastObject.data?.isDrawing) {
          canvas.remove(lastObject);
        }

        const arrow = createArrow(
          startPointRef.current.x,
          startPointRef.current.y,
          currentPoint.x,
          currentPoint.y,
          currentColor
        );
        arrow.data = { isDrawing: true };
        canvas.add(arrow);
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;
      startPointRef.current = null;

      const objects = canvas.getObjects();
      const lastObject = objects[objects.length - 1];
      if (lastObject && lastObject.data?.isDrawing) {
        delete lastObject.data.isDrawing;
        saveHistory();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [currentTool, currentColor]);

  const createArrow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 20;
    const headWidth = 15;

    const line = new fabric.Line([x1, y1, x2, y2], {
      stroke: color,
      strokeWidth: 4,
      selectable: true,
      evented: true,
    });

    const arrowHead = new fabric.Triangle({
      left: x2,
      top: y2,
      originX: "center",
      originY: "center",
      width: headWidth,
      height: headLength,
      fill: color,
      angle: (angle * 180) / Math.PI + 90,
      selectable: true,
      evented: true,
    });

    const group = new fabric.Group([line, arrowHead], {
      selectable: true,
      evented: true,
    });

    return group;
  };

  const handleSave = async () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
    });

    // Generate unique URL
    const shareId = nanoid(10);
    localStorage.setItem(`shared-${shareId}`, dataURL);

    // Copy to clipboard
    const url = `${window.location.origin}/share/${shareId}`;
    await navigator.clipboard.writeText(url);

    alert(`Saved! Share URL copied to clipboard:\n${url}`);
  };

  const handleDownload = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.download = `annotated-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        currentTool={currentTool}
        onToolChange={setCurrentTool}
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        onUndo={handleUndo}
        canUndo={historyStep > 0}
        onSave={handleSave}
        onDownload={handleDownload}
      />

      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="shadow-2xl rounded-lg overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
