import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
export default class ProfileScoring {
    constructor(riminder) {
        this.riminder = riminder;
    }
    get(options) {
        const urlParams = generateURLParams(options);
        return httpRequest(`${defaults.API_URL}/profile/scoring?${urlParams}`, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=profileScoring.js.map