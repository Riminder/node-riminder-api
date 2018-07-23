/// <reference types="node" />
import "fetch-everywhere";
import { ReadStream } from "fs";
export declare const httpRequest: (url: string, options?: any) => Promise<any>;
export declare const httpPostRequest: (url: string, data?: any, file?: ReadStream, options?: any) => Promise<any>;
export declare const httpPatchRequest: (url: string, data: any, options?: any) => Promise<any>;
