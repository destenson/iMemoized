(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* iMemoized v0.0.10
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
		var results = {}, // results is the results cache inside a closure
			/* 
			 *  it is an object that serves as an index leveraging thousands of hours of JavaScript engine optimization by Google, Mozilla, and others:
			 *  
			 *  function myFunction(arg1,arg2) { return arg1 + arg2; }
			 *  
			 *  these two calls:
			 *  
			 *  myFunction(1,2);
			 *  myFunction(1,"2");
			 *  
			 *  will result in an index:
			 *  
			 *  {1: {number: {2: {number: 3}}}, // 1 + 2 = 3
			 *               {2: {string: "12"}}} // 1 + "2" = "12";
			 *  
			 *  in the case of objects, the value keys will be the unique ids of the objects
			 */
		
			keyProperty = (keyPropertyOrConfig && typeof(keyPropertyOrConfig)==="object" ? keyPropertyOrConfig.keyProperty : keyPropertyOrConfig),
			statistics = (keyPropertyOrConfig && typeof(keyPropertyOrConfig)==="object" ? keyPropertyOrConfig.statistics : false),
			// we could use a function Proxy here with apply, but that would break a lot of old browsers that don't yet support it
			// also, tests have shown it would be 50% slower!
			mf = function() { 
				var result = results, exists = true, type;
				// result tracks the current node in the results index, initially set to the root, i.e. results
				// loop through all the arguments
				for(var i=0;i<arguments.length;i++) {
					var arg = arguments[i]; // Safari does not support let
					type = typeof(arg);
					if(arg && type==="object") {
						if(!keyProperty || arg[keyProperty]===null || arg[keyProperty]===undefined) {
							return f.apply(this,arguments); // can't memoize
						}
						arg = arg[keyProperty];
					}
					if(result[arg]!==undefined) { // there is an argument value key in current index node
						if(typeof(result[arg][type])!=="undefined") { // of the correct type
							result = result[arg][type]; // descend to the node
						} else if(i<arguments.length-1) { // if not the last argument
							result[arg][type] = {}; // also create a type node
							result = result[arg][type]; // set the node to the newly created node
						} else {
							result = result[arg]; // set the result to just	above what will be the last node
						}
					} else {
						result[arg] = {}; // create the argument key in the current index node
						if(i<arguments.length-1) { // if not the last argument
							result[arg][type] = {}; // also create a type node
							result = result[arg][type]; // set the node to the newly created node
						} else {
							result = result[arg]; // set the result to just	above what will be the last node
						}
						exists = false; // set a flag indicating the arguments set has never been seen
					}
				} // continue with the next argument
				if(exists) { // if a result was found
					if(statistics) {
						mf.statistics.hits++;
					}
					return result; // return hit
				}
				result[type] = f.apply(this,arguments); // otherwise cache the value with its type by actually calling the function
				if(statistics) {
					mf.statistics.initialized = new Date(); // set the initialization timestamp for the statistics
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
},{}]},{},[1]);
