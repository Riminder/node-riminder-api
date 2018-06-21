import Events from "./events";
import util from "tweetnacl-util";
import * as sha256 from "fast-sha256";
import events from "./events";

namespace Webhooks {
    export interface ResponseBase {
        type: string;
        message: string;
    }
    export interface ProfileParseResponse extends ResponseBase {
        profile: Profile;
    }

    export interface ProfileScoreResponse extends ResponseBase {
        profile: Profile;
        filter: Filter;
        score: number;
    }

    export interface FilterTrainResponse extends ResponseBase {
        filter: Filter;
    }

    export interface FilterScoreResponse extends ResponseBase {
        filter: Filter;
    }

    export type Response = ProfileParseResponse | ProfileScoreResponse | FilterTrainResponse | FilterScoreResponse;

    export interface Profile {
        profile_id: string;
        profile_reference: string;
    }

    export interface Filter {
        filter_id: string;
        filter_reference: string;
    }
}

export class Webhooks {
    webhookSecretKey: string;
    binding: Array<(data: Webhooks.Response) => any>;

    constructor(secretKey: string) {
        if (!secretKey) {
            throw new Error("The webhook secret key must be specified");
        }

        this.webhookSecretKey = secretKey;
        this.binding = [];
    }

    handleWebhook(headers: any): () => void {
        return () => {
            if (!headers["HTTP_RIMINDER_SIGNATURE"]) {
                throw new Error("The signature is missing from the headers");
            }

            const [encodedSignature, encodedPayload] = headers["HTTP_RIMINDER_SIGNATURE"].split(".");
            const signature = util.decodeBase64(encodedSignature);
            const expectedSignature = sha256.hmac(util.decodeUTF8(this.webhookSecretKey), util.decodeBase64(encodedPayload));

            if (signature !== expectedSignature) {
                throw new Error("The signature is invalid");
            }

            const payload: Webhooks.Response = JSON.parse(util.encodeUTF8(util.decodeBase64(encodedPayload)));

            if (!Events.includes(payload.type)) {
                throw new Error(`Unknown event: ${payload.type}`);
            }
            this._callBinding(payload);
        };
    }

    on(event: string, callback: (data: Webhooks.Response) => any) {
        if (!events.includes(event)) {
            throw new Error("This event doesn't exist");
        }

        if (this.binding[event]) {
            throw new Error("This callback already has been declared");
        }

        this.binding[event] = callback;

        return this;
    }

    _callBinding(payload: Webhooks.Response): void {
        if (this.binding[payload.type]) {
            this.binding[payload.type](payload);
        }
    }
}