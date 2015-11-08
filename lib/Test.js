(function() {
  var Eventbus, Test;

  Eventbus = require('./eventbus');

  Test = (function() {
    function Test() {
      var e, error, error1;
      this.reqEventBus();
      this.test();
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
      eb.ebRemove('Test.xy');
    }

    Test.prototype.reqEventBus = function() {
      eb.debug = true;
      this.rm1 = eb.ebAdd('Test.xy.z.a.test');
      this.rm1 = eb.ebAdd('Test.xy.z.a.sayHello', this.sayHallo);
      console.log("define Object functions");
      this.rm2 = eb.ebAdd('Test.xy.z.b', {
        thisArg: this,
        'sayTest1': this.sayTest1,
        'sayTest2': this.sayTest2
      });
      this.rm3 = eb.ebAdd({
        thisArg: this
      }, 'Test.html.sayHello', this.sayHallo);
      this.rm4 = eb.ebAdd({
        thisArg: this
      }, 'test-case:html-sayHello:asd', this.sayHallo);
      eb.ebAdd('damn', this.test);
      eb.ebAdd('damn', this.sayHallo);
      console.log("----");
      eb.damn();
      console.log("----");
      return console.log(eb);
    };

    Test.prototype.o = {
      thisArg: Test,
      onReady: true,
      once: true
    };

    Test.prototype.test = function() {
      return eb.Test.xy.z.a.ebAdd(this.o).sayHello('-test-');
    };

    Test.prototype.test2 = function() {
      eb.Test.xy.z.b.ebAdd({
        thisArg: this
      }).sayTest1();
      return eb.Test.xy.z.b.sayTest2('LÄUFT');
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
