# eventbus
Awesome eventbus for Javascript Web/Node.

# Install
TODO: add to npm
`npm install eb`
## Examples
```javascript
Eventbus = require('eventbus');

var f = function() {
  console.log("hello");
}

eb('on')('Test.sayHallo',f);
//...
eb().Test.sayHello() //prints: hello
```
