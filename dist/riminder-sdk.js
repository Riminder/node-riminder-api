(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.riminderSdk = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (root, factory) {
    // Hack to make all exports of this module sha256 function object properties.
    var exports = {};
    factory(exports);
    var sha256 = exports["default"];
    for (var k in exports) {
        sha256[k] = exports[k];
    }
        
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = sha256;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return sha256; }); 
    } else {
        root.sha256 = sha256;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;
// SHA-256 (+ HMAC and PBKDF2) for JavaScript.
//
// Written in 2014-2016 by Dmitry Chestnykh.
// Public domain, no warranty.
//
// Functions (accept and return Uint8Arrays):
//
//   sha256(message) -> hash
//   sha256.hmac(key, message) -> mac
//   sha256.pbkdf2(password, salt, rounds, dkLen) -> dk
//
//  Classes:
//
//   new sha256.Hash()
//   new sha256.HMAC(key)
//
exports.digestLength = 32;
exports.blockSize = 64;
// SHA-256 constants
var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
function hashBlocks(w, v, p, pos, len) {
    var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
    while (len >= 64) {
        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];
        e = v[4];
        f = v[5];
        g = v[6];
        h = v[7];
        for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (((p[j] & 0xff) << 24) | ((p[j + 1] & 0xff) << 16) |
                ((p[j + 2] & 0xff) << 8) | (p[j + 3] & 0xff));
        }
        for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);
            u = w[i - 15];
            t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
        }
        for (i = 0; i < 64; i++) {
            t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
                (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
                ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;
            t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
                (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }
        v[0] += a;
        v[1] += b;
        v[2] += c;
        v[3] += d;
        v[4] += e;
        v[5] += f;
        v[6] += g;
        v[7] += h;
        pos += 64;
        len -= 64;
    }
    return pos;
}
// Hash implements SHA256 hash algorithm.
var Hash = /** @class */ (function () {
    function Hash() {
        this.digestLength = exports.digestLength;
        this.blockSize = exports.blockSize;
        // Note: Int32Array is used instead of Uint32Array for performance reasons.
        this.state = new Int32Array(8); // hash state
        this.temp = new Int32Array(64); // temporary state
        this.buffer = new Uint8Array(128); // buffer for data to hash
        this.bufferLength = 0; // number of bytes in buffer
        this.bytesHashed = 0; // number of total bytes hashed
        this.finished = false; // indicates whether the hash was finalized
        this.reset();
    }
    // Resets hash state making it possible
    // to re-use this instance to hash other data.
    Hash.prototype.reset = function () {
        this.state[0] = 0x6a09e667;
        this.state[1] = 0xbb67ae85;
        this.state[2] = 0x3c6ef372;
        this.state[3] = 0xa54ff53a;
        this.state[4] = 0x510e527f;
        this.state[5] = 0x9b05688c;
        this.state[6] = 0x1f83d9ab;
        this.state[7] = 0x5be0cd19;
        this.bufferLength = 0;
        this.bytesHashed = 0;
        this.finished = false;
        return this;
    };
    // Cleans internal buffers and re-initializes hash state.
    Hash.prototype.clean = function () {
        for (var i = 0; i < this.buffer.length; i++) {
            this.buffer[i] = 0;
        }
        for (var i = 0; i < this.temp.length; i++) {
            this.temp[i] = 0;
        }
        this.reset();
    };
    // Updates hash state with the given data.
    //
    // Optionally, length of the data can be specified to hash
    // fewer bytes than data.length.
    //
    // Throws error when trying to update already finalized hash:
    // instance must be reset to use it again.
    Hash.prototype.update = function (data, dataLength) {
        if (dataLength === void 0) { dataLength = data.length; }
        if (this.finished) {
            throw new Error("SHA256: can't update because hash was finished.");
        }
        var dataPos = 0;
        this.bytesHashed += dataLength;
        if (this.bufferLength > 0) {
            while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
            }
        }
        if (dataLength >= 64) {
            dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
            dataLength %= 64;
        }
        while (dataLength > 0) {
            this.buffer[this.bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    };
    // Finalizes hash state and puts hash into out.
    //
    // If hash was already finalized, puts the same value.
    Hash.prototype.finish = function (out) {
        if (!this.finished) {
            var bytesHashed = this.bytesHashed;
            var left = this.bufferLength;
            var bitLenHi = (bytesHashed / 0x20000000) | 0;
            var bitLenLo = bytesHashed << 3;
            var padLength = (bytesHashed % 64 < 56) ? 64 : 128;
            this.buffer[left] = 0x80;
            for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
            }
            this.buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
            this.buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
            this.buffer[padLength - 6] = (bitLenHi >>> 8) & 0xff;
            this.buffer[padLength - 5] = (bitLenHi >>> 0) & 0xff;
            this.buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
            this.buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
            this.buffer[padLength - 2] = (bitLenLo >>> 8) & 0xff;
            this.buffer[padLength - 1] = (bitLenLo >>> 0) & 0xff;
            hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
            this.finished = true;
        }
        for (var i = 0; i < 8; i++) {
            out[i * 4 + 0] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return this;
    };
    // Returns the final hash digest.
    Hash.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    // Internal function for use in HMAC for optimization.
    Hash.prototype._saveState = function (out) {
        for (var i = 0; i < this.state.length; i++) {
            out[i] = this.state[i];
        }
    };
    // Internal function for use in HMAC for optimization.
    Hash.prototype._restoreState = function (from, bytesHashed) {
        for (var i = 0; i < this.state.length; i++) {
            this.state[i] = from[i];
        }
        this.bytesHashed = bytesHashed;
        this.finished = false;
        this.bufferLength = 0;
    };
    return Hash;
}());
exports.Hash = Hash;
// HMAC implements HMAC-SHA256 message authentication algorithm.
var HMAC = /** @class */ (function () {
    function HMAC(key) {
        this.inner = new Hash();
        this.outer = new Hash();
        this.blockSize = this.inner.blockSize;
        this.digestLength = this.inner.digestLength;
        var pad = new Uint8Array(this.blockSize);
        if (key.length > this.blockSize) {
            (new Hash()).update(key).finish(pad).clean();
        }
        else {
            for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
            }
        }
        for (var i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36;
        }
        this.inner.update(pad);
        for (var i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36 ^ 0x5c;
        }
        this.outer.update(pad);
        this.istate = new Uint32Array(8);
        this.ostate = new Uint32Array(8);
        this.inner._saveState(this.istate);
        this.outer._saveState(this.ostate);
        for (var i = 0; i < pad.length; i++) {
            pad[i] = 0;
        }
    }
    // Returns HMAC state to the state initialized with key
    // to make it possible to run HMAC over the other data with the same
    // key without creating a new instance.
    HMAC.prototype.reset = function () {
        this.inner._restoreState(this.istate, this.inner.blockSize);
        this.outer._restoreState(this.ostate, this.outer.blockSize);
        return this;
    };
    // Cleans HMAC state.
    HMAC.prototype.clean = function () {
        for (var i = 0; i < this.istate.length; i++) {
            this.ostate[i] = this.istate[i] = 0;
        }
        this.inner.clean();
        this.outer.clean();
    };
    // Updates state with provided data.
    HMAC.prototype.update = function (data) {
        this.inner.update(data);
        return this;
    };
    // Finalizes HMAC and puts the result in out.
    HMAC.prototype.finish = function (out) {
        if (this.outer.finished) {
            this.outer.finish(out);
        }
        else {
            this.inner.finish(out);
            this.outer.update(out, this.digestLength).finish(out);
        }
        return this;
    };
    // Returns message authentication code.
    HMAC.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    return HMAC;
}());
exports.HMAC = HMAC;
// Returns SHA256 hash of data.
function hash(data) {
    var h = (new Hash()).update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hash = hash;
// Function hash is both available as module.hash and as default export.
exports["default"] = hash;
// Returns HMAC-SHA256 of data under the key.
function hmac(key, data) {
    var h = (new HMAC(key)).update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hmac = hmac;
// Derives a key from password and salt using PBKDF2-HMAC-SHA256
// with the given number of iterations.
//
// The number of bytes returned is equal to dkLen.
//
// (For better security, avoid dkLen greater than hash length - 32 bytes).
function pbkdf2(password, salt, iterations, dkLen) {
    var prf = new HMAC(password);
    var len = prf.digestLength;
    var ctr = new Uint8Array(4);
    var t = new Uint8Array(len);
    var u = new Uint8Array(len);
    var dk = new Uint8Array(dkLen);
    for (var i = 0; i * len < dkLen; i++) {
        var c = i + 1;
        ctr[0] = (c >>> 24) & 0xff;
        ctr[1] = (c >>> 16) & 0xff;
        ctr[2] = (c >>> 8) & 0xff;
        ctr[3] = (c >>> 0) & 0xff;
        prf.reset();
        prf.update(salt);
        prf.update(ctr);
        prf.finish(u);
        for (var j = 0; j < len; j++) {
            t[j] = u[j];
        }
        for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
                t[k] ^= u[k];
            }
        }
        for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
        }
    }
    for (var i = 0; i < len; i++) {
        t[i] = u[i] = 0;
    }
    for (var i = 0; i < 4; i++) {
        ctr[i] = 0;
    }
    prf.clean();
    return dk;
}
exports.pbkdf2 = pbkdf2;
});

},{}],3:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
var globalObj = typeof self !== 'undefined' && self || this;
module.exports = globalObj.fetch.bind(globalObj);

},{"whatwg-fetch":6}],4:[function(require,module,exports){
/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;

},{}],5:[function(require,module,exports){
(function (Buffer){
// Written in 2014-2016 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
(function(root, f) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) module.exports = f();
  else if (root.nacl) root.nacl.util = f();
  else {
    root.nacl = {};
    root.nacl.util = f();
  }
}(this, function() {
  'use strict';

  var util = {};

  function validateBase64(s) {
    if (!(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s))) {
      throw new TypeError('invalid encoding');
    }
  }

  util.decodeUTF8 = function(s) {
    if (typeof s !== 'string') throw new TypeError('expected string');
    var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
  };

  util.encodeUTF8 = function(arr) {
    var i, s = [];
    for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
    return decodeURIComponent(escape(s.join('')));
  };

  if (typeof atob === 'undefined') {
    // Node.js

    if (typeof Buffer.from !== 'undefined') {
       // Node v6 and later
      util.encodeBase64 = function (arr) { // v6 and later
          return Buffer.from(arr).toString('base64');
      };

      util.decodeBase64 = function (s) {
        validateBase64(s);
        return new Uint8Array(Array.prototype.slice.call(Buffer.from(s, 'base64'), 0));
      };

    } else {
      // Node earlier than v6
      util.encodeBase64 = function (arr) { // v6 and later
        return (new Buffer(arr)).toString('base64');
      };

      util.decodeBase64 = function(s) {
        validateBase64(s);
        return new Uint8Array(Array.prototype.slice.call(new Buffer(s, 'base64'), 0));
      };
    }

  } else {
    // Browsers

    util.encodeBase64 = function(arr) {
      var i, s = [], len = arr.length;
      for (i = 0; i < len; i++) s.push(String.fromCharCode(arr[i]));
      return btoa(s.join(''));
    };

    util.decodeBase64 = function(s) {
      validateBase64(s);
      var i, d = atob(s), b = new Uint8Array(d.length);
      for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
      return b;
    };

  }

  return util;

}));

}).call(this,require("buffer").Buffer)

},{"buffer":1}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ["profile.parse.success", "profile.parse.error", "profile.score.success", "profile.score.error", "filter.train.success", "filter.train.error", "filter.score.success", "filter.score.error"];

},{}],10:[function(require,module,exports){
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

},{"./errors":8,"fetch-everywhere":3,"form-data":4}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Riminder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = require("./objects");

var _webhooks = require("./webhooks");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Riminder = exports.Riminder = function () {
    function Riminder(options) {
        _classCallCheck(this, Riminder);

        if (!options.API_Key) {
            var error = new Error("No API Key was supplied for Riminder SDK");
            throw error;
        }
        this.API_Key = options.API_Key;
        if (options.Webhooks_Key) {
            this.Webhooks_Key = options.Webhooks_Key;
        }
        this._init();
    }

    _createClass(Riminder, [{
        key: "_init",
        value: function _init() {
            this.objects = new _objects.Objects(this);
            if (this.Webhooks_Key) {
                this.webhooks = new _webhooks.Webhooks(this.Webhooks_Key);
            }
        }
    }]);

    return Riminder;
}();

},{"./objects":12,"./webhooks":14}],12:[function(require,module,exports){
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
        key: "postProfile",
        value: function postProfile(data, file) {
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

},{"./defaults":7,"./http":10,"./utils":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Webhooks = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("./events");

var _events2 = _interopRequireDefault(_events);

var _tweetnaclUtil = require("tweetnacl-util");

var util = _interopRequireWildcard(_tweetnaclUtil);

var _fastSha = require("fast-sha256");

var sha256 = _interopRequireWildcard(_fastSha);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Webhooks = exports.Webhooks = function () {
    function Webhooks(secretKey) {
        _classCallCheck(this, Webhooks);

        if (!secretKey) {
            throw new Error("The webhook secret key must be specified");
        }
        this.webhookSecretKey = secretKey;
        this.binding = new Map();
    }

    _createClass(Webhooks, [{
        key: "handleWebhook",
        value: function handleWebhook(headers) {
            var _this = this;

            return function () {
                if (!headers["HTTP_RIMINDER_SIGNATURE"]) {
                    throw new Error("The signature is missing from the headers");
                }

                var _headers$HTTP_RIMINDE = headers["HTTP_RIMINDER_SIGNATURE"].split("."),
                    _headers$HTTP_RIMINDE2 = _slicedToArray(_headers$HTTP_RIMINDE, 2),
                    encodedSignature = _headers$HTTP_RIMINDE2[0],
                    encodedPayload = _headers$HTTP_RIMINDE2[1];

                var expectedSignature = util.encodeBase64(sha256.hmac(util.decodeUTF8(_this.webhookSecretKey), util.decodeUTF8(encodedPayload)));
                if (encodedSignature !== expectedSignature) {
                    throw new Error("The signature is invalid");
                }
                var payload = JSON.parse(util.encodeUTF8(util.decodeBase64(encodedPayload)));
                if (_events2.default.indexOf(payload.type) < 0) {
                    throw new Error("Unknown event: " + payload.type);
                }
                _this._callBinding(payload);
            };
        }
    }, {
        key: "on",
        value: function on(event, callback) {
            if (_events2.default.indexOf(event) < 0) {
                throw new Error("This event doesn't exist");
            }
            if (this.binding.has(event)) {
                throw new Error("This callback already has been declared");
            }
            this.binding.set(event, callback);
            return this;
        }
    }, {
        key: "_callBinding",
        value: function _callBinding(payload) {
            if (this.binding.has(payload.type)) {
                this.binding.get(payload.type)(payload);
            }
        }
    }]);

    return Webhooks;
}();

},{"./events":9,"fast-sha256":2,"tweetnacl-util":5}]},{},[11])(11)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Zhc3Qtc2hhMjU2L3NoYTI1Ni5qcyIsIm5vZGVfbW9kdWxlcy9mZXRjaC1ldmVyeXdoZXJlL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwibm9kZV9tb2R1bGVzL2Zvcm0tZGF0YS9saWIvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90d2VldG5hY2wtdXRpbC9uYWNsLXV0aWwuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwidGVtcC9kZWZhdWx0cy5qcyIsInRlbXAvZXJyb3JzLmpzIiwidGVtcC9ldmVudHMuanMiLCJ0ZW1wL2h0dHAuanMiLCJ0ZW1wL2luZGV4LmpzIiwidGVtcC9vYmplY3RzLmpzIiwidGVtcC91dGlscy5qcyIsInRlbXAvd2ViaG9va3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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TSxJQUFJLEtBQUosQ0FBVSx5Q0FBVixDQUFOO0FBQ0g7QUFDRCxpQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixLQUFqQixFQUF3QixRQUF4QjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7O3FDQUNZLE8sRUFBUztBQUNsQixnQkFBSSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFFBQVEsSUFBekIsQ0FBSixFQUFvQztBQUNoQyxxQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixRQUFRLElBQXpCLEVBQStCLE9BQS9CO0FBQ0g7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIC8vIEhhY2sgdG8gbWFrZSBhbGwgZXhwb3J0cyBvZiB0aGlzIG1vZHVsZSBzaGEyNTYgZnVuY3Rpb24gb2JqZWN0IHByb3BlcnRpZXMuXG4gICAgdmFyIGV4cG9ydHMgPSB7fTtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICAgIHZhciBzaGEyNTYgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbiAgICBmb3IgKHZhciBrIGluIGV4cG9ydHMpIHtcbiAgICAgICAgc2hhMjU2W2tdID0gZXhwb3J0c1trXTtcbiAgICB9XG4gICAgICAgIFxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gc2hhMjU2O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIHNoYTI1NjsgfSk7IFxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3Quc2hhMjU2ID0gc2hhMjU2O1xuICAgIH1cbn0pKHRoaXMsIGZ1bmN0aW9uKGV4cG9ydHMpIHtcblwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbi8vIFNIQS0yNTYgKCsgSE1BQyBhbmQgUEJLREYyKSBmb3IgSmF2YVNjcmlwdC5cbi8vXG4vLyBXcml0dGVuIGluIDIwMTQtMjAxNiBieSBEbWl0cnkgQ2hlc3RueWtoLlxuLy8gUHVibGljIGRvbWFpbiwgbm8gd2FycmFudHkuXG4vL1xuLy8gRnVuY3Rpb25zIChhY2NlcHQgYW5kIHJldHVybiBVaW50OEFycmF5cyk6XG4vL1xuLy8gICBzaGEyNTYobWVzc2FnZSkgLT4gaGFzaFxuLy8gICBzaGEyNTYuaG1hYyhrZXksIG1lc3NhZ2UpIC0+IG1hY1xuLy8gICBzaGEyNTYucGJrZGYyKHBhc3N3b3JkLCBzYWx0LCByb3VuZHMsIGRrTGVuKSAtPiBka1xuLy9cbi8vICBDbGFzc2VzOlxuLy9cbi8vICAgbmV3IHNoYTI1Ni5IYXNoKClcbi8vICAgbmV3IHNoYTI1Ni5ITUFDKGtleSlcbi8vXG5leHBvcnRzLmRpZ2VzdExlbmd0aCA9IDMyO1xuZXhwb3J0cy5ibG9ja1NpemUgPSA2NDtcbi8vIFNIQS0yNTYgY29uc3RhbnRzXG52YXIgSyA9IG5ldyBVaW50MzJBcnJheShbXG4gICAgMHg0MjhhMmY5OCwgMHg3MTM3NDQ5MSwgMHhiNWMwZmJjZiwgMHhlOWI1ZGJhNSwgMHgzOTU2YzI1YixcbiAgICAweDU5ZjExMWYxLCAweDkyM2Y4MmE0LCAweGFiMWM1ZWQ1LCAweGQ4MDdhYTk4LCAweDEyODM1YjAxLFxuICAgIDB4MjQzMTg1YmUsIDB4NTUwYzdkYzMsIDB4NzJiZTVkNzQsIDB4ODBkZWIxZmUsIDB4OWJkYzA2YTcsXG4gICAgMHhjMTliZjE3NCwgMHhlNDliNjljMSwgMHhlZmJlNDc4NiwgMHgwZmMxOWRjNiwgMHgyNDBjYTFjYyxcbiAgICAweDJkZTkyYzZmLCAweDRhNzQ4NGFhLCAweDVjYjBhOWRjLCAweDc2Zjk4OGRhLCAweDk4M2U1MTUyLFxuICAgIDB4YTgzMWM2NmQsIDB4YjAwMzI3YzgsIDB4YmY1OTdmYzcsIDB4YzZlMDBiZjMsIDB4ZDVhNzkxNDcsXG4gICAgMHgwNmNhNjM1MSwgMHgxNDI5Mjk2NywgMHgyN2I3MGE4NSwgMHgyZTFiMjEzOCwgMHg0ZDJjNmRmYyxcbiAgICAweDUzMzgwZDEzLCAweDY1MGE3MzU0LCAweDc2NmEwYWJiLCAweDgxYzJjOTJlLCAweDkyNzIyYzg1LFxuICAgIDB4YTJiZmU4YTEsIDB4YTgxYTY2NGIsIDB4YzI0YjhiNzAsIDB4Yzc2YzUxYTMsIDB4ZDE5MmU4MTksXG4gICAgMHhkNjk5MDYyNCwgMHhmNDBlMzU4NSwgMHgxMDZhYTA3MCwgMHgxOWE0YzExNiwgMHgxZTM3NmMwOCxcbiAgICAweDI3NDg3NzRjLCAweDM0YjBiY2I1LCAweDM5MWMwY2IzLCAweDRlZDhhYTRhLCAweDViOWNjYTRmLFxuICAgIDB4NjgyZTZmZjMsIDB4NzQ4ZjgyZWUsIDB4NzhhNTYzNmYsIDB4ODRjODc4MTQsIDB4OGNjNzAyMDgsXG4gICAgMHg5MGJlZmZmYSwgMHhhNDUwNmNlYiwgMHhiZWY5YTNmNywgMHhjNjcxNzhmMlxuXSk7XG5mdW5jdGlvbiBoYXNoQmxvY2tzKHcsIHYsIHAsIHBvcywgbGVuKSB7XG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGgsIHUsIGksIGosIHQxLCB0MjtcbiAgICB3aGlsZSAobGVuID49IDY0KSB7XG4gICAgICAgIGEgPSB2WzBdO1xuICAgICAgICBiID0gdlsxXTtcbiAgICAgICAgYyA9IHZbMl07XG4gICAgICAgIGQgPSB2WzNdO1xuICAgICAgICBlID0gdls0XTtcbiAgICAgICAgZiA9IHZbNV07XG4gICAgICAgIGcgPSB2WzZdO1xuICAgICAgICBoID0gdls3XTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIGogPSBwb3MgKyBpICogNDtcbiAgICAgICAgICAgIHdbaV0gPSAoKChwW2pdICYgMHhmZikgPDwgMjQpIHwgKChwW2ogKyAxXSAmIDB4ZmYpIDw8IDE2KSB8XG4gICAgICAgICAgICAgICAgKChwW2ogKyAyXSAmIDB4ZmYpIDw8IDgpIHwgKHBbaiArIDNdICYgMHhmZikpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDE2OyBpIDwgNjQ7IGkrKykge1xuICAgICAgICAgICAgdSA9IHdbaSAtIDJdO1xuICAgICAgICAgICAgdDEgPSAodSA+Pj4gMTcgfCB1IDw8ICgzMiAtIDE3KSkgXiAodSA+Pj4gMTkgfCB1IDw8ICgzMiAtIDE5KSkgXiAodSA+Pj4gMTApO1xuICAgICAgICAgICAgdSA9IHdbaSAtIDE1XTtcbiAgICAgICAgICAgIHQyID0gKHUgPj4+IDcgfCB1IDw8ICgzMiAtIDcpKSBeICh1ID4+PiAxOCB8IHUgPDwgKDMyIC0gMTgpKSBeICh1ID4+PiAzKTtcbiAgICAgICAgICAgIHdbaV0gPSAodDEgKyB3W2kgLSA3XSB8IDApICsgKHQyICsgd1tpIC0gMTZdIHwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICAgICAgICAgIHQxID0gKCgoKChlID4+PiA2IHwgZSA8PCAoMzIgLSA2KSkgXiAoZSA+Pj4gMTEgfCBlIDw8ICgzMiAtIDExKSkgXlxuICAgICAgICAgICAgICAgIChlID4+PiAyNSB8IGUgPDwgKDMyIC0gMjUpKSkgKyAoKGUgJiBmKSBeICh+ZSAmIGcpKSkgfCAwKSArXG4gICAgICAgICAgICAgICAgKChoICsgKChLW2ldICsgd1tpXSkgfCAwKSkgfCAwKSkgfCAwO1xuICAgICAgICAgICAgdDIgPSAoKChhID4+PiAyIHwgYSA8PCAoMzIgLSAyKSkgXiAoYSA+Pj4gMTMgfCBhIDw8ICgzMiAtIDEzKSkgXlxuICAgICAgICAgICAgICAgIChhID4+PiAyMiB8IGEgPDwgKDMyIC0gMjIpKSkgKyAoKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpKSkgfCAwO1xuICAgICAgICAgICAgaCA9IGc7XG4gICAgICAgICAgICBnID0gZjtcbiAgICAgICAgICAgIGYgPSBlO1xuICAgICAgICAgICAgZSA9IChkICsgdDEpIHwgMDtcbiAgICAgICAgICAgIGQgPSBjO1xuICAgICAgICAgICAgYyA9IGI7XG4gICAgICAgICAgICBiID0gYTtcbiAgICAgICAgICAgIGEgPSAodDEgKyB0MikgfCAwO1xuICAgICAgICB9XG4gICAgICAgIHZbMF0gKz0gYTtcbiAgICAgICAgdlsxXSArPSBiO1xuICAgICAgICB2WzJdICs9IGM7XG4gICAgICAgIHZbM10gKz0gZDtcbiAgICAgICAgdls0XSArPSBlO1xuICAgICAgICB2WzVdICs9IGY7XG4gICAgICAgIHZbNl0gKz0gZztcbiAgICAgICAgdls3XSArPSBoO1xuICAgICAgICBwb3MgKz0gNjQ7XG4gICAgICAgIGxlbiAtPSA2NDtcbiAgICB9XG4gICAgcmV0dXJuIHBvcztcbn1cbi8vIEhhc2ggaW1wbGVtZW50cyBTSEEyNTYgaGFzaCBhbGdvcml0aG0uXG52YXIgSGFzaCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIYXNoKCkge1xuICAgICAgICB0aGlzLmRpZ2VzdExlbmd0aCA9IGV4cG9ydHMuZGlnZXN0TGVuZ3RoO1xuICAgICAgICB0aGlzLmJsb2NrU2l6ZSA9IGV4cG9ydHMuYmxvY2tTaXplO1xuICAgICAgICAvLyBOb3RlOiBJbnQzMkFycmF5IGlzIHVzZWQgaW5zdGVhZCBvZiBVaW50MzJBcnJheSBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBJbnQzMkFycmF5KDgpOyAvLyBoYXNoIHN0YXRlXG4gICAgICAgIHRoaXMudGVtcCA9IG5ldyBJbnQzMkFycmF5KDY0KTsgLy8gdGVtcG9yYXJ5IHN0YXRlXG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMTI4KTsgLy8gYnVmZmVyIGZvciBkYXRhIHRvIGhhc2hcbiAgICAgICAgdGhpcy5idWZmZXJMZW5ndGggPSAwOyAvLyBudW1iZXIgb2YgYnl0ZXMgaW4gYnVmZmVyXG4gICAgICAgIHRoaXMuYnl0ZXNIYXNoZWQgPSAwOyAvLyBudW1iZXIgb2YgdG90YWwgYnl0ZXMgaGFzaGVkXG4gICAgICAgIHRoaXMuZmluaXNoZWQgPSBmYWxzZTsgLy8gaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGhhc2ggd2FzIGZpbmFsaXplZFxuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICAgIC8vIFJlc2V0cyBoYXNoIHN0YXRlIG1ha2luZyBpdCBwb3NzaWJsZVxuICAgIC8vIHRvIHJlLXVzZSB0aGlzIGluc3RhbmNlIHRvIGhhc2ggb3RoZXIgZGF0YS5cbiAgICBIYXNoLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVswXSA9IDB4NmEwOWU2Njc7XG4gICAgICAgIHRoaXMuc3RhdGVbMV0gPSAweGJiNjdhZTg1O1xuICAgICAgICB0aGlzLnN0YXRlWzJdID0gMHgzYzZlZjM3MjtcbiAgICAgICAgdGhpcy5zdGF0ZVszXSA9IDB4YTU0ZmY1M2E7XG4gICAgICAgIHRoaXMuc3RhdGVbNF0gPSAweDUxMGU1MjdmO1xuICAgICAgICB0aGlzLnN0YXRlWzVdID0gMHg5YjA1Njg4YztcbiAgICAgICAgdGhpcy5zdGF0ZVs2XSA9IDB4MWY4M2Q5YWI7XG4gICAgICAgIHRoaXMuc3RhdGVbN10gPSAweDViZTBjZDE5O1xuICAgICAgICB0aGlzLmJ1ZmZlckxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuYnl0ZXNIYXNoZWQgPSAwO1xuICAgICAgICB0aGlzLmZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLy8gQ2xlYW5zIGludGVybmFsIGJ1ZmZlcnMgYW5kIHJlLWluaXRpYWxpemVzIGhhc2ggc3RhdGUuXG4gICAgSGFzaC5wcm90b3R5cGUuY2xlYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVtcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy50ZW1wW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfTtcbiAgICAvLyBVcGRhdGVzIGhhc2ggc3RhdGUgd2l0aCB0aGUgZ2l2ZW4gZGF0YS5cbiAgICAvL1xuICAgIC8vIE9wdGlvbmFsbHksIGxlbmd0aCBvZiB0aGUgZGF0YSBjYW4gYmUgc3BlY2lmaWVkIHRvIGhhc2hcbiAgICAvLyBmZXdlciBieXRlcyB0aGFuIGRhdGEubGVuZ3RoLlxuICAgIC8vXG4gICAgLy8gVGhyb3dzIGVycm9yIHdoZW4gdHJ5aW5nIHRvIHVwZGF0ZSBhbHJlYWR5IGZpbmFsaXplZCBoYXNoOlxuICAgIC8vIGluc3RhbmNlIG11c3QgYmUgcmVzZXQgdG8gdXNlIGl0IGFnYWluLlxuICAgIEhhc2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBkYXRhTGVuZ3RoKSB7XG4gICAgICAgIGlmIChkYXRhTGVuZ3RoID09PSB2b2lkIDApIHsgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoOyB9XG4gICAgICAgIGlmICh0aGlzLmZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTSEEyNTY6IGNhbid0IHVwZGF0ZSBiZWNhdXNlIGhhc2ggd2FzIGZpbmlzaGVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YVBvcyA9IDA7XG4gICAgICAgIHRoaXMuYnl0ZXNIYXNoZWQgKz0gZGF0YUxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuYnVmZmVyTGVuZ3RoIDwgNjQgJiYgZGF0YUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclt0aGlzLmJ1ZmZlckxlbmd0aCsrXSA9IGRhdGFbZGF0YVBvcysrXTtcbiAgICAgICAgICAgICAgICBkYXRhTGVuZ3RoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5idWZmZXJMZW5ndGggPT09IDY0KSB7XG4gICAgICAgICAgICAgICAgaGFzaEJsb2Nrcyh0aGlzLnRlbXAsIHRoaXMuc3RhdGUsIHRoaXMuYnVmZmVyLCAwLCA2NCk7XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJMZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhTGVuZ3RoID49IDY0KSB7XG4gICAgICAgICAgICBkYXRhUG9zID0gaGFzaEJsb2Nrcyh0aGlzLnRlbXAsIHRoaXMuc3RhdGUsIGRhdGEsIGRhdGFQb3MsIGRhdGFMZW5ndGgpO1xuICAgICAgICAgICAgZGF0YUxlbmd0aCAlPSA2NDtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoZGF0YUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW3RoaXMuYnVmZmVyTGVuZ3RoKytdID0gZGF0YVtkYXRhUG9zKytdO1xuICAgICAgICAgICAgZGF0YUxlbmd0aC0tO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLy8gRmluYWxpemVzIGhhc2ggc3RhdGUgYW5kIHB1dHMgaGFzaCBpbnRvIG91dC5cbiAgICAvL1xuICAgIC8vIElmIGhhc2ggd2FzIGFscmVhZHkgZmluYWxpemVkLCBwdXRzIHRoZSBzYW1lIHZhbHVlLlxuICAgIEhhc2gucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uIChvdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpbmlzaGVkKSB7XG4gICAgICAgICAgICB2YXIgYnl0ZXNIYXNoZWQgPSB0aGlzLmJ5dGVzSGFzaGVkO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSB0aGlzLmJ1ZmZlckxlbmd0aDtcbiAgICAgICAgICAgIHZhciBiaXRMZW5IaSA9IChieXRlc0hhc2hlZCAvIDB4MjAwMDAwMDApIHwgMDtcbiAgICAgICAgICAgIHZhciBiaXRMZW5MbyA9IGJ5dGVzSGFzaGVkIDw8IDM7XG4gICAgICAgICAgICB2YXIgcGFkTGVuZ3RoID0gKGJ5dGVzSGFzaGVkICUgNjQgPCA1NikgPyA2NCA6IDEyODtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW2xlZnRdID0gMHg4MDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsZWZ0ICsgMTsgaSA8IHBhZExlbmd0aCAtIDg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyW2ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW3BhZExlbmd0aCAtIDhdID0gKGJpdExlbkhpID4+PiAyNCkgJiAweGZmO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbcGFkTGVuZ3RoIC0gN10gPSAoYml0TGVuSGkgPj4+IDE2KSAmIDB4ZmY7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcltwYWRMZW5ndGggLSA2XSA9IChiaXRMZW5IaSA+Pj4gOCkgJiAweGZmO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbcGFkTGVuZ3RoIC0gNV0gPSAoYml0TGVuSGkgPj4+IDApICYgMHhmZjtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW3BhZExlbmd0aCAtIDRdID0gKGJpdExlbkxvID4+PiAyNCkgJiAweGZmO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbcGFkTGVuZ3RoIC0gM10gPSAoYml0TGVuTG8gPj4+IDE2KSAmIDB4ZmY7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcltwYWRMZW5ndGggLSAyXSA9IChiaXRMZW5MbyA+Pj4gOCkgJiAweGZmO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbcGFkTGVuZ3RoIC0gMV0gPSAoYml0TGVuTG8gPj4+IDApICYgMHhmZjtcbiAgICAgICAgICAgIGhhc2hCbG9ja3ModGhpcy50ZW1wLCB0aGlzLnN0YXRlLCB0aGlzLmJ1ZmZlciwgMCwgcGFkTGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaSAqIDQgKyAwXSA9ICh0aGlzLnN0YXRlW2ldID4+PiAyNCkgJiAweGZmO1xuICAgICAgICAgICAgb3V0W2kgKiA0ICsgMV0gPSAodGhpcy5zdGF0ZVtpXSA+Pj4gMTYpICYgMHhmZjtcbiAgICAgICAgICAgIG91dFtpICogNCArIDJdID0gKHRoaXMuc3RhdGVbaV0gPj4+IDgpICYgMHhmZjtcbiAgICAgICAgICAgIG91dFtpICogNCArIDNdID0gKHRoaXMuc3RhdGVbaV0gPj4+IDApICYgMHhmZjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8vIFJldHVybnMgdGhlIGZpbmFsIGhhc2ggZGlnZXN0LlxuICAgIEhhc2gucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG91dCA9IG5ldyBVaW50OEFycmF5KHRoaXMuZGlnZXN0TGVuZ3RoKTtcbiAgICAgICAgdGhpcy5maW5pc2gob3V0KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuICAgIC8vIEludGVybmFsIGZ1bmN0aW9uIGZvciB1c2UgaW4gSE1BQyBmb3Igb3B0aW1pemF0aW9uLlxuICAgIEhhc2gucHJvdG90eXBlLl9zYXZlU3RhdGUgPSBmdW5jdGlvbiAob3V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gdGhpcy5zdGF0ZVtpXTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gZm9yIHVzZSBpbiBITUFDIGZvciBvcHRpbWl6YXRpb24uXG4gICAgSGFzaC5wcm90b3R5cGUuX3Jlc3RvcmVTdGF0ZSA9IGZ1bmN0aW9uIChmcm9tLCBieXRlc0hhc2hlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnl0ZXNIYXNoZWQgPSBieXRlc0hhc2hlZDtcbiAgICAgICAgdGhpcy5maW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1ZmZlckxlbmd0aCA9IDA7XG4gICAgfTtcbiAgICByZXR1cm4gSGFzaDtcbn0oKSk7XG5leHBvcnRzLkhhc2ggPSBIYXNoO1xuLy8gSE1BQyBpbXBsZW1lbnRzIEhNQUMtU0hBMjU2IG1lc3NhZ2UgYXV0aGVudGljYXRpb24gYWxnb3JpdGhtLlxudmFyIEhNQUMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSE1BQyhrZXkpIHtcbiAgICAgICAgdGhpcy5pbm5lciA9IG5ldyBIYXNoKCk7XG4gICAgICAgIHRoaXMub3V0ZXIgPSBuZXcgSGFzaCgpO1xuICAgICAgICB0aGlzLmJsb2NrU2l6ZSA9IHRoaXMuaW5uZXIuYmxvY2tTaXplO1xuICAgICAgICB0aGlzLmRpZ2VzdExlbmd0aCA9IHRoaXMuaW5uZXIuZGlnZXN0TGVuZ3RoO1xuICAgICAgICB2YXIgcGFkID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5ibG9ja1NpemUpO1xuICAgICAgICBpZiAoa2V5Lmxlbmd0aCA+IHRoaXMuYmxvY2tTaXplKSB7XG4gICAgICAgICAgICAobmV3IEhhc2goKSkudXBkYXRlKGtleSkuZmluaXNoKHBhZCkuY2xlYW4oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcGFkW2ldID0ga2V5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwYWRbaV0gXj0gMHgzNjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlubmVyLnVwZGF0ZShwYWQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGFkW2ldIF49IDB4MzYgXiAweDVjO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3V0ZXIudXBkYXRlKHBhZCk7XG4gICAgICAgIHRoaXMuaXN0YXRlID0gbmV3IFVpbnQzMkFycmF5KDgpO1xuICAgICAgICB0aGlzLm9zdGF0ZSA9IG5ldyBVaW50MzJBcnJheSg4KTtcbiAgICAgICAgdGhpcy5pbm5lci5fc2F2ZVN0YXRlKHRoaXMuaXN0YXRlKTtcbiAgICAgICAgdGhpcy5vdXRlci5fc2F2ZVN0YXRlKHRoaXMub3N0YXRlKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBhZFtpXSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUmV0dXJucyBITUFDIHN0YXRlIHRvIHRoZSBzdGF0ZSBpbml0aWFsaXplZCB3aXRoIGtleVxuICAgIC8vIHRvIG1ha2UgaXQgcG9zc2libGUgdG8gcnVuIEhNQUMgb3ZlciB0aGUgb3RoZXIgZGF0YSB3aXRoIHRoZSBzYW1lXG4gICAgLy8ga2V5IHdpdGhvdXQgY3JlYXRpbmcgYSBuZXcgaW5zdGFuY2UuXG4gICAgSE1BQy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5uZXIuX3Jlc3RvcmVTdGF0ZSh0aGlzLmlzdGF0ZSwgdGhpcy5pbm5lci5ibG9ja1NpemUpO1xuICAgICAgICB0aGlzLm91dGVyLl9yZXN0b3JlU3RhdGUodGhpcy5vc3RhdGUsIHRoaXMub3V0ZXIuYmxvY2tTaXplKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvLyBDbGVhbnMgSE1BQyBzdGF0ZS5cbiAgICBITUFDLnByb3RvdHlwZS5jbGVhbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmlzdGF0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5vc3RhdGVbaV0gPSB0aGlzLmlzdGF0ZVtpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbm5lci5jbGVhbigpO1xuICAgICAgICB0aGlzLm91dGVyLmNsZWFuKCk7XG4gICAgfTtcbiAgICAvLyBVcGRhdGVzIHN0YXRlIHdpdGggcHJvdmlkZWQgZGF0YS5cbiAgICBITUFDLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLmlubmVyLnVwZGF0ZShkYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvLyBGaW5hbGl6ZXMgSE1BQyBhbmQgcHV0cyB0aGUgcmVzdWx0IGluIG91dC5cbiAgICBITUFDLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbiAob3V0KSB7XG4gICAgICAgIGlmICh0aGlzLm91dGVyLmZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLm91dGVyLmZpbmlzaChvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbm5lci5maW5pc2gob3V0KTtcbiAgICAgICAgICAgIHRoaXMub3V0ZXIudXBkYXRlKG91dCwgdGhpcy5kaWdlc3RMZW5ndGgpLmZpbmlzaChvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLy8gUmV0dXJucyBtZXNzYWdlIGF1dGhlbnRpY2F0aW9uIGNvZGUuXG4gICAgSE1BQy5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5kaWdlc3RMZW5ndGgpO1xuICAgICAgICB0aGlzLmZpbmlzaChvdXQpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gICAgcmV0dXJuIEhNQUM7XG59KCkpO1xuZXhwb3J0cy5ITUFDID0gSE1BQztcbi8vIFJldHVybnMgU0hBMjU2IGhhc2ggb2YgZGF0YS5cbmZ1bmN0aW9uIGhhc2goZGF0YSkge1xuICAgIHZhciBoID0gKG5ldyBIYXNoKCkpLnVwZGF0ZShkYXRhKTtcbiAgICB2YXIgZGlnZXN0ID0gaC5kaWdlc3QoKTtcbiAgICBoLmNsZWFuKCk7XG4gICAgcmV0dXJuIGRpZ2VzdDtcbn1cbmV4cG9ydHMuaGFzaCA9IGhhc2g7XG4vLyBGdW5jdGlvbiBoYXNoIGlzIGJvdGggYXZhaWxhYmxlIGFzIG1vZHVsZS5oYXNoIGFuZCBhcyBkZWZhdWx0IGV4cG9ydC5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gaGFzaDtcbi8vIFJldHVybnMgSE1BQy1TSEEyNTYgb2YgZGF0YSB1bmRlciB0aGUga2V5LlxuZnVuY3Rpb24gaG1hYyhrZXksIGRhdGEpIHtcbiAgICB2YXIgaCA9IChuZXcgSE1BQyhrZXkpKS51cGRhdGUoZGF0YSk7XG4gICAgdmFyIGRpZ2VzdCA9IGguZGlnZXN0KCk7XG4gICAgaC5jbGVhbigpO1xuICAgIHJldHVybiBkaWdlc3Q7XG59XG5leHBvcnRzLmhtYWMgPSBobWFjO1xuLy8gRGVyaXZlcyBhIGtleSBmcm9tIHBhc3N3b3JkIGFuZCBzYWx0IHVzaW5nIFBCS0RGMi1ITUFDLVNIQTI1NlxuLy8gd2l0aCB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGl0ZXJhdGlvbnMuXG4vL1xuLy8gVGhlIG51bWJlciBvZiBieXRlcyByZXR1cm5lZCBpcyBlcXVhbCB0byBka0xlbi5cbi8vXG4vLyAoRm9yIGJldHRlciBzZWN1cml0eSwgYXZvaWQgZGtMZW4gZ3JlYXRlciB0aGFuIGhhc2ggbGVuZ3RoIC0gMzIgYnl0ZXMpLlxuZnVuY3Rpb24gcGJrZGYyKHBhc3N3b3JkLCBzYWx0LCBpdGVyYXRpb25zLCBka0xlbikge1xuICAgIHZhciBwcmYgPSBuZXcgSE1BQyhwYXNzd29yZCk7XG4gICAgdmFyIGxlbiA9IHByZi5kaWdlc3RMZW5ndGg7XG4gICAgdmFyIGN0ciA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIHZhciB0ID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICB2YXIgdSA9IG5ldyBVaW50OEFycmF5KGxlbik7XG4gICAgdmFyIGRrID0gbmV3IFVpbnQ4QXJyYXkoZGtMZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpICogbGVuIDwgZGtMZW47IGkrKykge1xuICAgICAgICB2YXIgYyA9IGkgKyAxO1xuICAgICAgICBjdHJbMF0gPSAoYyA+Pj4gMjQpICYgMHhmZjtcbiAgICAgICAgY3RyWzFdID0gKGMgPj4+IDE2KSAmIDB4ZmY7XG4gICAgICAgIGN0clsyXSA9IChjID4+PiA4KSAmIDB4ZmY7XG4gICAgICAgIGN0clszXSA9IChjID4+PiAwKSAmIDB4ZmY7XG4gICAgICAgIHByZi5yZXNldCgpO1xuICAgICAgICBwcmYudXBkYXRlKHNhbHQpO1xuICAgICAgICBwcmYudXBkYXRlKGN0cik7XG4gICAgICAgIHByZi5maW5pc2godSk7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIHRbal0gPSB1W2pdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAyOyBqIDw9IGl0ZXJhdGlvbnM7IGorKykge1xuICAgICAgICAgICAgcHJmLnJlc2V0KCk7XG4gICAgICAgICAgICBwcmYudXBkYXRlKHUpLmZpbmlzaCh1KTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgICAgICAgICB0W2tdIF49IHVba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsZW4gJiYgaSAqIGxlbiArIGogPCBka0xlbjsgaisrKSB7XG4gICAgICAgICAgICBka1tpICogbGVuICsgal0gPSB0W2pdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdFtpXSA9IHVbaV0gPSAwO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICBjdHJbaV0gPSAwO1xuICAgIH1cbiAgICBwcmYuY2xlYW4oKTtcbiAgICByZXR1cm4gZGs7XG59XG5leHBvcnRzLnBia2RmMiA9IHBia2RmMjtcbn0pO1xuIiwiLy8gdGhlIHdoYXR3Zy1mZXRjaCBwb2x5ZmlsbCBpbnN0YWxscyB0aGUgZmV0Y2goKSBmdW5jdGlvblxuLy8gb24gdGhlIGdsb2JhbCBvYmplY3QgKHdpbmRvdyBvciBzZWxmKVxuLy9cbi8vIFJldHVybiB0aGF0IGFzIHRoZSBleHBvcnQgZm9yIHVzZSBpbiBXZWJwYWNrLCBCcm93c2VyaWZ5IGV0Yy5cbnJlcXVpcmUoJ3doYXR3Zy1mZXRjaCcpO1xudmFyIGdsb2JhbE9iaiA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIHx8IHRoaXM7XG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbE9iai5mZXRjaC5iaW5kKGdsb2JhbE9iaik7XG4iLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgPyBzZWxmLkZvcm1EYXRhIDogd2luZG93LkZvcm1EYXRhO1xuIiwiLy8gV3JpdHRlbiBpbiAyMDE0LTIwMTYgYnkgRG1pdHJ5IENoZXN0bnlraCBhbmQgRGV2aSBNYW5kaXJpLlxuLy8gUHVibGljIGRvbWFpbi5cbihmdW5jdGlvbihyb290LCBmKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGYoKTtcbiAgZWxzZSBpZiAocm9vdC5uYWNsKSByb290Lm5hY2wudXRpbCA9IGYoKTtcbiAgZWxzZSB7XG4gICAgcm9vdC5uYWNsID0ge307XG4gICAgcm9vdC5uYWNsLnV0aWwgPSBmKCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdXRpbCA9IHt9O1xuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlQmFzZTY0KHMpIHtcbiAgICBpZiAoISgvXig/OltBLVphLXowLTkrL117NH0pKig/OltBLVphLXowLTkrL117Mn09PXxbQS1aYS16MC05Ky9dezN9PSk/JC8udGVzdChzKSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgZW5jb2RpbmcnKTtcbiAgICB9XG4gIH1cblxuICB1dGlsLmRlY29kZVVURjggPSBmdW5jdGlvbihzKSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgc3RyaW5nJyk7XG4gICAgdmFyIGksIGQgPSB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQocykpLCBiID0gbmV3IFVpbnQ4QXJyYXkoZC5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSsrKSBiW2ldID0gZC5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIHV0aWwuZW5jb2RlVVRGOCA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciBpLCBzID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYXJyW2ldKSk7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUocy5qb2luKCcnKSkpO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgYXRvYiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBOb2RlLmpzXG5cbiAgICBpZiAodHlwZW9mIEJ1ZmZlci5mcm9tICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgIC8vIE5vZGUgdjYgYW5kIGxhdGVyXG4gICAgICB1dGlsLmVuY29kZUJhc2U2NCA9IGZ1bmN0aW9uIChhcnIpIHsgLy8gdjYgYW5kIGxhdGVyXG4gICAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGFycikudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgfTtcblxuICAgICAgdXRpbC5kZWNvZGVCYXNlNjQgPSBmdW5jdGlvbiAocykge1xuICAgICAgICB2YWxpZGF0ZUJhc2U2NChzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKEJ1ZmZlci5mcm9tKHMsICdiYXNlNjQnKSwgMCkpO1xuICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOb2RlIGVhcmxpZXIgdGhhbiB2NlxuICAgICAgdXRpbC5lbmNvZGVCYXNlNjQgPSBmdW5jdGlvbiAoYXJyKSB7IC8vIHY2IGFuZCBsYXRlclxuICAgICAgICByZXR1cm4gKG5ldyBCdWZmZXIoYXJyKSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgfTtcblxuICAgICAgdXRpbC5kZWNvZGVCYXNlNjQgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHZhbGlkYXRlQmFzZTY0KHMpO1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobmV3IEJ1ZmZlcihzLCAnYmFzZTY0JyksIDApKTtcbiAgICAgIH07XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlcnNcblxuICAgIHV0aWwuZW5jb2RlQmFzZTY0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgICB2YXIgaSwgcyA9IFtdLCBsZW4gPSBhcnIubGVuZ3RoO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSBzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShhcnJbaV0pKTtcbiAgICAgIHJldHVybiBidG9hKHMuam9pbignJykpO1xuICAgIH07XG5cbiAgICB1dGlsLmRlY29kZUJhc2U2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhbGlkYXRlQmFzZTY0KHMpO1xuICAgICAgdmFyIGksIGQgPSBhdG9iKHMpLCBiID0gbmV3IFVpbnQ4QXJyYXkoZC5sZW5ndGgpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIGJbaV0gPSBkLmNoYXJDb2RlQXQoaSk7XG4gICAgICByZXR1cm4gYjtcbiAgICB9O1xuXG4gIH1cblxuICByZXR1cm4gdXRpbDtcblxufSkpO1xuIiwiKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICAgIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gICAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4iLCJsZXQgZGVmYXVsdHMgPSB7XG4gICAgQVBJX1VSTDogXCJodHRwczovL3d3dy5yaW1pbmRlci5uZXQvc2YvcHVibGljL2FwaS92MS4wXCIsXG4gICAgQVBJX1NFQ1JFVDogbnVsbCxcbiAgICBBUElfS2V5OiBudWxsXG59O1xuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHM7XG4iLCJleHBvcnQgY2xhc3MgQVBJRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJwcm9maWxlLnBhcnNlLnN1Y2Nlc3NcIixcbiAgICBcInByb2ZpbGUucGFyc2UuZXJyb3JcIixcbiAgICBcInByb2ZpbGUuc2NvcmUuc3VjY2Vzc1wiLFxuICAgIFwicHJvZmlsZS5zY29yZS5lcnJvclwiLFxuICAgIFwiZmlsdGVyLnRyYWluLnN1Y2Nlc3NcIixcbiAgICBcImZpbHRlci50cmFpbi5lcnJvclwiLFxuICAgIFwiZmlsdGVyLnNjb3JlLnN1Y2Nlc3NcIixcbiAgICBcImZpbHRlci5zY29yZS5lcnJvclwiXG5dO1xuIiwiaW1wb3J0IFwiZmV0Y2gtZXZlcnl3aGVyZVwiO1xuY29uc3QgRm9ybURhdGEgPSByZXF1aXJlKFwiZm9ybS1kYXRhXCIpO1xuaW1wb3J0IHsgQVBJRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnNcIjtcbmV4cG9ydCBjb25zdCBodHRwUmVxdWVzdCA9ICh1cmwsIG9wdGlvbnMpID0+IHtcbiAgICBsZXQgb3B0cyA9IE9iamVjdC5hc3NpZ24oeyBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGZldGNoKHVybCwgb3B0cylcbiAgICAgICAgLnRoZW4oc3VjY2Vzc0hhbmRsZXIsIGVycm9ySGFuZGxlcilcbiAgICAgICAgLnRoZW4oKGpzb24pID0+IGpzb24uZGF0YSk7XG59O1xuZXhwb3J0IGNvbnN0IGh0dHBQb3N0UmVxdWVzdCA9ICh1cmwsIGRhdGEsIGZpbGUsIG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCBib2R5ID0gZ2VuZXJhdGVCb2R5KGRhdGEsIGZpbGUpO1xuICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IG1ldGhvZDogXCJQT1NUXCIsIGJvZHkgfSk7XG4gICAgcmV0dXJuIGZldGNoKHVybCwgb3B0cylcbiAgICAgICAgLnRoZW4oc3VjY2Vzc0hhbmRsZXIsIGVycm9ySGFuZGxlcilcbiAgICAgICAgLnRoZW4oKGpzb24pID0+IGpzb24uZGF0YSk7XG59O1xuZXhwb3J0IGNvbnN0IGh0dHBQYXRjaFJlcXVlc3QgPSAodXJsLCBkYXRhLCBvcHRpb25zKSA9PiB7XG4gICAgT2JqZWN0LmFzc2lnbihvcHRpb25zLmhlYWRlcnMsIHsgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XG4gICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IG1ldGhvZDogXCJQQVRDSFwiLCBib2R5IH0pO1xuICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdHMpXG4gICAgICAgIC50aGVuKHN1Y2Nlc3NIYW5kbGVyLCBlcnJvckhhbmRsZXIpXG4gICAgICAgIC50aGVuKChqc29uKSA9PiBqc29uLmRhdGEpO1xufTtcbmNvbnN0IHN1Y2Nlc3NIYW5kbGVyID0gKHJlc3BvbnNlKSA9PiB7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwIHx8IHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgQVBJRXJyb3IoXCJBbiBlcnJvciBvY2N1cmVkXCIsIGRhdGEpO1xuICAgIH0pO1xufTtcbmNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgIGVycm9yLnJlc3BvbnNlID0gZXJyO1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG59O1xuY29uc3QgZ2VuZXJhdGVCb2R5ID0gKGRhdGEsIGZpbGUpID0+IHtcbiAgICBjb25zdCBib2R5ID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgICAgYm9keS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKGRhdGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBkYXRhW2tleV0uZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgYm9keS5hcHBlbmQoa2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYm9keS5hcHBlbmQoa2V5LCBkYXRhW2tleV0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvZHk7XG59O1xuIiwiaW1wb3J0IHsgT2JqZWN0cyB9IGZyb20gXCIuL29iamVjdHNcIjtcbmltcG9ydCB7IFdlYmhvb2tzIH0gZnJvbSBcIi4vd2ViaG9va3NcIjtcbmV4cG9ydCBjbGFzcyBSaW1pbmRlciB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuQVBJX0tleSkge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKFwiTm8gQVBJIEtleSB3YXMgc3VwcGxpZWQgZm9yIFJpbWluZGVyIFNES1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuQVBJX0tleSA9IG9wdGlvbnMuQVBJX0tleTtcbiAgICAgICAgaWYgKG9wdGlvbnMuV2ViaG9va3NfS2V5KSB7XG4gICAgICAgICAgICB0aGlzLldlYmhvb2tzX0tleSA9IG9wdGlvbnMuV2ViaG9va3NfS2V5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG4gICAgX2luaXQoKSB7XG4gICAgICAgIHRoaXMub2JqZWN0cyA9IG5ldyBPYmplY3RzKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5XZWJob29rc19LZXkpIHtcbiAgICAgICAgICAgIHRoaXMud2ViaG9va3MgPSBuZXcgV2ViaG9va3ModGhpcy5XZWJob29rc19LZXkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2VuZXJhdGVVUkxQYXJhbXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gXCIuL2RlZmF1bHRzXCI7XG5pbXBvcnQgeyBodHRwUmVxdWVzdCwgaHR0cFBvc3RSZXF1ZXN0LCBodHRwUGF0Y2hSZXF1ZXN0IH0gZnJvbSBcIi4vaHR0cFwiO1xuZXhwb3J0IGNsYXNzIE9iamVjdHMge1xuICAgIGNvbnN0cnVjdG9yKHJpbWluZGVyKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IHtcbiAgICAgICAgICAgIFwiWC1BUEktS2V5XCI6IHJpbWluZGVyLkFQSV9LZXksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldFNvdXJjZXMoKSB7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdChgJHtkZWZhdWx0cy5BUElfVVJMfS9zb3VyY2VzYCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIGdldFNvdXJjZShpZCkge1xuICAgICAgICByZXR1cm4gaHR0cFJlcXVlc3QoYCR7ZGVmYXVsdHMuQVBJX1VSTH0vc291cmNlP3NvdXJjZV9pZD0ke2lkfWAsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBnZXRGaWx0ZXJzKCkge1xuICAgICAgICByZXR1cm4gaHR0cFJlcXVlc3QoYCR7ZGVmYXVsdHMuQVBJX1VSTH0vZmlsdGVyc2AsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBnZXRGaWx0ZXIob3B0aW9ucykge1xuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBnZW5lcmF0ZVVSTFBhcmFtcyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L2ZpbHRlcj8ke3VybFBhcmFtc31gLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgZ2V0UHJvZmlsZXMob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5kYXRlX2VuZCAmJiB0eXBlb2Ygb3B0aW9ucy5kYXRlX2VuZCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgb3B0aW9ucy5kYXRlX2VuZCA9IE1hdGguZmxvb3Iob3B0aW9ucy5kYXRlX2VuZC5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5kYXRlX3N0YXJ0ICYmIHR5cGVvZiBvcHRpb25zLmRhdGVfc3RhcnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGF0ZV9zdGFydCA9IE1hdGguZmxvb3Iob3B0aW9ucy5kYXRlX3N0YXJ0LmdldFRpbWUoKSAvIDEwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IGdlbmVyYXRlVVJMUGFyYW1zKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gaHR0cFJlcXVlc3QoYCR7ZGVmYXVsdHMuQVBJX1VSTH0vcHJvZmlsZXM/JHt1cmxQYXJhbXN9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIGdldFByb2ZpbGUob3B0aW9ucykge1xuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBnZW5lcmF0ZVVSTFBhcmFtcyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGU/JHt1cmxQYXJhbXN9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIHBvc3RQcm9maWxlKGRhdGEsIGZpbGUpIHtcbiAgICAgICAgaWYgKGRhdGEudGltZXN0YW1wX3JlY2VwdGlvbiAmJiB0eXBlb2YgZGF0YS50aW1lc3RhbXBfcmVjZXB0aW9uID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBkYXRhLnRpbWVzdGFtcF9yZWNlcHRpb24gPSBNYXRoLmZsb29yKGRhdGEudGltZXN0YW1wX3JlY2VwdGlvbi5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS50cmFpbmluZ19tZXRhZGF0YSkge1xuICAgICAgICAgICAgZGF0YS50cmFpbmluZ19tZXRhZGF0YS5mb3JFYWNoKChtZXRhZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0YWRhdGEucmF0aW5nX3RpbWVzdGFtcCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5yYXRpbmdfdGltZXN0YW1wID0gTWF0aC5mbG9vcihtZXRhZGF0YS5yYXRpbmdfdGltZXN0YW1wLmdldFRpbWUoKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGFkYXRhLnN0YWdlX3RpbWVzdGFtcCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5zdGFnZV90aW1lc3RhbXAgPSBNYXRoLmZsb29yKG1ldGFkYXRhLnN0YWdlX3RpbWVzdGFtcC5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cmwgPSBgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlYDtcbiAgICAgICAgcmV0dXJuIGh0dHBQb3N0UmVxdWVzdCh1cmwsIGRhdGEsIGZpbGUsIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgIH1cbiAgICBnZXRQcm9maWxlRG9jdW1lbnRzKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gZ2VuZXJhdGVVUkxQYXJhbXMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBodHRwUmVxdWVzdChgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlL2RvY3VtZW50cz8ke3VybFBhcmFtc31gLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgZ2V0UHJvZmlsZVBhcnNpbmcob3B0aW9ucykge1xuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBnZW5lcmF0ZVVSTFBhcmFtcyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGUvcGFyc2luZz8ke3VybFBhcmFtc31gLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgZ2V0UHJvZmlsZVNjb3Jpbmcob3B0aW9ucykge1xuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBnZW5lcmF0ZVVSTFBhcmFtcyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGh0dHBSZXF1ZXN0KGAke2RlZmF1bHRzLkFQSV9VUkx9L3Byb2ZpbGUvc2NvcmluZz8ke3VybFBhcmFtc31gLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICB9XG4gICAgcGF0Y2hQcm9maWxlU3RhZ2UoZGF0YSkge1xuICAgICAgICBsZXQgdXJsID0gYCR7ZGVmYXVsdHMuQVBJX1VSTH0vcHJvZmlsZS9zdGFnZWA7XG4gICAgICAgIHJldHVybiBodHRwUGF0Y2hSZXF1ZXN0KHVybCwgZGF0YSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxuICAgIHBhdGNoUHJvZmlsZVJhdGluZyhkYXRhKSB7XG4gICAgICAgIGxldCB1cmwgPSBgJHtkZWZhdWx0cy5BUElfVVJMfS9wcm9maWxlL3JhdGluZ2A7XG4gICAgICAgIHJldHVybiBodHRwUGF0Y2hSZXF1ZXN0KHVybCwgZGF0YSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGdlbmVyYXRlVVJMUGFyYW1zID0gKG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gb3B0aW9ucyA/IE9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcChrZXkgPT4ge1xuICAgICAgICBpZiAob3B0aW9uc1trZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtrZXl9PVske29wdGlvbnNba2V5XS5tYXAoKGVsZW0pID0+IGBcIiR7ZWxlbX1cImApLmpvaW4oXCIsXCIpfV1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHtrZXl9PSR7b3B0aW9uc1trZXldfWA7XG4gICAgfSkuam9pbihcIiZcIikgOiBudWxsO1xufTtcbiIsImltcG9ydCBFdmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ0d2VldG5hY2wtdXRpbFwiO1xuaW1wb3J0ICogYXMgc2hhMjU2IGZyb20gXCJmYXN0LXNoYTI1NlwiO1xuZXhwb3J0IGNsYXNzIFdlYmhvb2tzIHtcbiAgICBjb25zdHJ1Y3RvcihzZWNyZXRLZXkpIHtcbiAgICAgICAgaWYgKCFzZWNyZXRLZXkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSB3ZWJob29rIHNlY3JldCBrZXkgbXVzdCBiZSBzcGVjaWZpZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ZWJob29rU2VjcmV0S2V5ID0gc2VjcmV0S2V5O1xuICAgICAgICB0aGlzLmJpbmRpbmcgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGhhbmRsZVdlYmhvb2soaGVhZGVycykge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFoZWFkZXJzW1wiSFRUUF9SSU1JTkRFUl9TSUdOQVRVUkVcIl0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2lnbmF0dXJlIGlzIG1pc3NpbmcgZnJvbSB0aGUgaGVhZGVyc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFtlbmNvZGVkU2lnbmF0dXJlLCBlbmNvZGVkUGF5bG9hZF0gPSBoZWFkZXJzW1wiSFRUUF9SSU1JTkRFUl9TSUdOQVRVUkVcIl0uc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRTaWduYXR1cmUgPSB1dGlsLmVuY29kZUJhc2U2NChzaGEyNTYuaG1hYyh1dGlsLmRlY29kZVVURjgodGhpcy53ZWJob29rU2VjcmV0S2V5KSwgdXRpbC5kZWNvZGVVVEY4KGVuY29kZWRQYXlsb2FkKSkpO1xuICAgICAgICAgICAgaWYgKGVuY29kZWRTaWduYXR1cmUgIT09IGV4cGVjdGVkU2lnbmF0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNpZ25hdHVyZSBpcyBpbnZhbGlkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2UodXRpbC5lbmNvZGVVVEY4KHV0aWwuZGVjb2RlQmFzZTY0KGVuY29kZWRQYXlsb2FkKSkpO1xuICAgICAgICAgICAgaWYgKEV2ZW50cy5pbmRleE9mKHBheWxvYWQudHlwZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGV2ZW50OiAke3BheWxvYWQudHlwZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NhbGxCaW5kaW5nKHBheWxvYWQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKEV2ZW50cy5pbmRleE9mKGV2ZW50KSA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZXZlbnQgZG9lc24ndCBleGlzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5iaW5kaW5nLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgY2FsbGJhY2sgYWxyZWFkeSBoYXMgYmVlbiBkZWNsYXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJpbmRpbmcuc2V0KGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBfY2FsbEJpbmRpbmcocGF5bG9hZCkge1xuICAgICAgICBpZiAodGhpcy5iaW5kaW5nLmhhcyhwYXlsb2FkLnR5cGUpKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRpbmcuZ2V0KHBheWxvYWQudHlwZSkocGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
