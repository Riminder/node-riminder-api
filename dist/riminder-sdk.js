(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.riminderSdk = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.httpRequest = undefined;

require("whatwg-fetch");

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httpRequest = exports.httpRequest = function httpRequest(url, options) {
    var headers = {
        "X-API-Key": _index.Riminder._instance.API_Key || _defaults2.default.API_Key
    };
    var opts = Object.assign({ headers: headers, credentials: "include" }, options);
    return fetch(url, opts).then(successHandler, errorHandler).then(function (json) {
        return json.data;
    });
};
var successHandler = function successHandler(response) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    console.error(response);
};
var errorHandler = function errorHandler(err) {
    var error = new Error(err.message);
    error.response = err;
    throw error;
};

},{"./defaults":2,"./index":4,"whatwg-fetch":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Riminder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = require("./objects");

var _objects2 = _interopRequireDefault(_objects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Riminder = exports.Riminder = function () {
    function Riminder(options) {
        _classCallCheck(this, Riminder);

        if (Riminder._instance) {
            var error = new Error("You can not instanciate more than one instance of Riminder SDK");
            throw error;
        }
        if (!options.API_Key) {
            var _error = new Error("No API Key was supplied for Riminder SDK");
            throw _error;
        }
        this.API_Key = options.API_Key;
        this._init();
        Riminder._instance = this;
    }

    _createClass(Riminder, [{
        key: "_init",
        value: function _init() {
            this.objects = _objects2.default;
            this.webhooks = {};
        }
    }]);

    return Riminder;
}();

},{"./objects":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("./utils");

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

var _http = require("./http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    getSources: function getSources(options) {
        return (0, _utils.getList)("sources", options);
    },
    getSource: function getSource(id) {
        return (0, _utils.getOne)("source", id);
    },
    getProfiles: function getProfiles(options) {
        return (0, _utils.getList)("profiles", options);
    },
    getProfile: function getProfile(id, sourceID) {
        var url = _defaults2.default.API_URL + "/profile/" + id + "?source_id=" + sourceID;
        return (0, _http.httpRequest)(url);
    },
    createResumeForProfile: function createResumeForProfile(profileID, sourceID, file) {},
    getProfileDocuments: function getProfileDocuments(id, sourceID) {
        var url = _defaults2.default.API_URL + "/profile/" + id + "/documents?source_id=" + sourceID;
        return (0, _http.httpRequest)(url);
    },
    getProfileExtractions: function getProfileExtractions(id, sourceID) {
        var url = _defaults2.default.API_URL + "/profile/" + id + "/extractions?source_id=" + sourceID;
        return (0, _http.httpRequest)(url);
    },
    getProfileJobs: function getProfileJobs(id, sourceID) {
        var url = _defaults2.default.API_URL + "/profile/" + id + "/jobs?source_id=" + sourceID;
        return (0, _http.httpRequest)(url);
    },
    updateProfileStage: function updateProfileStage(id, sourceID, jobID, stage) {
        var url = _defaults2.default.API_URL + "/profile/" + id + "/stage";
        var body = {
            source_id: sourceID,
            job_id: jobID,
            stage: stage
        };
        return (0, _http.httpRequest)(url, { body: body });
    },
    updateProfileRating: function updateProfileRating(id, sourceID, jobID, rating) {
        var url = _defaults2.default.API_URL + "/profile/" + id + "/rating";
        var body = {
            source_id: sourceID,
            job_id: jobID,
            rating: rating
        };
        return (0, _http.httpRequest)(url, { body: body });
    }
};

},{"./defaults":2,"./http":3,"./utils":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateURLParams = exports.getList = exports.getOne = exports.create = undefined;

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

var _http = require("./http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var create = exports.create = function create(object, data) {
    var url = _defaults2.default.API_URL + "/" + object;
    var body = JSON.stringify(data);
    var options = {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    };
    return (0, _http.httpRequest)(url, options);
};
var getOne = exports.getOne = function getOne(object, id) {
    var url = _defaults2.default.API_URL + "/" + object + "/" + id;
    return (0, _http.httpRequest)(url);
};
var getList = exports.getList = function getList(object, options) {
    var whereClause = options.where || {};
    var page = options.page;
    var itemsPerPage = options.itemsPerPage;
    var urlParams = generateURLParams(whereClause, page, itemsPerPage);
    var url = _defaults2.default.API_URL + "/" + object + (urlParams ? "?" + urlParams : "");
    return (0, _http.httpRequest)(url);
};
var generateURLParams = exports.generateURLParams = function generateURLParams(whereClause, page, itemsPerPage, sort) {
    var keys = Object.keys(whereClause);
    var URLParams = "";
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            URLParams = URLParams + "&" + key + "=" + whereClause[key];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    URLParams = "" + URLParams + (page ? "&page=" + page : "") + (itemsPerPage ? "&limit=" + itemsPerPage : "") + (sort ? "&sort_by=" + sort : "");
    return URLParams.slice(1);
};

},{"./defaults":2,"./http":3}]},{},[4])(4)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwidGVtcC9kZWZhdWx0cy5qcyIsInRlbXAvaHR0cC5qcyIsInRlbXAvaW5kZXguanMiLCJ0ZW1wL29iamVjdHMuanMiLCJ0ZW1wL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Iiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbihzZWxmKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoc2VsZi5mZXRjaCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgICBdXG5cbiAgICB2YXIgaXNEYXRhVmlldyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG4gICAgfVxuXG4gICAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3JcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge31cblxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfSwgdGhpcylcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gICAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlKycsJyt2YWx1ZSA6IHZhbHVlXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKG5hbWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgaXRlbXMucHVzaCh2YWx1ZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICAgIH1cbiAgICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgICAgfVxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICAgIH1cbiAgICByZXR1cm4gY2hhcnMuam9pbignJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICAgIGlmIChidWYuc2xpY2UpIHtcbiAgICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gICAgfVxuXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcbiAgfVxuXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHsgYm9keTogdGhpcy5fYm9keUluaXQgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZm9ybVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gICAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICAgIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICAgIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pXG4gIH1cblxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH1cblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gICAgfSlcbiAgfVxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuIiwibGV0IGRlZmF1bHRzID0ge1xuICAgIEFQSV9VUkw6IFwiaHR0cHM6Ly93d3cucmltaW5kZXIubmV0L3NmL3B1YmxpYy9hcGkvdjEuMFwiLFxuICAgIEFQSV9TRUNSRVQ6IG51bGwsXG4gICAgQVBJX0tleTogbnVsbFxufTtcbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzO1xuIiwiaW1wb3J0IFwid2hhdHdnLWZldGNoXCI7XG5pbXBvcnQgXCIuL2RlZmF1bHRzXCI7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSBcIi4vZGVmYXVsdHNcIjtcbmltcG9ydCB7IFJpbWluZGVyIH0gZnJvbSBcIi4vaW5kZXhcIjtcbmV4cG9ydCBjb25zdCBodHRwUmVxdWVzdCA9ICh1cmwsIG9wdGlvbnMpID0+IHtcbiAgICBsZXQgaGVhZGVycyA9IHtcbiAgICAgICAgXCJYLUFQSS1LZXlcIjogUmltaW5kZXIuX2luc3RhbmNlLkFQSV9LZXkgfHwgZGVmYXVsdHMuQVBJX0tleSxcbiAgICB9O1xuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7IGhlYWRlcnMsIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIiB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRzKVxuICAgICAgICAudGhlbihzdWNjZXNzSGFuZGxlciwgZXJyb3JIYW5kbGVyKVxuICAgICAgICAudGhlbigoanNvbikgPT4ganNvbi5kYXRhKTtcbn07XG5jb25zdCBzdWNjZXNzSGFuZGxlciA9IChyZXNwb25zZSkgPT4ge1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCB8fCByZXNwb25zZS5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKHJlc3BvbnNlKTtcbn07XG5jb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XG4gICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICBlcnJvci5yZXNwb25zZSA9IGVycjtcbiAgICB0aHJvdyBlcnJvcjtcbn07XG4iLCJpbXBvcnQgb2JqZWN0cyBmcm9tIFwiLi9vYmplY3RzXCI7XG5leHBvcnQgY2xhc3MgUmltaW5kZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKFJpbWluZGVyLl9pbnN0YW5jZSkge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKFwiWW91IGNhbiBub3QgaW5zdGFuY2lhdGUgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZSBvZiBSaW1pbmRlciBTREtcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9wdGlvbnMuQVBJX0tleSkge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKFwiTm8gQVBJIEtleSB3YXMgc3VwcGxpZWQgZm9yIFJpbWluZGVyIFNES1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuQVBJX0tleSA9IG9wdGlvbnMuQVBJX0tleTtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICBSaW1pbmRlci5faW5zdGFuY2UgPSB0aGlzO1xuICAgIH1cbiAgICBfaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vYmplY3RzID0gb2JqZWN0cztcbiAgICAgICAgdGhpcy53ZWJob29rcyA9IHt9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGdldE9uZSwgZ2V0TGlzdCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSBcIi4vZGVmYXVsdHNcIjtcbmltcG9ydCB7IGh0dHBSZXF1ZXN0IH0gZnJvbSBcIi4vaHR0cFwiO1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIGdldFNvdXJjZXM6IChvcHRpb25zKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRMaXN0KFwic291cmNlc1wiLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGdldFNvdXJjZTogKGlkKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPbmUoXCJzb3VyY2VcIiwgaWQpO1xuICAgIH0sXG4gICAgZ2V0UHJvZmlsZXM6IChvcHRpb25zKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRMaXN0KFwicHJvZmlsZXNcIiwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBnZXRQcm9maWxlOiAoaWQsIHNvdXJjZUlEKSA9PiB7XG4gICAgICAgIGxldCB1cmwgPSBgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlLyR7aWR9P3NvdXJjZV9pZD0ke3NvdXJjZUlEfWA7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdCh1cmwpO1xuICAgIH0sXG4gICAgY3JlYXRlUmVzdW1lRm9yUHJvZmlsZTogKHByb2ZpbGVJRCwgc291cmNlSUQsIGZpbGUpID0+IHtcbiAgICB9LFxuICAgIGdldFByb2ZpbGVEb2N1bWVudHM6IChpZCwgc291cmNlSUQpID0+IHtcbiAgICAgICAgbGV0IHVybCA9IGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGUvJHtpZH0vZG9jdW1lbnRzP3NvdXJjZV9pZD0ke3NvdXJjZUlEfWA7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdCh1cmwpO1xuICAgIH0sXG4gICAgZ2V0UHJvZmlsZUV4dHJhY3Rpb25zOiAoaWQsIHNvdXJjZUlEKSA9PiB7XG4gICAgICAgIGxldCB1cmwgPSBgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlLyR7aWR9L2V4dHJhY3Rpb25zP3NvdXJjZV9pZD0ke3NvdXJjZUlEfWA7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdCh1cmwpO1xuICAgIH0sXG4gICAgZ2V0UHJvZmlsZUpvYnM6IChpZCwgc291cmNlSUQpID0+IHtcbiAgICAgICAgbGV0IHVybCA9IGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGUvJHtpZH0vam9icz9zb3VyY2VfaWQ9JHtzb3VyY2VJRH1gO1xuICAgICAgICByZXR1cm4gaHR0cFJlcXVlc3QodXJsKTtcbiAgICB9LFxuICAgIHVwZGF0ZVByb2ZpbGVTdGFnZTogKGlkLCBzb3VyY2VJRCwgam9iSUQsIHN0YWdlKSA9PiB7XG4gICAgICAgIGxldCB1cmwgPSBgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlLyR7aWR9L3N0YWdlYDtcbiAgICAgICAgbGV0IGJvZHkgPSB7XG4gICAgICAgICAgICBzb3VyY2VfaWQ6IHNvdXJjZUlELFxuICAgICAgICAgICAgam9iX2lkOiBqb2JJRCxcbiAgICAgICAgICAgIHN0YWdlOiBzdGFnZSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KHVybCwgeyBib2R5IH0pO1xuICAgIH0sXG4gICAgdXBkYXRlUHJvZmlsZVJhdGluZzogKGlkLCBzb3VyY2VJRCwgam9iSUQsIHJhdGluZykgPT4ge1xuICAgICAgICBsZXQgdXJsID0gYCR7ZGVmYXVsdHMuQVBJX1VSTH0vcHJvZmlsZS8ke2lkfS9yYXRpbmdgO1xuICAgICAgICBsZXQgYm9keSA9IHtcbiAgICAgICAgICAgIHNvdXJjZV9pZDogc291cmNlSUQsXG4gICAgICAgICAgICBqb2JfaWQ6IGpvYklELFxuICAgICAgICAgICAgcmF0aW5nOiByYXRpbmcsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdCh1cmwsIHsgYm9keSB9KTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IFwiLi9kZWZhdWx0c1wiO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QgfSBmcm9tIFwiLi9odHRwXCI7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSBcIi4vZGVmYXVsdHNcIjtcbmV4cG9ydCBjb25zdCBjcmVhdGUgPSAob2JqZWN0LCBkYXRhKSA9PiB7XG4gICAgbGV0IHVybCA9IGAke2RlZmF1bHRzLkFQSV9VUkx9LyR7b2JqZWN0fWA7XG4gICAgbGV0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGh0dHBSZXF1ZXN0KHVybCwgb3B0aW9ucyk7XG59O1xuZXhwb3J0IGNvbnN0IGdldE9uZSA9IChvYmplY3QsIGlkKSA9PiB7XG4gICAgbGV0IHVybCA9IGAke2RlZmF1bHRzLkFQSV9VUkx9LyR7b2JqZWN0fS8ke2lkfWA7XG4gICAgcmV0dXJuIGh0dHBSZXF1ZXN0KHVybCk7XG59O1xuZXhwb3J0IGNvbnN0IGdldExpc3QgPSAob2JqZWN0LCBvcHRpb25zKSA9PiB7XG4gICAgbGV0IHdoZXJlQ2xhdXNlID0gb3B0aW9ucy53aGVyZSB8fCB7fTtcbiAgICBsZXQgcGFnZSA9IG9wdGlvbnMucGFnZTtcbiAgICBsZXQgaXRlbXNQZXJQYWdlID0gb3B0aW9ucy5pdGVtc1BlclBhZ2U7XG4gICAgbGV0IHVybFBhcmFtcyA9IGdlbmVyYXRlVVJMUGFyYW1zKHdoZXJlQ2xhdXNlLCBwYWdlLCBpdGVtc1BlclBhZ2UpO1xuICAgIGxldCB1cmwgPSBgJHtkZWZhdWx0cy5BUElfVVJMfS8ke29iamVjdH0ke3VybFBhcmFtcyA/IGA/JHt1cmxQYXJhbXN9YCA6IFwiXCJ9YDtcbiAgICByZXR1cm4gaHR0cFJlcXVlc3QodXJsKTtcbn07XG5leHBvcnQgY29uc3QgZ2VuZXJhdGVVUkxQYXJhbXMgPSAod2hlcmVDbGF1c2UsIHBhZ2UsIGl0ZW1zUGVyUGFnZSwgc29ydCkgPT4ge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMod2hlcmVDbGF1c2UpO1xuICAgIGxldCBVUkxQYXJhbXMgPSBcIlwiO1xuICAgIGZvciAobGV0IGtleSBvZiBrZXlzKSB7XG4gICAgICAgIFVSTFBhcmFtcyA9IGAke1VSTFBhcmFtc30mJHtrZXl9PSR7d2hlcmVDbGF1c2Vba2V5XX1gO1xuICAgIH1cbiAgICBVUkxQYXJhbXMgPSBgJHtVUkxQYXJhbXN9JHtwYWdlID8gYCZwYWdlPSR7cGFnZX1gIDogXCJcIn0ke2l0ZW1zUGVyUGFnZSA/IGAmbGltaXQ9JHtpdGVtc1BlclBhZ2V9YCA6IFwiXCJ9JHtzb3J0ID8gYCZzb3J0X2J5PSR7c29ydH1gIDogXCJcIn1gO1xuICAgIHJldHVybiBVUkxQYXJhbXMuc2xpY2UoMSk7XG59O1xuIl19
