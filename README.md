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
  eb.debug=true;
  var testCaseEB = eb.ebAdd('testCase.firstCase'); //reg. domain
  eb.testCase.ebAdd('test',f);
  eb.testCase.thisArg = blubb;
  //OR

  // * parameter {Object}: adds Option to Domain and functions
  // * parameter {String}: define the Domain
  // * parameter {Function}: adds function to Domain.methode
  //
  // without String: adds to current domain
  // without function: adds only the domain
  // Only Object: adds option to current domain
  // return: {Object} : current Domain
  eb.ebAdd('testCase.firstCase.test',f,{thisArg:blubb});

  testCaseEB.ebAdd('test',f); // -> ev.testCase.firstCase.test()
  //OR
  testCaseEB.ebAdd({ // -> ev.testCase.firstCase.test()
    thisArg: blubb,
    onReady: true,
    test: f
  });

  eb.testCase.test('bla')

  //Use options once 2. parameter: only once
  eb.testCase.ebAdd({thisArg:obj,once:true}).test('bla')

  //Add option permanent to domain testCase und above
  eb.testCase.ebAdd({thisArg:obj}).test('bla')
  //Adds option permanent to domain testCase.firstCase (before there was prev addOption)
  eb.testCase.firstCase.ebAdd({thisArg:obj}).test('bla')

  //Remove testCase Domain
  eb.testCase.ebRemove();

  //Remove testCase Domain
  eb.ebRemove('testCase');
```

## EB IF
```javascript
  var obj1 = {
    id: 1,
    call: function() {
      console.log("Hello from obj1");
    }
  }
  var obj2 = {
    id: 2,
    call: function() {
      console.log("Hello from obj2");
    }
  }

  eb.ebAdd('test',obj1.call,{thisArg:obj1});
  eb.ebAdd('test',obj2.call,{thisArg:obj2});

  eb.ebIf({id:1}).test() // will only log 'Hello from obj1', based on thisArg
```
