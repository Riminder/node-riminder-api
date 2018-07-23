import Riminder = require("..");
import { JsonUpload, JsonUploadCheck } from "../types";
export default class JSON {
    private riminder;
    constructor(riminder: Riminder);
    add(data: JsonUpload): Promise<any>;
    check(data: JsonUploadCheck): Promise<any>;
    private _tranformTimestamp;
}
