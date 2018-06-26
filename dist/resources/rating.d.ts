import Riminder = require("..");
import { RatingPatch } from "../types";
export default class Rating {
    private riminder;
    constructor(riminder: Riminder);
    set(data: RatingPatch): Promise<any>;
}
