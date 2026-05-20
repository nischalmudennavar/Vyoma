use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PollutionEngine {
    data: Vec<u8>,
    width: usize,
    height: usize,
    origin_lon: f64,
    origin_lat: f64,
    pixel_width: f64,
    pixel_height: f64,
}

#[wasm_bindgen]
impl PollutionEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(
        data: Vec<u8>,
        width: usize,
        height: usize,
        origin_lon: f64,
        origin_lat: f64,
        pixel_width: f64,
        pixel_height: f64,
    ) -> PollutionEngine {
        PollutionEngine {
            data,
            width,
            height,
            origin_lon,
            origin_lat,
            pixel_width,
            pixel_height,
        }
    }

    pub fn get_bortle_class(&self, lat: f64, lon: f64) -> u8 {
        // Convert geographic coordinates to flat map pixels
        let x_f = (lon - self.origin_lon) / self.pixel_width;
        let y_f = (lat - self.origin_lat) / self.pixel_height;

        // Boundary checks
        if x_f < 0.0 || y_f < 0.0 {
            return 1;
        }

        let x = x_f as usize;
        let y = y_f as usize;

        if x >= self.width || y >= self.height {
            return 1;
        }

        // Calculate the exact 1D memory array offset
        let offset = (y * self.width) + x;

        // Return the specific byte
        if offset < self.data.len() {
            let val = self.data[offset];
            if val == 0 {
                1
            } else {
                val
            } // 0 is ocean/unmapped
        } else {
            1
        }
    }

    pub fn render_image(
        &self,
        nw_lat: f64,
        nw_lng: f64,
        se_lat: f64,
        se_lng: f64,
        width: usize,
        height: usize,
    ) -> Vec<u8> {
        let mut pixels = Vec::with_capacity(width * height * 4);

        let lat_step = (se_lat - nw_lat) / (height as f64);
        let lng_step = (se_lng - nw_lng) / (width as f64);

        for y in 0..height {
            let current_lat = nw_lat + (y as f64) * lat_step;
            for x in 0..width {
                let current_lng = nw_lng + (x as f64) * lng_step;
                let bortle = self.get_bortle_class(current_lat, current_lng);

                // Map Bortle class to RGBA
                // Matches the palette in pollution.worker.ts
                let color = match bortle {
                    3 => (0, 0, 255, 60),
                    4 => (0, 255, 0, 60),
                    5 => (255, 255, 0, 60),
                    6 => (255, 128, 0, 60),
                    7 => (255, 0, 0, 70),
                    8 => (255, 255, 255, 100),
                    9 => (255, 200, 255, 120),
                    _ => (0, 0, 0, 0),
                };

                pixels.push(color.0);
                pixels.push(color.1);
                pixels.push(color.2);
                pixels.push(color.3);
            }
        }

        pixels
    }
}
