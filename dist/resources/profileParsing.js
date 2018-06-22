import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
export default class ProfileParsing {
    constructor(riminder) {
        this.riminder = riminder;
    }
    get(options) {
        const urlParams = generateURLParams(options);
        return httpRequest(`${defaults.API_URL}/profile/parsing?${urlParams}`, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=profileParsing.js.map