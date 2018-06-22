import defaults from "../defaults";
import { httpRequest } from "../http";
export default class Sources {
    constructor(riminder) {
        this.riminder = riminder;
    }
    getOne(id) {
        return httpRequest(`${defaults.API_URL}/source?source_id=${id}`, { headers: this.riminder.headers });
    }
    getList() {
        return httpRequest(`${defaults.API_URL}/sources`, { headers: this.riminder.headers });
    }
}
//# sourceMappingURL=sources.js.map