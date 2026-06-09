/* eslint-disable no-restricted-globals */
import init, { PollutionEngine } from "vyoma-core";

let engine: PollutionEngine | null = null;
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

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

      // Use the new Rust render_image method to get all pixels in one go
      const pixels = engine.render_image(
        nw.lat,
        nw.lng,
        se.lat,
        se.lng,
        canvas.width,
        canvas.height,
      );

      // Create ImageData directly from the WASM buffer
      const imageData = new ImageData(
        new Uint8ClampedArray(pixels),
        canvas.width,
        canvas.height,
      );

      ctx.putImageData(imageData, 0, 0);
      break;
    }

    case "GET_BORTLE": {
      if (!engine) return;
      const { lat, lng } = payload;
      const bortle = engine.get_bortle_class(lat, lng);
      self.postMessage({ type: "BORTLE_RESULT", payload: { bortle } });
      break;
    }
  }
};
