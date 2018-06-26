import { RiminderAPIResponse } from "./types";
export declare class APIError extends Error {
    response: RiminderAPIResponse;
    constructor(message: string, response: RiminderAPIResponse);
}
