import Riminder from "..";
import { ProfileOptionIdOrReference } from "../types";
export default class ProfileScoring {
    private riminder;
    constructor(riminder: Riminder);
    get(options: ProfileOptionIdOrReference): Promise<any>;
}
