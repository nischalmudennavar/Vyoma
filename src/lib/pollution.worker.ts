/* eslint-disable no-restricted-globals */
import init, { PollutionEngine } from "vyoma-core";

let engine: PollutionEngine | null = null;
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

const BORTLE_COLORS: Record<number, [number, number, number, number]> = {
  1: [0, 0, 0, 0],
  2: [0, 0, 0, 0],
  3: [0, 0, 255, 60],
  4: [0, 255, 0, 60],
  5: [255, 255, 0, 60],
  6: [255, 128, 0, 60],
  7: [255, 0, 0, 70],
  8: [255, 255, 255, 100],
  9: [255, 200, 255, 120],
};

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case "INIT": {
      const { buffer, metadata } = payload;
      await init();
      engine = new PollutionEngine(
        new Uint8Array(buffer),
        metadata.width,
        metadata.height,
        metadata.origin_lon,
        metadata.origin_lat,
        metadata.pixel_width,
        metadata.pixel_height,
      );
      self.postMessage({ type: "READY" });
      break;
    }

    case "SET_CANVAS": {
      canvas = payload.canvas;
      ctx = canvas?.getContext("2d", { alpha: true }) ?? null;
      break;
    }

    case "RENDER": {
      if (!engine || !ctx || !canvas) return;

      const { nw, se, width, height, resolution } = payload;

      // Update canvas size if needed (avoid frequent resizing)
      const targetWidth = Math.floor(width * resolution);
      const targetHeight = Math.floor(height * resolution);
      
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      const latStep = (se.lat - nw.lat) / canvas.height;
      const lngStep = (se.lng - nw.lng) / canvas.width;

      for (let y = 0; y < canvas.height; y++) {
        const currentLat = nw.lat + y * latStep;
        for (let x = 0; x < canvas.width; x++) {
          const currentLng = nw.lng + x * lngStep;
          const bortle = engine.get_bortle_class(currentLat, currentLng);
          const color = BORTLE_COLORS[bortle] || BORTLE_COLORS[1];
          const index = (y * canvas.width + x) * 4;
          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];
        }
      }
      ctx.putImageData(imageData, 0, 0);
      break;
    }
  }
};
