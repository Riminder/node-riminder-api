/// <reference types="node" />
import Riminder = require("..");
import { ProfilesOptions, ProfileOptionIdOrReference, ProfileUpload } from "../types";
import { ReadStream } from "fs";
export default class Profiles {
    private riminder;
    constructor(riminder: Riminder);
    getOne(options: ProfileOptionIdOrReference): Promise<any>;
    getList(options: ProfilesOptions): Promise<any>;
    create(data: ProfileUpload, file: ReadStream): Promise<any>;
}
