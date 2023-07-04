import React, { useState, useRef, useEffect } from "react";
import ColorPicker from "./ColorPicker";

const Canvas = ({ onDraw, receivedData, onSelectColor }) => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [zoomLevel, setZoomLevel] = useState(5);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const isDrawingRef = useRef(false);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    onSelectColor(color);
  };

  const handleCanvasMouseDown = (event) => {
    isDrawingRef.current = true;
    handleCanvasClick(event);
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleCanvasMouseMove = (event) => {
    if (isDrawingRef.current) {
      handleCanvasClick(event);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / zoomLevel);
    const y = Math.floor((event.clientY - rect.top) / zoomLevel);

    const pixel = { x, y, color: selectedColor };

    ctx.fillStyle = pixel.color;
    ctx.fillRect(x, y, 1, 1);

    pixelsRef.current.push(pixel);
    onDraw(pixel);
  };

  const handleScroll = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const zoomFactor = 1.1;
    const scrollDelta = Math.sign(event.deltaY);

    if (scrollDelta > 0) {
      // Zoom out
      setZoomLevel((prevZoom) => prevZoom / zoomFactor);
    } else {
      // Zoom in
      setZoomLevel((prevZoom) => prevZoom * zoomFactor);
    }

    // Clear entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw at new zoom level
    pixelsRef.current.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set initial zoom level
    ctx.scale(zoomLevel, zoomLevel);

    return () => {
      // Cleanup
      ctx.scale(1 / zoomLevel, 1 / zoomLevel);
    };
  }, [zoomLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    pixelsRef.current.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
    // Draw received data on canvas
    receivedData.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  }, [receivedData]);

  return (
    <div>
      <div className="color_selection">
        <ColorPicker onSelectColor={handleColorChange} />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        width="400"
        height="400"
      />
    </div>
  );
};

export default Canvas;
