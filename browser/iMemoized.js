(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* iMemoized v0.0.3
 * Copyright 2016, AnyWhichWay and Simon Y. Blackwell
 * Available under MIT license <https://mths.be/mit>
 */
(function() {
	"use strict";
	
	function iMemoized(constructorOrObject,exclude=[],classMethods,keyProperty) {
		function memoize(object) {
			Object.keys(object).forEach((key) => {
				if(!exclude.includes(key) && typeof(object[key])==="function") {
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
			return new Proxy(constructorOrObject,{
				construct(Target,argumentsList) {
					return memoize(new Target(...argumentsList));
				}
			});
		}
		return memoize(constructorOrObject);
	}
	iMemoized.memoize = function(f,keyProperty) {
		var results = {},
			mf = function() {
				var result = results, exists = true, type;
				for(var i=0;i<arguments.length;i++) {
					let arg = arguments[i];
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
		Object.defineProperty(mf,"flush",{configurable:true,writable:true,enumerable:false,value(){ results = {}; }});
		return mf;
	}

	if (typeof(module)!=="undefined") {
		module.exports  = iMemoized;
	}
	if(typeof(window)!=="undefined") {
		window.iMemoized = iMemoized;
	}
})();
},{}]},{},[1]);
