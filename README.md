# eventbus
Awesome eventbus for Javascript Web/Node.

# Install
TODO: add to npm
`npm install e-bus`
## Examples
```javascript
require('e-bus');

var f = function(arg) {
  console.log("hello "+arg);
}

eb('on')('TestCase.sayHello',f); //camel case
eb('on')('test-case:say-hello2',f);
//...
eb().Test.sayHello('there') //prints: hello there
// OR use
eb.emit.TestCase.sayHello2('there') //prints: hello there
```

```javascript
  eb.debug=true;
  var testCaseEB = eb.add('testCase.firstCase'); //reg. domain
  eb.testCase.add('test',f);
  eb.testCase.thisArg = blubb;
  //OR
  eb.add('testCase.firstCase.test',f,{thisArg:blubb});

  testCaseEB.add('test',f); // -> ev.testCase.firstCase.test()
  //OR
  testCaseEB.add({ // -> ev.testCase.firstCase.test()
    thisArg: blubb,
    onReady: true,
    test: f
  });

  eb.testCase.test('bla')
```
