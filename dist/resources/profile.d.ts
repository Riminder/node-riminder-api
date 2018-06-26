/// <reference types="node" />
import Riminder = require("..");
import { ProfilesOptions, ProfileOptionIdOrReference, ProfileUpload } from "../types";
import { ReadStream } from "fs";
import Document from "./document";
import Parsing from "./parsing";
import Scoring from "./scoring";
import Stage from "./stage";
import Rating from "./rating";
export default class Profile {
    private riminder;
    document: Document;
    parsing: Parsing;
    scoring: Scoring;
    stage: Stage;
    rating: Rating;
    constructor(riminder: Riminder);
    get(options: ProfileOptionIdOrReference): Promise<any>;
    list(options: ProfilesOptions): Promise<any>;
    add(data: ProfileUpload, file: ReadStream): Promise<any>;
}
