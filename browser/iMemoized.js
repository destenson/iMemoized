(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* iMemoized v0.0.5
 * Copyright 2016, AnyWhichWay and Simon Y. Blackwell
 * Available under MIT license <https://mths.be/mit>
 */
(function() {
	"use strict";
	
	function iMemoized(constructorOrObject,exclude,classMethods,keyProperty) {
		exclude = (exclude ? exclude : []);
		function memoize(object) {
			Object.keys(object).forEach(function(key) {
				if(exclude.indexOf(key)===-1 && typeof(object[key])==="function") {
					object[key] = iMemoized.memoize(object[key],keyProperty);
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
	iMemoized.memoize = function(f,keyProperty) {
		var results = {},
			mf = function() {
				var result = results, exists = true, type;
				for(var i=0;i<arguments.length;i++) {
					var arg = arguments[i]; // Safari does not support let
					type = typeof(arg);
					if(arg && type==="object") {
						if(!keyProperty || arg[keyProperty]===null || typeof(arg[keyProperty])==="undefined") {
							return f.apply(this,arguments); // can't memoize
						}
						arg = arg[keyProperty];
					}
					if(typeof(result[arg])!=="undefined") {
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
			};
		// poor style value: code because Safari is so far behind the standards
		Object.defineProperty(mf,"flush",{configurable:true,writable:true,enumerable:false,value: function(){ results = {}; }});
		return mf;
	};

	if (typeof(module)!=="undefined") {
		module.exports  = iMemoized;
	}
	if(typeof(window)!=="undefined") {
		window.iMemoized = iMemoized;
	}
})();
},{}]},{},[1]);
