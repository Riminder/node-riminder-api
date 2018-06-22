import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
var ProfileParsing = /** @class */ (function () {
    function ProfileParsing(riminder) {
        this.riminder = riminder;
    }
    ProfileParsing.prototype.get = function (options) {
        var urlParams = generateURLParams(options);
        return httpRequest(defaults.API_URL + "/profile/parsing?" + urlParams, { headers: this.riminder.headers });
    };
    return ProfileParsing;
}());
export default ProfileParsing;
//# sourceMappingURL=profileParsing.js.map