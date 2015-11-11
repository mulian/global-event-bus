# ebs
ebs (event-bus-system) is an abnormal great EventBus for Javascript Web/Node.

# Info
After implement, you could call it with `eb`.
You could store your events on separate domains. Every domain contains the `eb()` function.
The function only knows his own domain and his followed domains.

The `eb()` function creates-/removes- Domains, add-/remove (multiple) event definitions and add `thisArg` to the domains and/or event(s).

`eb()` will operate on and return his own current domain.

# Install
TODO: add to npm
`npm install ebs`
# Examples
## Include
### Node
```javascript
  var ebs = require('ebs');
  new ebs(); //add eb to Global
  //var eb = new ebs(false); //won't add eb to global, maybe for security reasons.
```
### Web


```javascript
  var f = function(arg) {
    console.log("hello "+arg);
  }
  eb.debug=true;
  var testCaseEB = eb.eb('testCase.firstCase'); //reg. domain
  eb.testCase.eb('test',f);
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
  eb.eb('testCase.firstCase.test',f,{thisArg:blubb});

  testCaseEB.eb('test',f); // -> ev.testCase.firstCase.test()
  //OR
  testCaseEB.eb({ // -> ev.testCase.firstCase.test()
    thisArg: blubb,
    onReady: true,
    test: f
  });

  eb.testCase.test('bla')

  //Use options once 2. parameter: only once
  eb.testCase.eb({thisArg:obj,once:true}).test('bla')

  //Add option permanent to domain testCase und above
  eb.testCase.eb({thisArg:obj}).test('bla')
  //Adds option permanent to domain testCase.firstCase (before there was prev addOption)
  eb.testCase.firstCase.eb({thisArg:obj}).test('bla')

  //Removes all sub function from domain
  eb.eb({remove:true});

  //Remove testCase Domain
  eb.eb({remove:'testCase'});
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

  eb.eb('test',obj1.call,{thisArg:obj1});
  eb.eb('test',obj2.call,{thisArg:obj2});

  eb.eb({if:{id:1}}).test() // will only log 'Hello from obj1', the if object checks the thisArg object
```

# Note
You could add,remove events or domains and set options in only one eb function call. But I recommend you to write only same elementary steps in one eb function calls.
