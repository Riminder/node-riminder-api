import defaults from "../defaults";
import { httpPatchRequest } from "../http";
var ProfileRating = /** @class */ (function () {
    function ProfileRating(riminder) {
        this.riminder = riminder;
    }
    ProfileRating.prototype.update = function (data) {
        var url = defaults.API_URL + "/profile/rating";
        return httpPatchRequest(url, data, { headers: this.riminder.headers });
    };
    return ProfileRating;
}());
export default ProfileRating;
//# sourceMappingURL=profileRating.js.map