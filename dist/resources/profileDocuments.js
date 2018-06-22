import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
export default class ProfileDocuments {
    constructor(riminder) {
        this.riminder = riminder;
    }
    get(options) {
        const urlParams = generateURLParams(options);
        return httpRequest(`${defaults.API_URL}/profile/documents?${urlParams}`, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=profileDocuments.js.map