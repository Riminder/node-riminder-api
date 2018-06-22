import Events from "./events";
import * as util from "tweetnacl-util";
import * as sha256 from "fast-sha256";
var Webhooks = /** @class */ (function () {
    function Webhooks(secretKey) {
        if (!secretKey) {
            throw new Error("The webhook secret key must be specified");
        }
        this.webhookSecretKey = secretKey;
        this.binding = new Map();
    }
    Webhooks.prototype.handleWebhook = function (headers) {
        var _this = this;
        return function () {
            if (!headers["HTTP_RIMINDER_SIGNATURE"]) {
                throw new Error("The signature is missing from the headers");
            }
            var _a = headers["HTTP_RIMINDER_SIGNATURE"].split("."), encodedSignature = _a[0], encodedPayload = _a[1];
            var expectedSignature = util.encodeBase64(sha256.hmac(util.decodeUTF8(_this.webhookSecretKey), util.decodeUTF8(encodedPayload)));
            if (encodedSignature !== expectedSignature) {
                throw new Error("The signature is invalid");
            }
            var payload = JSON.parse(util.encodeUTF8(util.decodeBase64(encodedPayload)));
            if (Events.indexOf(payload.type) < 0) {
                throw new Error("Unknown event: " + payload.type);
            }
            _this._callBinding(payload);
        };
    };
    Webhooks.prototype.on = function (event, callback) {
        if (Events.indexOf(event) < 0) {
            throw new Error("This event doesn't exist");
        }
        if (this.binding.has(event)) {
            throw new Error("This callback already has been declared");
        }
        this.binding.set(event, callback);
        return this;
    };
    Webhooks.prototype._callBinding = function (payload) {
        if (this.binding.has(payload.type)) {
            this.binding.get(payload.type)(payload);
        }
    };
    return Webhooks;
}());
export { Webhooks };
//# sourceMappingURL=webhooks.js.map