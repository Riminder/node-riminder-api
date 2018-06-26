import Riminder = require("..");
import { StagePatch } from "../types";
export default class Stage {
    private riminder;
    constructor(riminder: Riminder);
    set(data: StagePatch): Promise<any>;
}
