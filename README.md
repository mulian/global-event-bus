# geb (global-event-bus)
geb is an abnormal and great EventBus for Javascript Web/Node.

# Info
After implement, you could call it with `eb`.
You could store your events on separate domains. Every domain contains the `eb()` function.
The function only knows his own domain and his followed domains.

The `eb()` function creates-/removes- Domains, add-/remove (multiple) event definitions and add `thisArg` to the domains and/or event(s).

`eb()` will operate on and return his own current domain.

# Install
TODO: add to npm
`npm install geb`
# Examples

## Include

### Node
```javascript
  var geb = require('geb');
  new geb(); //add eb to Global and return it
  //var eb = new geb(false); //won't add eb to global, maybe for security reasons.
```
### Web
Use the Browserify `boundle.js` in folder `node_modules/geb/lib/boundle.js`
```html
  <script language='javascript' type='text/javascript' src='<path_to>/boundle.js'></script>
```
Now `eb` is globally (on window) available.

## eb()

### Function definition
* parameter {Object}: adds Option to Domain and functions
* parameter {String}: define the Domain
* parameter {Function}: adds function to Domain.methode
* return {Object}: current Domain

Without domain (String): add to current domain

Without function: add domain and/or option

Only Object: adds option to current domain

You could add more then one function to damain.
* The `thisArg` option on create a function will be used on call, not the domain `thisArg`.
* The domain `thisArg` will only be used, if there is no `thisArg` on function create.

### Function examples
```javascript
  // eb.debug=true;

  // define an Object
  var o = {
    f: function(arg) {
      console.log("hello "+arg);
    }
  }

  //set testCaseEB to subdomain and add function test with thisArg to subdomain
  var testCaseEB = eb.eb('testCase.firstCase'); //reg. domain
  testCaseEB.eb('test',o.f);
  testCaseEB.thisArg = o;

  //OR same in one Statement:
  var testCaseEB = eb.eb('testCase.firstCase.test',o.f,{thisArg:o});

  //call it with:
  testCaseEB.test()

  //OR globally
  eb.testCase.firstCase.test()

  //Add option permanent to domain testCase und above
  eb.testCase.firstCase.eb({thisArg:obj}).test('bla')

  //Removes all sub function from domain
  eb.eb({remove:true});

  //Remove testCase Domain
  eb.eb({remove:'testCase'});
```

### IF
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

  // will only log 'Hello from obj1', the if object checks the thisArg object
  eb.eb({if:{id:1}}).test()
```
