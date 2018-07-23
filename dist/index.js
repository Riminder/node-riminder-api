"use strict";
var webhooks_1 = require("./webhooks");
var source_1 = require("./resources/source");
var filter_1 = require("./resources/filter");
var profile_1 = require("./resources/profile");
var Riminder = /** @class */ (function () {
    function Riminder(options) {
        if (!options.API_Key) {
            var error = new Error("No API Key was supplied for Riminder SDK");
            throw error;
        }
        this.API_Key = options.API_Key;
        this.headers = {
            "X-API-Key": this.API_Key
        };
        if (options.Webhooks_Key) {
            this.Webhooks_Key = options.Webhooks_Key;
        }
        this._init();
    }
    Riminder.prototype._init = function () {
        if (this.Webhooks_Key) {
            this.webhooks = new webhooks_1.Webhooks(this);
        }
        this.source = new source_1.default(this);
        this.filter = new filter_1.default(this);
        this.profile = new profile_1.default(this);
    };
    return Riminder;
}());
module.exports = Riminder;
//# sourceMappingURL=index.js.map