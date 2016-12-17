# iMemoized
A super-fast memoizer that handle primitives, objects and classes as arguments. Faster than lodash, but more powerful. Less than 1K when minified and gzipped. Faster than moize for single and multiple primitives as well as objects as of Dec 16th, 2016.

[![Build Status](https://travis-ci.org/anywhichway/jovial.svg)](https://travis-ci.org/anywhichway/iMemoized)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9e081fb170dd421ba31a95127f5929de)](https://www.codacy.com/app/syblackwell/iMemoized?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/iMemoized&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/anywhichway/iMemoized/badges/gpa.svg)](https://codeclimate.com/github/anywhichway/iMemoized)
[![Test Coverage](https://codeclimate.com/github/anywhichway/iMemoized/badges/coverage.svg)](https://codeclimate.com/github/anywhichway/iMemoized/coverage)

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| 46, 47| 51, 52 | 6.2, 7.1, 8.0 |

Browser tests sponsored by [BrowserStack](https://www.browserstack.com/)

Below are benchmark results for computing Fibonacci value for 35 using a single or multi parameter recursive function showing iMemoized is the fastest in a Chrome environment. 

Note, benchmarks may vary dramatically from environment to environment. We make no absolute claim that iMemoized is the fastest or fastest possible memoizer. You should test in your own environment.


```
un-memoized x 8.16 ops/sec +/- 1.67% (23 runs sampled)

iMemoize.memoize x 21,640,466 ops/sec +/- 2.62% (56 runs sampled)

lodash _.memoize x 6,789,778 ops/sec +/- 2.43% (54 runs sampled)

fast-memoize x 5,433,046 ops/sec +/- 3.59% (50 runs sampled)

moize x 8,267,878 ops/sec +/- 3.86% (47 runs sampled)


iMemoizedMulti x 16,459,639 ops/sec +/- 4.68% (46 runs sampled)

moizeMulti x 8,290,546 ops/sec +/- 4.72% (41 runs sampled)


iMemoizedMultiObject x 20,142,679 ops/sec +/- 4.47% (44 runs sampled)

moizeMultiObject x 9,706,792 ops/sec +/- 3.33% (52 runs sampled)
```

# Usage


npm install iMemoized

Memoization supports N arguments to the functions memoized. Arguments can be primitives or objects, so long as the objects have unique keys and the memoizer is called with the name of the key property.

To memoize a standalone function call: `func = iMemoized.memoize(func)`.

The call signatue for iMemoize.memoize is: `iMemoized.memoize(function)`

The optional `config` argument is an object with the properties:

```
{
	statistics: true | false // flag to collect statistics, currently just a hit count .hits property on the memoized function
}
```

CAUTION: Supporting the memoization of function calls that have objects in their argument lists can cause unexpected results. The memoizer has no way to know what, if any, properties are used as part of the function logic. If the function logic uses property values that may change between function calls and those values impact the return value, then memoization should not be used.

To memoize a class or object use iMemozied. The call signature for iMemoized is: `iMemoized(constructorOrObject[,config])`

The optional `config` argument is an object with the properties:

```
{
	excludeProperties: [], // array of properties to exclude from memoization
	includeClassMethods: true | false, // flag to memoize class methods in addition to prototype methods
	statistics: true | false // flag to collect statistics, currently just a hit count .hits property on the memoized function
}
```


To memoize all methods on all instances created by a constructor call: `constructor = iMemoize(constructor)`. Note,
this call does not memoize the constructor itself, which would result in the same object being returned for calls with the same
arguments ... something users probably would not want. Rather, it memoizes the methods on instances created. Additionally,
this function uses Proxy when called with a constructor, which is not supported in older versions of some browsers. However, iMemoize.memoize can still be used to memoize object instances. You just need to call it directly as below.

To memoize all methods on an object call: `object = iMemoized(object)`.

An optional argument can be supplied to ignore certain methods by name, e.g.: `constructor = iMemoized(constructor,["someFactory"])`. Factory functions, i.e. those that return new objects, should generally not be memoized because they will then always return the same new object ... which won't be so new after a while!

Additionally, the class methods are usually ignored, but they can be memoized by passing `includeClassMethods` as true.


The memozied methods or functions also have their own method, `flush`, which can be used to clear the memo cache, e.g.: `func.flush()`

# Successful Compatibility Tests


| OS                 | Browser / Device |
|--------------------|------------------|
| OS X Mavericks     | Safari 7.1       |
| Windows 7          | IE 10.0          |
| OS X Yosemite      | Safari 8.0       |
| OS X Mountain Lion | Safari 6.2       |
| Windows XP         | Firefox 46.0     |
| Windows 10         | Chrome 51.0      |
| Windows 7          | IE 9.0           |
| Windows 8.1        | Opera 38.0       |
| Windows 7          | Firefox 47.0     |
| Windows 10         | Chrome 50.0      |
| Windows 7          | IE 11.0          |
| Windows 10			| Edge             |


# Internals

Why is iMemoized so fast? It uses a different approach to memoization than most libraries, it does not convert arguments to strings directly. Instead, iMemoized leverages the thousands of hours that have gone into optimizing object access in JavaScript engines. See [Indexing With JavaScript Objects, Millions Of Ops/Second](http://anywhichway.github.io/indexing.html).

# Release History

2016-12-17 v1.1.1 - Removed `keyProperty` option so that default behavior is more predictable by novice users.

2016-12-16 v1.0.3 - Documentation updates.

2016-12-12 v1.0.2 - Documented source. Fixed a bug found in code walkthrough than would only manifest if an argument in the same position from multiple calls was a different primitive type.

2016-12-12 v1.0.1 - Updated benchmark to incluse moize multi-object Fibonacci.

2016-12-12 v1.0.0 - Updated benchmark to incluse moize and multi parameter Fibonacci.

2016-07-18 v0.0.10 - Updated keywords in package.json.

2016-07-17 v0.0.9 - Change arguments to take a config object, but maintained backward compatibility. Added statistics documentation. Minor performance enhancements.

2016-07-15 v0.0.8 - Updated benchamrks for newer lodash.

2016-07-12 v0.0.7 - Added hit count and initialization statistics. Not yet documented.

2016-07-06 v0.0.6 - Added support for Safari by downgrading code style but not functionality.

2016-07-06 v0.0.5 - Updated README to note lack of support for Safari for memoize enabling constructors.

2016-07-05 v0.0.4 - Updated README

2016-07-02 v0.0.3 - Added support for memoizing function that take objects as arguments. Added unit tests.

2016-07-01 v0.0.2 - Improved documentation, updated benchmark (even faster), added code to ensure functions taking anything other than primitve arguments don't get memoized. Will fix this in release 0.0.3 or 0.0.4.

2016-07-01 v0.0.1 - First release. More testing in warranted.

# License

MIT



