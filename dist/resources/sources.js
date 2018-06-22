import defaults from "../defaults";
import { httpRequest } from "../http";
var Sources = /** @class */ (function () {
    function Sources(riminder) {
        this.riminder = riminder;
    }
    Sources.prototype.getOne = function (id) {
        return httpRequest(defaults.API_URL + "/source?source_id=" + id, { headers: this.riminder.headers });
    };
    Sources.prototype.getList = function () {
        return httpRequest(defaults.API_URL + "/sources", { headers: this.riminder.headers });
    };
    return Sources;
}());
export default Sources;
//# sourceMappingURL=sources.js.map