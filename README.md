# geb (global-event-bus)
geb is an abnormal and great EventBus for Javascript Web/Node.

# Features
* Instantiate Object on call for better start-up-time
* Better overview

# Short simple introduction
* Definition
```javascript
var f = function(arg) {console.log("hello "+arg);};
eb.eb('testCase.firstCase.test',f);
```
* Run from everywhere
```javascript
eb.testCase.firstCase.test('there');
// will print: 'hello there'
```

# Install
`npm install geb --save`

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

# Examples

## eb()

### Info
After implement, you could call it with `eb`.
You could store your events on separate domains. Every domain contains the `eb()` function.
The function only knows his own domain and his followed domains.

The `eb()` function creates-/removes- Domains, add-/remove (multiple) event definitions and add `thisArg` to the domains and/or event(s).

`eb()` will operate on and return his own current domain.

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

### Instantiate Object on call
Instantiate Objects only when you need them. For better startup-time.

`test-object.coffee`
```coffeescript
module.exports =
class Test
  constructor: (@info) ->
  call: (arg) ->
    console.log "#{@geb} #{@info} #{arg}"
  setInfo: (@info) ->
```
`example1.js` normal (lazy startup-time)
```javascript
var TestObject = require('./test-object')
var instance = new TestObject('hello')
eb.eb('test',{
  thisArg: instance,
  call: instance.call,
  setInfo: instance.setInfo
});
eb.test.call('world'); //print: hello world
```
`example1.js` **instance on call** (better startup-time)
```javascript
eb.eb('test',{
  instance: {
    watch: ['call','setInfo'],
    create: function() {
      var TestObject = require('./test-object');
      return new TestObject('hello');
    }
  }
});
eb.test.call('world'); //print: hello world
// will instantiate Test (with readFile...) after call
// and execute call
```
