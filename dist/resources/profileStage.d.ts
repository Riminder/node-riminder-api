import Riminder = require("..");
import { StagePatch } from "../types";
export default class ProfileStage {
    private riminder;
    constructor(riminder: Riminder);
    update(data: StagePatch): Promise<any>;
}
