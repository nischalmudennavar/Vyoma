/* tslint:disable */
/* eslint-disable */

export class PollutionEngine {
    free(): void;
    [Symbol.dispose](): void;
    get_bortle_class(lat: number, lon: number): number;
    constructor(data: Uint8Array, width: number, height: number, origin_lon: number, origin_lat: number, pixel_width: number, pixel_height: number);
    render_image(nw_lat: number, nw_lng: number, se_lat: number, se_lng: number, width: number, height: number): Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_pollutionengine_free: (a: number, b: number) => void;
    readonly pollutionengine_get_bortle_class: (a: number, b: number, c: number) => number;
    readonly pollutionengine_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly pollutionengine_render_image: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
