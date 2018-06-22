import defaults from "../defaults";
import { httpPatchRequest } from "../http";
export default class ProfileRating {
    constructor(riminder) {
        this.riminder = riminder;
    }
    update(data) {
        let url = `${defaults.API_URL}/profile/rating`;
        return httpPatchRequest(url, data, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=profileRating.js.map