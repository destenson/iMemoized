# iMemoized
A super-fast memoizer that does single functions or classes or objects.

Below are the benchmark results for computing Fibonnanci value for 35 using a recursive function:

```
var fibonacci = function(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
```

```
un-memoized x 7.47 ops/sec ±5.46% (23 runs sampled)
test/index.html:44 iMemoize.memoize x 16,136,312 ops/sec ±6.80% (50 runs sampled)
test/index.html:44 lodash _.memoize x 9,196,531 ops/sec ±3.11% (54 runs sampled)
test/index.html:44 fast-memoize x 8,275,435 ops/sec ±1.07% (59 runs sampled)
test/index.html:46 Fastest is iMemoize.memoize
```

# Usage


npm install iMemoized

To memoize all methods on all instances created by a constructor call: `constructor = iMemoize(constructor)`.

To memoize all methods on an object call: `object = iMemoize(object)`.

To memoize a standalone function call: `func = iMemoize.memoize(func)`.

An optional argument can be supplied to ignore certain methods by name, e.g.: `constructor = iMemoize(constructor,["someFactory"])`. Factory functions, i.e. those that return new objects, should generally not be memoized because they will then always return the same new object ... which won't be so new after a while!

The memozied methods or functions also have their own method, `flush`, which can be used to clear the memo cache, e.g.: `func.flush()`

# Release History

v0.0.1 - First release. More testing in warranted.

# License

MIT



