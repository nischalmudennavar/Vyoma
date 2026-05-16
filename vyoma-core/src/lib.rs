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
}
