import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
var ProfileScoring = /** @class */ (function () {
    function ProfileScoring(riminder) {
        this.riminder = riminder;
    }
    ProfileScoring.prototype.get = function (options) {
        var urlParams = generateURLParams(options);
        return httpRequest(defaults.API_URL + "/profile/scoring?" + urlParams, { headers: this.riminder.headers });
    };
    return ProfileScoring;
}());
export default ProfileScoring;
//# sourceMappingURL=profileScoring.js.map