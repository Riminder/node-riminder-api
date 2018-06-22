import defaults from "../defaults";
import { httpPatchRequest } from "../http";
export default class ProfileStage {
    constructor(riminder) {
        this.riminder = riminder;
    }
    update(data) {
        let url = `${defaults.API_URL}/profile/stage`;
        return httpPatchRequest(url, data, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=profileStage.js.map