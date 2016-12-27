(function() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-45402411-4', 'auto');
  ga('send', 'pageview');
  
	var imports = ["https://cdnjs.cloudflare.com/ajax/libs/memoizejs/0.1.1/memoize.min.js","fast-memoize.js","moize.js","aomemoize.js","iMemoized.js"];

	var fibonacci = function(n) {
		return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
	}

	var fibonacciMultiplePrimitive = (number, isComplete) => {
		if (isComplete) {
			return number;
		}

		const firstValue = number - 1;
		const secondValue = number - 2;

		return fibonacciMultiplePrimitive(firstValue, firstValue < 2) + fibonacciMultiplePrimitive(secondValue, secondValue < 2);
	};

	var fibonacciMultipleObject = (number, check) => {
		if (check.isComplete) {
			return number;
		}

		const firstValue = number - 1;
		const secondValue = number - 2;

		return fibonacciMultipleObject(firstValue, {
			isComplete: firstValue < 2
		}) + fibonacciMultipleObject(secondValue, {
			isComplete: secondValue < 2
		});
	};

	
	var num = 35;
	JSBenchmark.import(imports).then(() => {
		JSBenchmark.run({
			name: "Memoization",
			description: "Compares moize, iMemoized, lodash, fast-memoized, memoizejs, addyosmani memoization.",
			suites: {
				singleMemoizeFibonacci: {
					arguments: [num],
					expected: fibonacci(num),
					pretest: true,
					showArguments: true,
					tests: {
						vanillaFibonacci: fibonacci,
						moize: moize(fibonacci),
						iMemoized: iMemoized.memoize(fibonacci),
						lodash: _.memoize(fibonacci),
						fastMemoized: fastMemoize(fibonacci),
						memoizejs: memoize(fibonacci),
						addyosmani: aomemoize(fibonacci)
					}
				},
				multiMemoizeFibonacci: {
					arguments: [num],
					expected: fibonacci(num),
					pretest: true,
					showArguments: true,
					tests: {
						vanilla: fibonacciMultiplePrimitive,
						moize:  moize(fibonacciMultiplePrimitive),
						iMemoized: iMemoized.memoize(fibonacciMultiplePrimitive),
						memoizejs: memoize(fibonacciMultiplePrimitive),
						fastMemoize: fastMemoize(fibonacciMultiplePrimitive),
						addyosmani: aomemoize(fibonacciMultiplePrimitive)
					}
				},
				multiObjectMemoizeFibonacci: {
					arguments: [num,{isComplete:false}],
					expected: fibonacci(num),
					pretest: true,
					showArguments: true,
					tests: {
						vanilla: fibonacciMultipleObject,
						moize:  moize(fibonacciMultipleObject),
						iMemoized: iMemoized.memoize(fibonacciMultipleObject),
						fastMemoize: fastMemoize(fibonacciMultipleObject)
					}
				}
			}
		});
	});
}).call(this);