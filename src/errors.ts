import { RiminderAPIResponse } from "./types";

export class APIError extends Error {
    response: RiminderAPIResponse;
    constructor(message: string, response: RiminderAPIResponse) {
        super(message);
        this.response = response;
    }
}