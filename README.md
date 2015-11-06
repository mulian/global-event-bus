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

eb('on')('Test.sayHallo',f);
//...
eb().Test.sayHello('there') //prints: hello there
// OR use
eb.emit.Test.sayHello('there') //prints: hello there
```
