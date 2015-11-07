(function() {
  var Eventbus, Test;

  Eventbus = require('./eventbus');

  Test = (function() {
    function Test() {
      var e, error, error1;
      this.reqEventBus();
      this.test();
      this.rm1();
      try {
        this.test();
      } catch (error) {
        e = error;
        console.log("jo test() geht nicht mehr");
      }
      this.test2();
      try {
        this.test2();
      } catch (error1) {
        e = error1;
        console.log("jo test2() geht nicht mehr");
      }
      console.log("RM:");
      eb('rm')('Test.xy');
    }

    Test.prototype.reqEventBus = function() {
      eb('debug', true);
      this.rm1 = eb('on', {
        thisArg: this
      })('Test.xy.z.a.sayHello', this.sayHallo);
      this.rm2 = eb('on', {
        thisArg: this
      })('Test.xy.z', {
        'sayTest1': this.sayTest1,
        'sayTest2': this.sayTest2
      });
      this.rm3 = eb('on', {
        thisArg: this
      })('Test.html.sayHello', this.sayHallo);
      return this.rm4 = eb('on', {
        thisArg: this
      })('test-case:html-sayHello:asd', this.sayHallo);
    };

    Test.prototype.o = {
      thisArg: Test,
      onReady: true
    };

    Test.prototype.test = function() {
      return eb(this.o).Test.xy.z.a.sayHello('-test-');
    };

    Test.prototype.test2 = function() {
      eb({
        thisArg: this
      }).Test.xy.z.sayTest1();
      return eb().Test.xy.z.sayTest2('LÄUFT');
    };

    Test.prototype.sayHallo = function(arg) {
      return console.log("Hallo " + arg);
    };

    Test.prototype.sayTest1 = function() {
      return console.log("test1");
    };

    Test.prototype.sayTest2 = function(arg) {
      return console.log("test2 " + arg);
    };

    return Test;

  })();

  new Test();

}).call(this);
