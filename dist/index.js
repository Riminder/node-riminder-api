"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webhooks_1 = require("./webhooks");
var sources_1 = require("./resources/sources");
var filters_1 = require("./resources/filters");
var profiles_1 = require("./resources/profiles");
var profileDocuments_1 = require("./resources/profileDocuments");
var profileParsing_1 = require("./resources/profileParsing");
var profileScoring_1 = require("./resources/profileScoring");
var profileRating_1 = require("./resources/profileRating");
var profileStage_1 = require("./resources/profileStage");
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
            this.webhooks = new webhooks_1.Webhooks(this.Webhooks_Key);
        }
        this.sources = new sources_1.default(this);
        this.filters = new filters_1.default(this);
        this.profiles = new profiles_1.default(this);
        this.profileDocuments = new profileDocuments_1.default(this);
        this.profileParsing = new profileParsing_1.default(this);
        this.profileScoring = new profileScoring_1.default(this);
        this.profileRating = new profileRating_1.default(this);
        this.profileStage = new profileStage_1.default(this);
    };
    return Riminder;
}());
exports.default = Riminder;
//# sourceMappingURL=index.js.map