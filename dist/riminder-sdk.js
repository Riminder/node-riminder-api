(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.riminderSdk = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
var globalObj = typeof self !== 'undefined' && self || this;
module.exports = globalObj.fetch.bind(globalObj);

},{"whatwg-fetch":3}],2:[function(require,module,exports){
/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;

},{}],3:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defaults = {
    API_URL: "https://www.riminder.net/sf/public/api/v1.0",
    API_SECRET: null,
    API_Key: null
};
exports.default = defaults;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var APIError = exports.APIError = function (_Error) {
    _inherits(APIError, _Error);

    function APIError(message, response) {
        _classCallCheck(this, APIError);

        var _this = _possibleConstructorReturn(this, (APIError.__proto__ || Object.getPrototypeOf(APIError)).call(this, message));

        _this.response = response;
        return _this;
    }

    return APIError;
}(Error);

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.httpPatchRequest = exports.httpPostRequest = exports.httpRequest = undefined;

require("fetch-everywhere");

var _errors = require("./errors");

var FormData = require("form-data");
var httpRequest = exports.httpRequest = function httpRequest(url, options) {
    var opts = Object.assign({ credentials: "include" }, options);
    return fetch(url, opts).then(successHandler, errorHandler).then(function (json) {
        return json.data;
    });
};
var httpPostRequest = exports.httpPostRequest = function httpPostRequest(url, data, file, options) {
    var body = generateBody(data, file);
    var opts = Object.assign({}, options, { method: "POST", body: body });
    return fetch(url, opts).then(successHandler, errorHandler).then(function (json) {
        return json.data;
    });
};
var httpPatchRequest = exports.httpPatchRequest = function httpPatchRequest(url, data, options) {
    Object.assign(options.headers, { "Content-type": "application/json" });
    var body = JSON.stringify(data);
    var opts = Object.assign({}, options, { method: "PATCH", body: body });
    return fetch(url, opts).then(successHandler, errorHandler).then(function (json) {
        return json.data;
    });
};
var successHandler = function successHandler(response) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    return response.json().then(function (data) {
        throw new _errors.APIError("An error occured", data);
    });
};
var errorHandler = function errorHandler(err) {
    var error = new Error(err.message);
    error.response = err;
    return Promise.reject(error);
};
var generateBody = function generateBody(data, file) {
    var body = new FormData();
    if (file) {
        body.append("file", file);
    }
    Object.keys(data).forEach(function (key) {
        if (data[key] instanceof Array) {
            data[key].forEach(function (obj) {
                body.append(key, JSON.stringify(obj));
            });
        } else {
            body.append(key, data[key]);
        }
    });
    return body;
};

},{"./errors":5,"fetch-everywhere":1,"form-data":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Riminder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = require("./objects");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Riminder = exports.Riminder = function () {
    function Riminder(options) {
        _classCallCheck(this, Riminder);

        if (!options.API_Key) {
            var error = new Error("No API Key was supplied for Riminder SDK");
            throw error;
        }
        this.API_Key = options.API_Key;
        this._init();
    }

    _createClass(Riminder, [{
        key: "_init",
        value: function _init() {
            this.objects = new _objects.Objects(this);
            this.webhooks = {};
        }
    }]);

    return Riminder;
}();

},{"./objects":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Objects = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

var _http = require("./http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Objects = exports.Objects = function () {
    function Objects(riminder) {
        _classCallCheck(this, Objects);

        this.headers = {
            "X-API-Key": riminder.API_Key
        };
    }

    _createClass(Objects, [{
        key: "getSources",
        value: function getSources() {
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/sources", { headers: this.headers });
        }
    }, {
        key: "getSource",
        value: function getSource(id) {
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/source?source_id=" + id, { headers: this.headers });
        }
    }, {
        key: "getFilters",
        value: function getFilters() {
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/filters", { headers: this.headers });
        }
    }, {
        key: "getFilter",
        value: function getFilter(options) {
            var urlParams = (0, _utils.generateURLParams)(options);
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/filter?" + urlParams, { headers: this.headers });
        }
    }, {
        key: "getProfiles",
        value: function getProfiles(options) {
            if (options.date_end && _typeof(options.date_end) === "object") {
                options.date_end = Math.floor(options.date_end.getTime() / 1000);
            }
            if (options.date_start && _typeof(options.date_start) === "object") {
                options.date_start = Math.floor(options.date_start.getTime() / 1000);
            }
            var urlParams = (0, _utils.generateURLParams)(options);
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/profiles?" + urlParams, { headers: this.headers });
        }
    }, {
        key: "getProfile",
        value: function getProfile(options) {
            var urlParams = (0, _utils.generateURLParams)(options);
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/profile?" + urlParams, { headers: this.headers });
        }
    }, {
        key: "postResumeForProfile",
        value: function postResumeForProfile(data, file) {
            if (data.timestamp_reception && _typeof(data.timestamp_reception) === "object") {
                data.timestamp_reception = Math.floor(data.timestamp_reception.getTime() / 1000);
            }
            if (data.training_metadata) {
                data.training_metadata.forEach(function (metadata) {
                    if (_typeof(metadata.rating_timestamp) === "object") {
                        metadata.rating_timestamp = Math.floor(metadata.rating_timestamp.getTime() / 1000);
                    }
                    if (_typeof(metadata.stage_timestamp) === "object") {
                        metadata.stage_timestamp = Math.floor(metadata.stage_timestamp.getTime() / 1000);
                    }
                });
            }
            var url = _defaults2.default.API_URL + "/profile";
            return (0, _http.httpPostRequest)(url, data, file, { headers: this.headers });
        }
    }, {
        key: "getProfileDocuments",
        value: function getProfileDocuments(options) {
            var urlParams = (0, _utils.generateURLParams)(options);
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/profile/documents?" + urlParams, { headers: this.headers });
        }
    }, {
        key: "getProfileParsing",
        value: function getProfileParsing(options) {
            var urlParams = (0, _utils.generateURLParams)(options);
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/profile/parsing?" + urlParams, { headers: this.headers });
        }
    }, {
        key: "getProfileScoring",
        value: function getProfileScoring(options) {
            var urlParams = (0, _utils.generateURLParams)(options);
            return (0, _http.httpRequest)(_defaults2.default.API_URL + "/profile/scoring?" + urlParams, { headers: this.headers });
        }
    }, {
        key: "patchProfileStage",
        value: function patchProfileStage(data) {
            var url = _defaults2.default.API_URL + "/profile/stage";
            return (0, _http.httpPatchRequest)(url, data, { headers: this.headers });
        }
    }, {
        key: "patchProfileRating",
        value: function patchProfileRating(data) {
            var url = _defaults2.default.API_URL + "/profile/rating";
            return (0, _http.httpPatchRequest)(url, data, { headers: this.headers });
        }
    }]);

    return Objects;
}();

},{"./defaults":4,"./http":6,"./utils":9}],9:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var generateURLParams = exports.generateURLParams = function generateURLParams(options) {
    return options ? Object.keys(options).map(function (key) {
        if (options[key] instanceof Array) {
            return key + "=[" + options[key].map(function (elem) {
                return "\"" + elem + "\"";
            }).join(",") + "]";
        }
        return key + "=" + options[key];
    }).join("&") : null;
};
var isNode = exports.isNode = "undefined" !== typeof global && "[object global]" === Object.prototype.toString.call(global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[7])(7)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmV0Y2gtZXZlcnl3aGVyZS9mZXRjaC1ucG0tYnJvd3NlcmlmeS5qcyIsIm5vZGVfbW9kdWxlcy9mb3JtLWRhdGEvbGliL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwidGVtcC9kZWZhdWx0cy5qcyIsInRlbXAvZXJyb3JzLmpzIiwidGVtcC9odHRwLmpzIiwidGVtcC9pbmRleC5qcyIsInRlbXAvb2JqZWN0cy5qcyIsInRlbXAvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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dCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gdGhlIHdoYXR3Zy1mZXRjaCBwb2x5ZmlsbCBpbnN0YWxscyB0aGUgZmV0Y2goKSBmdW5jdGlvblxuLy8gb24gdGhlIGdsb2JhbCBvYmplY3QgKHdpbmRvdyBvciBzZWxmKVxuLy9cbi8vIFJldHVybiB0aGF0IGFzIHRoZSBleHBvcnQgZm9yIHVzZSBpbiBXZWJwYWNrLCBCcm93c2VyaWZ5IGV0Yy5cbnJlcXVpcmUoJ3doYXR3Zy1mZXRjaCcpO1xudmFyIGdsb2JhbE9iaiA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIHx8IHRoaXM7XG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbE9iai5mZXRjaC5iaW5kKGdsb2JhbE9iaik7XG4iLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgPyBzZWxmLkZvcm1EYXRhIDogd2luZG93LkZvcm1EYXRhO1xuIiwiKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICAgIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gICAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4iLCJsZXQgZGVmYXVsdHMgPSB7XG4gICAgQVBJX1VSTDogXCJodHRwczovL3d3dy5yaW1pbmRlci5uZXQvc2YvcHVibGljL2FwaS92MS4wXCIsXG4gICAgQVBJX1NFQ1JFVDogbnVsbCxcbiAgICBBUElfS2V5OiBudWxsXG59O1xuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHM7XG4iLCJleHBvcnQgY2xhc3MgQVBJRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgXCJmZXRjaC1ldmVyeXdoZXJlXCI7XG5jb25zdCBGb3JtRGF0YSA9IHJlcXVpcmUoXCJmb3JtLWRhdGFcIik7XG5pbXBvcnQgeyBBUElFcnJvciB9IGZyb20gXCIuL2Vycm9yc1wiO1xuZXhwb3J0IGNvbnN0IGh0dHBSZXF1ZXN0ID0gKHVybCwgb3B0aW9ucykgPT4ge1xuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7IGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIiB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRzKVxuICAgICAgICAudGhlbihzdWNjZXNzSGFuZGxlciwgZXJyb3JIYW5kbGVyKVxuICAgICAgICAudGhlbigoanNvbikgPT4ganNvbi5kYXRhKTtcbn07XG5leHBvcnQgY29uc3QgaHR0cFBvc3RSZXF1ZXN0ID0gKHVybCwgZGF0YSwgZmlsZSwgb3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBnZW5lcmF0ZUJvZHkoZGF0YSwgZmlsZSk7XG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgbWV0aG9kOiBcIlBPU1RcIiwgYm9keSB9KTtcbiAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRzKVxuICAgICAgICAudGhlbihzdWNjZXNzSGFuZGxlciwgZXJyb3JIYW5kbGVyKVxuICAgICAgICAudGhlbigoanNvbikgPT4ganNvbi5kYXRhKTtcbn07XG5leHBvcnQgY29uc3QgaHR0cFBhdGNoUmVxdWVzdCA9ICh1cmwsIGRhdGEsIG9wdGlvbnMpID0+IHtcbiAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMuaGVhZGVycywgeyBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcbiAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgbWV0aG9kOiBcIlBBVENIXCIsIGJvZHkgfSk7XG4gICAgcmV0dXJuIGZldGNoKHVybCwgb3B0cylcbiAgICAgICAgLnRoZW4oc3VjY2Vzc0hhbmRsZXIsIGVycm9ySGFuZGxlcilcbiAgICAgICAgLnRoZW4oKGpzb24pID0+IGpzb24uZGF0YSk7XG59O1xuY29uc3Qgc3VjY2Vzc0hhbmRsZXIgPSAocmVzcG9uc2UpID0+IHtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDAgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBBUElFcnJvcihcIkFuIGVycm9yIG9jY3VyZWRcIiwgZGF0YSk7XG4gICAgfSk7XG59O1xuY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgZXJyb3IucmVzcG9uc2UgPSBlcnI7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbn07XG5jb25zdCBnZW5lcmF0ZUJvZHkgPSAoZGF0YSwgZmlsZSkgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgICBib2R5LmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoZGF0YVtrZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGRhdGFba2V5XS5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICBib2R5LmFwcGVuZChrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBib2R5LmFwcGVuZChrZXksIGRhdGFba2V5XSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYm9keTtcbn07XG4iLCJpbXBvcnQgeyBPYmplY3RzIH0gZnJvbSBcIi4vb2JqZWN0c1wiO1xuZXhwb3J0IGNsYXNzIFJpbWluZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5BUElfS2V5KSB7XG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoXCJObyBBUEkgS2V5IHdhcyBzdXBwbGllZCBmb3IgUmltaW5kZXIgU0RLXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5BUElfS2V5ID0gb3B0aW9ucy5BUElfS2V5O1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfVxuICAgIF9pbml0KCkge1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBuZXcgT2JqZWN0cyh0aGlzKTtcbiAgICAgICAgdGhpcy53ZWJob29rcyA9IHt9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGdlbmVyYXRlVVJMUGFyYW1zIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBkZWZhdWx0cyBmcm9tIFwiLi9kZWZhdWx0c1wiO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QsIGh0dHBQb3N0UmVxdWVzdCwgaHR0cFBhdGNoUmVxdWVzdCB9IGZyb20gXCIuL2h0dHBcIjtcbmV4cG9ydCBjbGFzcyBPYmplY3RzIHtcbiAgICBjb25zdHJ1Y3RvcihyaW1pbmRlcikge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSB7XG4gICAgICAgICAgICBcIlgtQVBJLUtleVwiOiByaW1pbmRlci5BUElfS2V5LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRTb3VyY2VzKCkge1xuICAgICAgICByZXR1cm4gaHR0cFJlcXVlc3QoYCR7ZGVmYXVsdHMuQVBJX1VSTH0vc291cmNlc2AsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBnZXRTb3VyY2UoaWQpIHtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L3NvdXJjZT9zb3VyY2VfaWQ9JHtpZH1gLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgZ2V0RmlsdGVycygpIHtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L2ZpbHRlcnNgLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgZ2V0RmlsdGVyKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gZ2VuZXJhdGVVUkxQYXJhbXMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdChgJHtkZWZhdWx0cy5BUElfVVJMfS9maWx0ZXI/JHt1cmxQYXJhbXN9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIGdldFByb2ZpbGVzKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZGF0ZV9lbmQgJiYgdHlwZW9mIG9wdGlvbnMuZGF0ZV9lbmQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGF0ZV9lbmQgPSBNYXRoLmZsb29yKG9wdGlvbnMuZGF0ZV9lbmQuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZGF0ZV9zdGFydCAmJiB0eXBlb2Ygb3B0aW9ucy5kYXRlX3N0YXJ0ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zLmRhdGVfc3RhcnQgPSBNYXRoLmZsb29yKG9wdGlvbnMuZGF0ZV9zdGFydC5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBnZW5lcmF0ZVVSTFBhcmFtcyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGVzPyR7dXJsUGFyYW1zfWAsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBnZXRQcm9maWxlKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gZ2VuZXJhdGVVUkxQYXJhbXMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdChgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlPyR7dXJsUGFyYW1zfWAsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBwb3N0UmVzdW1lRm9yUHJvZmlsZShkYXRhLCBmaWxlKSB7XG4gICAgICAgIGlmIChkYXRhLnRpbWVzdGFtcF9yZWNlcHRpb24gJiYgdHlwZW9mIGRhdGEudGltZXN0YW1wX3JlY2VwdGlvbiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgZGF0YS50aW1lc3RhbXBfcmVjZXB0aW9uID0gTWF0aC5mbG9vcihkYXRhLnRpbWVzdGFtcF9yZWNlcHRpb24uZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudHJhaW5pbmdfbWV0YWRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEudHJhaW5pbmdfbWV0YWRhdGEuZm9yRWFjaCgobWV0YWRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGFkYXRhLnJhdGluZ190aW1lc3RhbXAgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEucmF0aW5nX3RpbWVzdGFtcCA9IE1hdGguZmxvb3IobWV0YWRhdGEucmF0aW5nX3RpbWVzdGFtcC5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRhZGF0YS5zdGFnZV90aW1lc3RhbXAgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEuc3RhZ2VfdGltZXN0YW1wID0gTWF0aC5mbG9vcihtZXRhZGF0YS5zdGFnZV90aW1lc3RhbXAuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsID0gYCR7ZGVmYXVsdHMuQVBJX1VSTH0vcHJvZmlsZWA7XG4gICAgICAgIHJldHVybiBodHRwUG9zdFJlcXVlc3QodXJsLCBkYXRhLCBmaWxlLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgZ2V0UHJvZmlsZURvY3VtZW50cyhvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IGdlbmVyYXRlVVJMUGFyYW1zKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gaHR0cFJlcXVlc3QoYCR7ZGVmYXVsdHMuQVBJX1VSTH0vcHJvZmlsZS9kb2N1bWVudHM/JHt1cmxQYXJhbXN9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIGdldFByb2ZpbGVQYXJzaW5nKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gZ2VuZXJhdGVVUkxQYXJhbXMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdChgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlL3BhcnNpbmc/JHt1cmxQYXJhbXN9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIGdldFByb2ZpbGVTY29yaW5nKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gZ2VuZXJhdGVVUkxQYXJhbXMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdChgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlL3Njb3Jpbmc/JHt1cmxQYXJhbXN9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIHBhdGNoUHJvZmlsZVN0YWdlKGRhdGEpIHtcbiAgICAgICAgbGV0IHVybCA9IGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGUvc3RhZ2VgO1xuICAgICAgICByZXR1cm4gaHR0cFBhdGNoUmVxdWVzdCh1cmwsIGRhdGEsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBwYXRjaFByb2ZpbGVSYXRpbmcoZGF0YSkge1xuICAgICAgICBsZXQgdXJsID0gYCR7ZGVmYXVsdHMuQVBJX1VSTH0vcHJvZmlsZS9yYXRpbmdgO1xuICAgICAgICByZXR1cm4gaHR0cFBhdGNoUmVxdWVzdCh1cmwsIGRhdGEsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBnZW5lcmF0ZVVSTFBhcmFtcyA9IChvcHRpb25zKSA9PiB7XG4gICAgcmV0dXJuIG9wdGlvbnMgPyBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoa2V5ID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnNba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7a2V5fT1bJHtvcHRpb25zW2tleV0ubWFwKChlbGVtKSA9PiBgXCIke2VsZW19XCJgKS5qb2luKFwiLFwiKX1dYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCR7a2V5fT0ke29wdGlvbnNba2V5XX1gO1xuICAgIH0pLmpvaW4oXCImXCIpIDogbnVsbDtcbn07XG5leHBvcnQgY29uc3QgaXNOb2RlID0gKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBnbG9iYWwpICYmIChcIltvYmplY3QgZ2xvYmFsXVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZ2xvYmFsKSk7XG4iXX0=
