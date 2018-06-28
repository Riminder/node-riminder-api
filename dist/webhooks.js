"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("./events");
var util = require("tweetnacl-util");
var sha256 = require("fast-sha256");
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
            if (!headers["HTTP-RIMINDER-SIGNATURE"]) {
                throw new Error("The signature is missing from the headers");
            }
            var _a = headers["HTTP-RIMINDER-SIGNATURE"].split("."), encodedSignature = _a[0], encodedPayload = _a[1];
            var expectedSignature = util.encodeBase64(sha256.hmac(util.decodeUTF8(_this.webhookSecretKey), util.decodeUTF8(encodedPayload)));
            if (encodedSignature !== expectedSignature) {
                throw new Error("The signature is invalid");
            }
            var payload = JSON.parse(util.encodeUTF8(util.decodeBase64(encodedPayload)));
            if (events_1.default.indexOf(payload.type) < 0) {
                throw new Error("Unknown event: " + payload.type);
            }
            _this._callBinding(payload);
        };
    };
    Webhooks.prototype.on = function (event, callback) {
        if (events_1.default.indexOf(event) < 0) {
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
exports.Webhooks = Webhooks;
//# sourceMappingURL=webhooks.js.map