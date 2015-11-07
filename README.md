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
eb('on')('test-case.say-hello2',f);
//...
eb().Test.sayHello('there') //prints: hello there
// OR use
eb.emit.TestCase.sayHello2('there') //prints: hello there
```
