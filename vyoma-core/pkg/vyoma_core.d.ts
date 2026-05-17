/* tslint:disable */
/* eslint-disable */

export class PollutionEngine {
    free(): void;
    [Symbol.dispose](): void;
    get_bortle_class(lat: number, lon: number): number;
    get_viewport_dark_sites(north: number, south: number, east: number, west: number, stride: number, max_bortle: number): Float64Array;
    constructor(data: Uint8Array, width: number, height: number, origin_lon: number, origin_lat: number, pixel_width: number, pixel_height: number);
}

export function get_viewport_dark_sites(north: number, south: number, east: number, west: number, stride: number, max_bortle: number, map_data: Uint8Array, width: number, height: number, origin_lon: number, origin_lat: number, pixel_width: number, pixel_height: number): Float64Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_pollutionengine_free: (a: number, b: number) => void;
    readonly get_viewport_dark_sites: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => [number, number];
    readonly pollutionengine_get_bortle_class: (a: number, b: number, c: number) => number;
    readonly pollutionengine_get_viewport_dark_sites: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly pollutionengine_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
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
