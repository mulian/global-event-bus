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
  // * parameter {Object}: adds Option to Domain
  // * parameter {String}: define the Domain
  // * parameter {Function}: adds function to Domain.methode
  //
  // without String: adds to current domain
  // without function: adds only the domain
  // Only Object: adds option to current domain
  // return: {Object} : current Domain
  eb.add('testCase.firstCase.test',f,{thisArg:blubb});

  testCaseEB.add('test',f); // -> ev.testCase.firstCase.test()
  //OR
  testCaseEB.add({ // -> ev.testCase.firstCase.test()
    thisArg: blubb,
    onReady: true,
    test: f
  });

  eb.testCase.test('bla')

  //Use options once 2. parameter: only once
  eb.testCase.add({thisArg:obj,once:true}).test('bla')

  //Add option permanent to domain testCase und above
  eb.testCase.add({thisArg:obj}).test('bla')
  //Adds option permanent to domain testCase.firstCase (before there was prev addOption)
  eb.testCase.firstCase.add({thisArg:obj}).test('bla')
```
