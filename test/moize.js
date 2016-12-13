(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("moize", [], factory);
	else if(typeof exports === 'object')
		exports["moize"] = factory();
	else
		root["moize"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _mapOrSimilar = __webpack_require__(2);
	
	var _mapOrSimilar2 = _interopRequireDefault(_mapOrSimilar);
	
	var _utils = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @module moize
	 */
	
	/**
	 * @function moize
	 *
	 * @description
	 * store cached values returned from calling method with arguments to avoid reprocessing data from same arguments
	 *
	 * @example
	 * import moize from 'moize';
	 *
	 * // standard implementation
	 * const fn = (foo, bar) => {
	 *  return `${foo} ${bar}`;
	 * };
	 * const memoizedFn = moize(fn);
	 *
	 * // implementation with options
	 * const fn = async (id) => {
	 *  return get(`http://foo.com/${id}`);
	 * };
	 * const memoizedFn = moize(fn, {
	 *  isPromise: true,
	 *  maxSize: 5
	 * });
	 *
	 * @param {function} fn method to memoize
	 * @param {Options} [options={}] options to customize how the caching is handled
	 * @param {Map} [options.cache=new Map()] caching mechanism to use for method
	 * @param {boolean} [options.isPromise=false] is the function return expected to be a promise to resolve
	 * @param {number} [options.maxAge=Infinity] the maximum age the value should persist in cache
	 * @param {number} [options.maxSize=Infinity] the maximum size of the cache to retain
	 * @param {function} [options.serializer=serializeArguments] method to serialize arguments with for cache storage
	 * @returns {Function} higher-order function which either returns from cache or newly-computed value
	 */
	
	
	// external dependencies
	var moize = function moize(fn) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var _options$cache = options.cache,
	      cache = _options$cache === undefined ? new _mapOrSimilar2.default() : _options$cache,
	      _options$isPromise = options.isPromise,
	      isPromise = _options$isPromise === undefined ? false : _options$isPromise,
	      _options$maxAge = options.maxAge,
	      maxAge = _options$maxAge === undefined ? _utils.INFINITY : _options$maxAge,
	      _options$maxSize = options.maxSize,
	      maxSize = _options$maxSize === undefined ? _utils.INFINITY : _options$maxSize,
	      _options$serializer = options.serializer,
	      serializer = _options$serializer === undefined ? _utils.serializeArguments : _options$serializer;
	
	  var isMaxAgeFinite = maxAge !== _utils.INFINITY;
	  var isMaxSizeFinite = maxSize !== _utils.INFINITY;
	
	  var key = '';
	
	  /**
	   * @private
	   *
	   * @function memoizedFunction
	   *
	   * @description
	   * higher-order function which either returns from cache or stores newly-computed value and returns it
	   *
	   * @param {Array<*>} args arguments passed to method
	   * @returns {any} value resulting from executing of fn passed to memoize
	   */
	  var memoizedFunction = function memoizedFunction() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    key = (0, _utils.getCacheKey)(args, serializer);
	
	    if (isMaxSizeFinite) {
	      (0, _utils.setUsageOrder)(memoizedFunction, key, maxSize);
	    }
	
	    if (memoizedFunction.cache.has(key)) {
	      return memoizedFunction.cache.get(key);
	    }
	
	    return (0, _utils.setNewCachedValue)(memoizedFunction, key, fn.apply(this, args), isPromise, isMaxAgeFinite, maxAge);
	  };
	
	  return (0, _utils.getFunctionWithCacheAdded)(memoizedFunction, cache);
	};
	
	// utils
	exports.default = moize;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(forceSimilar) {
		if (typeof Map !== 'function' || forceSimilar) {
			var Similar = __webpack_require__(3);
			return new Similar();
		}
		else {
			return new Map();
		}
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Similar() {
		this.list = [];
		this.lastItem = undefined;
		this.size = 0;
	
		return this;
	}
	
	Similar.prototype.get = function(key) {
		var index;
	
		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			return this.lastItem.val;
		}
	
		index = this.indexOf(key);
		if (index >= 0) {
			this.lastItem = this.list[index];
			return this.list[index].val;
		}
	
		return undefined;
	};
	
	Similar.prototype.set = function(key, val) {
		var index;
	
		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			this.lastItem.val = val;
			return this;
		}
	
		index = this.indexOf(key);
		if (index >= 0) {
			this.lastItem = this.list[index];
			this.list[index].val = val;
			return this;
		}
	
		this.lastItem = { key: key, val: val };
		this.list.push(this.lastItem);
		this.size++;
	
		return this;
	};
	
	Similar.prototype.delete = function(key) {
		var index;
	
		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			this.lastItem = undefined;
		}
	
		index = this.indexOf(key);
		if (index >= 0) {
			this.size--;
			return this.list.splice(index, 1)[0];
		}
	
		return undefined;
	};
	
	
	// important that has() doesn't use get() in case an existing key has a falsy value, in which case has() would return false
	Similar.prototype.has = function(key) {
		var index;
	
		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			return true;
		}
	
		index = this.indexOf(key);
		if (index >= 0) {
			this.lastItem = this.list[index];
			return true;
		}
	
		return false;
	};
	
	Similar.prototype.forEach = function(callback, thisArg) {
		var i;
		for (i = 0; i < this.size; i++) {
			callback.call(thisArg || this, this.list[i].val, this.list[i].key, this);
		}
	};
	
	Similar.prototype.indexOf = function(key) {
		var i;
		for (i = 0; i < this.size; i++) {
			if (this.isEqual(this.list[i].key, key)) {
				return i;
			}
		}
		return -1;
	};
	
	// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
	Similar.prototype.isEqual = function(val1, val2) {
		return val1 === val2 || (val1 !== val1 && val2 !== val2);
	};
	
	module.exports = Similar;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setUsageOrder = exports.setNewCachedValue = exports.setExpirationOfCache = exports.serializeArguments = exports.getStringifiedArgument = exports.stringify = exports.getFunctionWithCacheAdded = exports.deleteItemFromCache = exports.getCacheKey = exports.isComplexObject = exports.unshift = exports.splice = exports.INFINITY = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _cycle = __webpack_require__(5);
	
	var _cycle2 = _interopRequireDefault(_cycle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INFINITY = exports.INFINITY = Number.POSITIVE_INFINITY;
	
	/**
	 * @private
	 *
	 * @function splice
	 *
	 * @description
	 * faster version of splicing a single item from the array
	 *
	 * @param {Array<*>} array array to splice from
	 * @param {number} index index to splice at
	 */
	var splice = exports.splice = function splice(array, index) {
	  var length = array.length;
	
	  if (!length) {
	    return;
	  }
	
	  while (index < length) {
	    array[index] = array[index + 1];
	    index++;
	  }
	
	  array.length = length - 1;
	};
	
	/**
	 * @private
	 *
	 * @function unshift
	 *
	 * @description
	 * faster version of unshifting a single item into an array
	 *
	 * @param {Array<*>} array array to unshift into
	 * @param {*} item item to unshift into array
	 */
	var unshift = exports.unshift = function unshift(array, item) {
	  var length = array.length;
	
	  while (length) {
	    array[length] = array[length - 1];
	    length--;
	  }
	
	  array[0] = item;
	};
	
	/**
	 * @private
	 *
	 * @function isComplexObject
	 *
	 * @description
	 * is the object passed a complex object
	 *
	 * @param {*} object object to test if it is complex
	 * @returns {boolean}
	 */
	var isComplexObject = exports.isComplexObject = function isComplexObject(object) {
	  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null;
	};
	
	/**
	 * @private
	 *
	 * @function getCacheKey
	 *
	 * @description
	 * get the key used for storage in the method's cache
	 *
	 * @param {Array<*>} args arguments passed to the method
	 * @param {function} serializer method used to serialize keys into a string
	 * @returns {*}
	 */
	var getCacheKey = exports.getCacheKey = function getCacheKey(args, serializer) {
	  return args.length === 1 ? args[0] : serializer(args);
	};
	
	/**
	 * @private
	 *
	 * @function deleteItemFromCache
	 *
	 * @description
	 * remove an item from cache and the usage list
	 *
	 * @param {Map|Object} cache caching mechanism for method
	 * @param {Array<*>} usage order of key usage
	 * @param {*} key key to delete
	 */
	var deleteItemFromCache = exports.deleteItemFromCache = function deleteItemFromCache(cache, usage, key) {
	  var index = usage.indexOf(key);
	
	  if (index !== -1) {
	    splice(usage, index);
	    cache.delete(key);
	  }
	};
	
	/**
	 * @private
	 *
	 * @function getFunctionWithCacheAdded
	 *
	 * @description
	 * add the caching mechanism to the function passed and return the function
	 *
	 * @param {function} fn method that will have the cache added to it
	 * @param {Map|Object} cache caching mechanism that has get / set / has methods
	 * @returns {Function} method that has cache mechanism added to it
	 */
	var getFunctionWithCacheAdded = exports.getFunctionWithCacheAdded = function getFunctionWithCacheAdded(fn, cache) {
	  fn.cache = cache;
	  fn.usage = [];
	
	  /**
	   * @private
	   *
	   * @function clear
	   *
	   * @description
	   * clear the current cache for this method
	   */
	  fn.clear = function () {
	    fn.cache.clear();
	    fn.usage = [];
	  };
	
	  /**
	   * @private
	   *
	   * @function delete
	   *
	   * @description
	   * delete the cache for the key passed for this method
	   *
	   * @param {*} key key to remove from cache
	   */
	  fn.delete = function (key) {
	    deleteItemFromCache(fn.cache, fn.usage, key);
	  };
	
	  return fn;
	};
	
	/**
	 * @private
	 *
	 * @function stringify
	 *
	 * @description
	 * stringify with a custom replacer if circular, else use standard JSON.stringify
	 *
	 * @param {*} value value to stringify
	 * @returns {string} the stringified version of value
	 */
	var stringify = exports.stringify = function stringify(value) {
	  try {
	    return JSON.stringify(value);
	  } catch (exception) {
	    return _cycle2.default.decycle(value);
	  }
	};
	
	/**
	 * @private
	 *
	 * @function getStringifiedArgument
	 *
	 * @description
	 * get the stringified version of the argument passed
	 *
	 * @param {*} arg argument to stringify
	 * @returns {string}
	 */
	var getStringifiedArgument = exports.getStringifiedArgument = function getStringifiedArgument(arg) {
	  return isComplexObject(arg) ? stringify(arg) : arg;
	};
	
	/**
	 * @private
	 *
	 * @function serializeArguments
	 *
	 * @description
	 * serialize the arguments into a string
	 *
	 * @param {Array<*>} args arguments to serialize into string
	 * @returns {string} string of serialized arguments
	 */
	var serializeArguments = exports.serializeArguments = function serializeArguments(args) {
	  var length = args.length;
	
	  var index = -1,
	      key = '|';
	
	  while (++index < length) {
	    key += getStringifiedArgument(args[index]) + '|';
	  }
	
	  return key;
	};
	
	/**
	 * @private
	 *
	 * @function setExpirationOfCache
	 *
	 * @description
	 * set the cache to expire after the maxAge passed (coalesced to 0)
	 *
	 * @param {function} fn memoized function with cache and usage storage
	 * @param {*} key key in cache to expire
	 * @param {number} maxAge number in ms to wait before expiring the cache
	 */
	var setExpirationOfCache = exports.setExpirationOfCache = function setExpirationOfCache(fn, key, maxAge) {
	  var cache = fn.cache,
	      usage = fn.usage;
	
	
	  var expirationTime = Math.max(maxAge, 0);
	
	  setTimeout(function () {
	    deleteItemFromCache(cache, usage, key);
	  }, expirationTime);
	};
	
	/**
	 * @private
	 *
	 * @function setNewCachedValue
	 *
	 * @description
	 * assign the new value to the key in the functions cache and return the value
	 *
	 * @param {function} fn method whose cache will have new value assigned
	 * @param {*} key key in cache to assign value to
	 * @param {*} value value to store in cache
	 * @param {boolean} isPromise is the value a promise or not
	 * @param {boolean} isMaxAgeFinite does the cache have a maxAge or not
	 * @param {number} maxAge how long should the cache persist
	 * @returns {any} value just stored in cache
	 */
	var setNewCachedValue = exports.setNewCachedValue = function setNewCachedValue(fn, key, value, isPromise, isMaxAgeFinite, maxAge) {
	  if (isPromise) {
	    value.then(function (resolvedValue) {
	      fn.cache.set(key, resolvedValue);
	    });
	  } else {
	    fn.cache.set(key, value);
	  }
	
	  if (isMaxAgeFinite) {
	    setExpirationOfCache(fn, key, maxAge);
	  }
	
	  return value;
	};
	
	/**
	 * @private
	 *
	 * @function setUsageOrder
	 *
	 * @description
	 * place the key passed at the front of the array, removing it from its current index if it
	 * exists and removing the last item in the array if it is larger than maxSize
	 *
	 * @param {function} fn memoized function storing cache
	 * @param {Map} fn.cache caching mechanism used by memoized function
	 * @param {Array<*>} fn.usage array of keys in order of most recently used
	 * @param {*} key key to place at the front of the array
	 * @param {number} maxSize the maximum size of the cache
	 */
	var setUsageOrder = exports.setUsageOrder = function setUsageOrder(fn, key, maxSize) {
	  var cache = fn.cache,
	      usage = fn.usage;
	
	  var index = usage.indexOf(key);
	
	  if (index !== 0) {
	    if (index !== -1) {
	      splice(usage, index);
	    }
	
	    unshift(usage, key);
	
	    if (usage.length > maxSize) {
	      deleteItemFromCache(cache, usage, usage[usage.length - 1]);
	    }
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	    cycle.js
	    2013-02-19
	
	    Public Domain.
	
	    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	
	    This code should be minified before deployment.
	    See http://javascript.crockford.com/jsmin.html
	
	    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	    NOT CONTROL.
	*/
	
	/*jslint evil: true, regexp: true */
	
	/*members $ref, apply, call, decycle, hasOwnProperty, length, prototype, push,
	    retrocycle, stringify, test, toString
	*/
	
	var cycle = exports;
	
	cycle.decycle = function decycle(object) {
	    'use strict';
	
	// Make a deep copy of an object or array, assuring that there is at most
	// one instance of each object or array in the resulting structure. The
	// duplicate references (which might be forming cycles) are replaced with
	// an object of the form
	//      {$ref: PATH}
	// where the PATH is a JSONPath string that locates the first occurance.
	// So,
	//      var a = [];
	//      a[0] = a;
	//      return JSON.stringify(JSON.decycle(a));
	// produces the string '[{"$ref":"$"}]'.
	
	// JSONPath is used to locate the unique object. $ indicates the top level of
	// the object or array. [NUMBER] or [STRING] indicates a child member or
	// property.
	
	    var objects = [],   // Keep a reference to each unique object or array
	        paths = [];     // Keep the path to each unique object or array
	
	    return (function derez(value, path) {
	
	// The derez recurses through the object, producing the deep copy.
	
	        var i,          // The loop counter
	            name,       // Property name
	            nu;         // The new object or array
	
	// typeof null === 'object', so go on if this value is really an object but not
	// one of the weird builtin objects.
	
	        if (typeof value === 'object' && value !== null &&
	                !(value instanceof Boolean) &&
	                !(value instanceof Date)    &&
	                !(value instanceof Number)  &&
	                !(value instanceof RegExp)  &&
	                !(value instanceof String)) {
	
	// If the value is an object or array, look to see if we have already
	// encountered it. If so, return a $ref/path object. This is a hard way,
	// linear search that will get slower as the number of unique objects grows.
	
	            for (i = 0; i < objects.length; i += 1) {
	                if (objects[i] === value) {
	                    return {$ref: paths[i]};
	                }
	            }
	
	// Otherwise, accumulate the unique value and its path.
	
	            objects.push(value);
	            paths.push(path);
	
	// If it is an array, replicate the array.
	
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                nu = [];
	                for (i = 0; i < value.length; i += 1) {
	                    nu[i] = derez(value[i], path + '[' + i + ']');
	                }
	            } else {
	
	// If it is an object, replicate the object.
	
	                nu = {};
	                for (name in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, name)) {
	                        nu[name] = derez(value[name],
	                            path + '[' + JSON.stringify(name) + ']');
	                    }
	                }
	            }
	            return nu;
	        }
	        return value;
	    }(object, '$'));
	};
	
	
	cycle.retrocycle = function retrocycle($) {
	    'use strict';
	
	// Restore an object that was reduced by decycle. Members whose values are
	// objects of the form
	//      {$ref: PATH}
	// are replaced with references to the value found by the PATH. This will
	// restore cycles. The object will be mutated.
	
	// The eval function is used to locate the values described by a PATH. The
	// root object is kept in a $ variable. A regular expression is used to
	// assure that the PATH is extremely well formed. The regexp contains nested
	// * quantifiers. That has been known to have extremely bad performance
	// problems on some browsers for very long strings. A PATH is expected to be
	// reasonably short. A PATH is allowed to belong to a very restricted subset of
	// Goessner's JSONPath.
	
	// So,
	//      var s = '[{"$ref":"$"}]';
	//      return JSON.retrocycle(JSON.parse(s));
	// produces an array containing a single element which is the array itself.
	
	    var px =
	        /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
	
	    (function rez(value) {
	
	// The rez function walks recursively through the object looking for $ref
	// properties. When it finds one that has a value that is a path, then it
	// replaces the $ref object with a reference to the value that is found by
	// the path.
	
	        var i, item, name, path;
	
	        if (value && typeof value === 'object') {
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                for (i = 0; i < value.length; i += 1) {
	                    item = value[i];
	                    if (item && typeof item === 'object') {
	                        path = item.$ref;
	                        if (typeof path === 'string' && px.test(path)) {
	                            value[i] = eval(path);
	                        } else {
	                            rez(item);
	                        }
	                    }
	                }
	            } else {
	                for (name in value) {
	                    if (typeof value[name] === 'object') {
	                        item = value[name];
	                        if (item) {
	                            path = item.$ref;
	                            if (typeof path === 'string' && px.test(path)) {
	                                value[name] = eval(path);
	                            } else {
	                                rez(item);
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }($));
	    return $;
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=moize.js.map