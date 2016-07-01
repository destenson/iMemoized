/* iMemoized v0.0.2
 * Copyright 2016, AnyWhichWay and Simon Y. Blackwell
 * Available under MIT license <https://mths.be/mit>
 */
(function() {
	"use strict";
	
	function iMemoized(constructorOrObject,exclude=[]) {
		function memoize(object) {
			Object.keys(object).forEach((key) => {
				if(!exclude.includes(key) && typeof(object[key])==="function") {
					object[key] = iMemoized.memoize(object[key]);
				}
			});
			return object;
		}
	
		if(typeof(constructorOrObject)==="function") {
			memoize(constructorOrObject.prototype);
			return new Proxy(constructorOrObject,{
				construct: function(target,argumentsList) {
					return memoize(new target(...argumentsList));
				}
			});
		}
		return memoize(constructorOrObject);
	}
	iMemoized.memoize = function(f) {
		var results = {},
			mf = function() {
				var result = results, exists = true, type;
				for(var i=0;i<arguments.length;i++) {
					let arg = arguments[i];
					type = typeof(arg);
					if(arg && type==="object") {
						return f; // can't memoize
					}
					if(result[arg]!==undefined) {
						result = result[arg][type];
					} else {
						result[arg] = {};
						if(i<arguments.length-1) {
							result[arg][type] = {};
							result = result[arg][type];
						} else {
							result = result[arg];	
						}
						exists = false;
					}
				}
				if(exists) {
					return result;
				}
				result[type] = f.apply(this,arguments);
				return result[type];
			}
		Object.defineProperty(mf,"flush",{configurable:true,writable:true,enumerable:false,value:function() { results = {}; }});
		return mf;
	}

	if (typeof(module)!=="undefined") {
		module.exports  = iMemoized;
	}
	if(typeof(window)!=="undefined") {
		window.iMemoized = iMemoized;
	}
})();