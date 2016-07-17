/* iMemoized v0.0.9
 * Copyright 2016, AnyWhichWay and Simon Y. Blackwell
 * Available under MIT license <https://mths.be/mit>
 */
(function() {
	"use strict";
	
	function iMemoized(constructorOrObject,excludeOrConfig,classMethods,keyProperty) {
		// ensure backward compatibility with <= v0.0.8
		var config = (excludeOrConfig && typeof(excludeOrConfig)==="object" ? excludeOrConfig : {exclude:excludeOrConfig,classMethods:classMethods,keyProperty:keyProperty}),
			exclude = (config && config.exclude ? config.exclude : []),
			classMethods = (config ? config.classMethods : null),
			keyProperty = (config ? config.keyProperty :null),
			statistics = (config ? config.statistics : false);

		function memoize(object) {
			Object.keys(object).forEach(function(key) {
				if(exclude.indexOf(key)===-1 && typeof(object[key])==="function") {
					object[key] = iMemoized.memoize(object[key],{keyProperty:keyProperty,statistics:statistics});
				}
			});
			return object;
		}
	
		if(typeof(constructorOrObject)==="function") {
			if(classMethods) {
				memoize(constructorOrObject);
			}
			memoize(constructorOrObject.prototype);
			if(typeof(Proxy)!=="undefined") { 
				return new Proxy(constructorOrObject,{
					// ugly, poor style code because Safari is so far behind the standards
					construct: function(Target,argumentsList) {
						var instance = Object.create(Target.prototype);
						instance.constructor = Target;
						var result = Target.apply(instance,argumentsList);
						if(result) {
							return memoize(result);
						} else {
							return memoize(instance);
						}
						//return memoize(new Target(...argumentsList));
					}
				});
			}
		}
		return memoize(constructorOrObject);
	}
	iMemoized.memoize = function(f,keyPropertyOrConfig) {
		// ensure backward compatibility with <= v0.0.8
		var results = {},
			keyProperty = (keyPropertyOrConfig && typeof(keyPropertyOrConfig)==="object" ? keyPropertyOrConfig.keyProperty : keyPropertyOrConfig),
			statistics = (keyPropertyOrConfig && typeof(keyPropertyOrConfig)==="object" ? keyPropertyOrConfig.statistics : false),
			// we could use a function Proxy here with apply, but that would break a lot of old browsers that don't yet support it
			// also, tests have shown it would be 50% slower!
			mf = function() { 
				var result = results, exists = true, type;
				for(var i=0;i<arguments.length;i++) {
					var arg = arguments[i]; // Safari does not support let
					type = typeof(arg);
					if(arg && type==="object") {
						if(!keyProperty || arg[keyProperty]===null || arg[keyProperty]===undefined) {
							return f.apply(this,arguments); // can't memoize
						}
						arg = arg[keyProperty];
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
					if(statistics) {
						mf.statistics.hits++;
					}
					return result;
				}
				result[type] = f.apply(this,arguments);
				if(statistics) {
					mf.statistics.initialized = new Date();
				}
				return result[type];
			};
		if(statistics) {
			Object.defineProperty(mf,"statistics",{configurable:true,writable:true,enumerable:false,value: {hits:0,initialized:null}});
		}
		// poor style value: code because Safari is so far behind the standards
		Object.defineProperty(mf,"flush",{configurable:true,writable:true,enumerable:false,value: function(){ 
			results = {};
			if(statistics) {
				mf.statistics.hits = 0;
				mf.statistics.initialized = null;
			}
		}});
		return mf;
	};

	if (typeof(module)!=="undefined") {
		module.exports  = iMemoized;
	}
	if(typeof(window)!=="undefined") {
		window.iMemoized = iMemoized;
	}
})();