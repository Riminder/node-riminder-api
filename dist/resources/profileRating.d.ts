import Riminder from "..";
import { RatingPatch } from "../types";
export default class ProfileRating {
    private riminder;
    constructor(riminder: Riminder);
    update(data: RatingPatch): Promise<any>;
}
