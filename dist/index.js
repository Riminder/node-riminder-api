import { Webhooks } from "./webhooks";
import Sources from "./resources/sources";
import Filters from "./resources/filters";
import Profiles from "./resources/profiles";
import ProfileDocuments from "./resources/profileDocuments";
import ProfileParsing from "./resources/profileParsing";
import ProfileScoring from "./resources/profileScoring";
import ProfileRating from "./resources/profileRating";
import ProfileStage from "./resources/profileStage";
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
            this.webhooks = new Webhooks(this.Webhooks_Key);
        }
        this.sources = new Sources(this);
        this.filters = new Filters(this);
        this.profiles = new Profiles(this);
        this.profileDocuments = new ProfileDocuments(this);
        this.profileParsing = new ProfileParsing(this);
        this.profileScoring = new ProfileScoring(this);
        this.profileRating = new ProfileRating(this);
        this.profileStage = new ProfileStage(this);
    };
    return Riminder;
}());
export default Riminder;
//# sourceMappingURL=index.js.map