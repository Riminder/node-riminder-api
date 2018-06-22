import defaults from "../defaults";
import { httpPatchRequest } from "../http";
var ProfileStage = /** @class */ (function () {
    function ProfileStage(riminder) {
        this.riminder = riminder;
    }
    ProfileStage.prototype.update = function (data) {
        var url = defaults.API_URL + "/profile/stage";
        return httpPatchRequest(url, data, { headers: this.riminder.headers });
    };
    return ProfileStage;
}());
export default ProfileStage;
//# sourceMappingURL=profileStage.js.map