import Events from "./events";
import * as util from "tweetnacl-util";
import * as sha256 from "fast-sha256";
export class Webhooks {
    constructor(secretKey) {
        if (!secretKey) {
            throw new Error("The webhook secret key must be specified");
        }
        this.webhookSecretKey = secretKey;
        this.binding = new Map();
    }
    handleWebhook(headers) {
        return () => {
            if (!headers["HTTP_RIMINDER_SIGNATURE"]) {
                throw new Error("The signature is missing from the headers");
            }
            const [encodedSignature, encodedPayload] = headers["HTTP_RIMINDER_SIGNATURE"].split(".");
            const expectedSignature = util.encodeBase64(sha256.hmac(util.decodeUTF8(this.webhookSecretKey), util.decodeUTF8(encodedPayload)));
            if (encodedSignature !== expectedSignature) {
                throw new Error("The signature is invalid");
            }
            const payload = JSON.parse(util.encodeUTF8(util.decodeBase64(encodedPayload)));
            if (Events.indexOf(payload.type) < 0) {
                throw new Error(`Unknown event: ${payload.type}`);
            }
            this._callBinding(payload);
        };
    }
    on(event, callback) {
        if (Events.indexOf(event) < 0) {
            throw new Error("This event doesn't exist");
        }
        if (this.binding.has(event)) {
            throw new Error("This callback already has been declared");
        }
        this.binding.set(event, callback);
        return this;
    }
    _callBinding(payload) {
        if (this.binding.has(payload.type)) {
            this.binding.get(payload.type)(payload);
        }
    }
}
//# sourceMappingURL=webhooks.js.map