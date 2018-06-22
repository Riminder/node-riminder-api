import Riminder from "..";
import { ProfileOptionIdOrReference } from "../types";
export default class ProfileDocuments {
    private riminder;
    constructor(riminder: Riminder);
    get(options: ProfileOptionIdOrReference): Promise<any>;
}
