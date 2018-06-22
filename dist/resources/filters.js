import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
export default class Filters {
    constructor(riminder) {
        this.riminder = riminder;
    }
    getOne(options) {
        const urlParams = generateURLParams(options);
        return httpRequest(`${defaults.API_URL}/filter?${urlParams}`, { headers: this.riminder.headers });
    }
    getList() {
        return httpRequest(`${defaults.API_URL}/filters`, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=filters.js.map