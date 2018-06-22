import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
var ProfileDocuments = /** @class */ (function () {
    function ProfileDocuments(riminder) {
        this.riminder = riminder;
    }
    ProfileDocuments.prototype.get = function (options) {
        var urlParams = generateURLParams(options);
        return httpRequest(defaults.API_URL + "/profile/documents?" + urlParams, { headers: this.riminder.headers });
    };
    return ProfileDocuments;
}());
export default ProfileDocuments;
//# sourceMappingURL=profileDocuments.js.map