(function() {
  var Eventbus, Test;

  Eventbus = require('./event-bus');

  new Eventbus();

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
      eb.eb({
        remove: 'Test.xy'
      });
    }

    Test.prototype.reqEventBus = function() {
      eb.debug = true;
      this.rm1 = eb.eb('Test.xy.z.a.test');
      this.rm1 = eb.eb('Test.xy.z.a.sayHello', this.sayHallo);
      console.log("define Object functions");
      this.rm2 = eb.eb('Test.xy.z.b', {
        thisArg: this,
        'sayTest1': this.sayTest1,
        'sayTest2': this.sayTest2
      });
      this.rm3 = eb.eb({
        thisArg: this
      }, 'Test.html.sayHello', this.sayHallo);
      this.rm4 = eb.eb({
        thisArg: this
      }, 'test-case:html-sayHello:asd', this.sayHallo);
      eb.eb('damn', this.test);
      eb.eb('damn', this.sayHallo);
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
      return eb.Test.xy.z.a.eb(this.o).sayHello('-test-');
    };

    Test.prototype.test2 = function() {
      eb.Test.xy.z.b.eb({
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

//# sourceMappingURL=test.js.map
