import defaults from "../defaults";
import { generateURLParams } from "../utils";
import { httpRequest } from "../http";
var Filters = /** @class */ (function () {
    function Filters(riminder) {
        this.riminder = riminder;
    }
    Filters.prototype.getOne = function (options) {
        var urlParams = generateURLParams(options);
        return httpRequest(defaults.API_URL + "/filter?" + urlParams, { headers: this.riminder.headers });
    };
    Filters.prototype.getList = function () {
        return httpRequest(defaults.API_URL + "/filters", { headers: this.riminder.headers });
    };
    return Filters;
}());
export default Filters;
//# sourceMappingURL=filters.js.map