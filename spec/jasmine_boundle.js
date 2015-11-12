(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function() {
  var EventBus, EventObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  EventObject = require('./event-object');

  module.exports = EventBus = (function(superClass) {
    extend(EventBus, superClass);

    function EventBus(toGlobal) {
      if (toGlobal == null) {
        toGlobal = true;
      }
      EventBus.__super__.constructor.apply(this, arguments);
      if (toGlobal) {
        this._toGlobal();
      }
    }

    EventBus.prototype._toGlobal = function() {
      if (global.eb == null) {
        return global.eb = this;
      }
    };

    EventBus.prototype._isInstance = function(arg) {
      if (arg == null) {
        return 'undefined';
      } else if (arg instanceof Function) {
        return 'function';
      } else if (arg instanceof Object) {
        return 'object';
      } else {
        return 'string';
      }
    };

    EventBus.prototype._defineArg = function() {
      var arg, args, i, len, obj;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      obj = {};
      for (i = 0, len = args.length; i < len; i++) {
        arg = args[i];
        switch (this._isInstance(arg)) {
          case 'function':
            obj.func = arg;
            break;
          case 'string':
            obj.domain = arg;
            break;
          case 'object':
            obj.option = arg;
        }
      }
      return obj;
    };

    EventBus.prototype._replaceToCamelCase = function(channel) {
      channel = channel.replace(/-\w/g, function(match, pos) {
        return match.charAt(1).toUpperCase();
      });
      channel = channel.replace(/:/g, '.');
      return channel;
    };

    return EventBus;

  })(EventObject);

  if (typeof window !== "undefined" && window !== null) {
    new EventBus();
  }

}).call(this);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./event-object":3}],2:[function(require,module,exports){
(function() {
  var slice = [].slice;

  module.exports = {
    remove: {
      ebRemove: function(domain) {
        var obj;
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("ebRemove: " + domain);
        }
        if (domain instanceof Boolean) {
          obj = this.eo;
        } else {
          obj = this.goToDomain(domain);
        }
        if (obj === false) {
          return false;
        }
        obj.___.removeAllSub();
        return obj;
      },
      removeAllSub: function() {
        var key, obj, ref, results;
        ref = this.eo;
        results = [];
        for (key in ref) {
          obj = ref[key];
          if (obj.eb instanceof Function || obj instanceof Function) {
            results.push(delete this.eo[key]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    },
    instance: {
      createInstance: function(instance) {
        var fName, i, j, l, len, len1, obj, ref, results;
        console.log("createInstance with ", instance);
        if (instance instanceof Array) {
          for (j = 0, len = instance.length; j < len; j++) {
            i = instance[j];
            this.createInstance(i);
          }
        }
        if (instance.domain != null) {
          obj = this.createDomainIfNotExist(instance.domain);
          delete instance.domain;
          return obj.obj.createInstance(instance);
        }
        ref = instance.watch;
        results = [];
        for (l = 0, len1 = ref.length; l < len1; l++) {
          fName = ref[l];
          results.push(this.eo[fName] = this.tmpFunction(fName, instance));
        }
        return results;
      },
      tmpFunction: function(fName, instance) {
        console.log("tmpFunction with ", fName, instance);
        return function() {
          var args, ins, j, len, ref;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          this.___.removeAllSub();
          ins = instance.create();
          console.info("watch: ", instance.watch);
          ref = instance.watch;
          for (j = 0, len = ref.length; j < len; j++) {
            fName = ref[j];
            console.info("function " + fName);
            this.___.createFunction(fName, ins[fName], {
              thisArg: ins
            });
          }
          return this[fName].apply(null, args);
        };
      }
    },
    addFunctions: {
      setFunctionToDomain: function(subDomain) {
        if (this.eo[subDomain] == null) {
          return this.eo[subDomain] = function() {
            var args, func, j, len, ref, ret;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            ret = [];
            ref = this.___.functions[subDomain];
            for (j = 0, len = ref.length; j < len; j++) {
              func = ref[j];
              ret.push(func.apply(this, args));
            }
            if (this.___._ebIf != null) {
              delete this.___._ebIf;
            }
            return ret;
          };
        }
      },
      createFunction: function(subDomain, func, option) {
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("createFunction subDomain:" + subDomain + " func:", func);
        }
        if (this.functions[subDomain] == null) {
          this.functions[subDomain] = [];
        }
        this.functions[subDomain].push(function() {
          var args, thisArg;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          thisArg = this.thisArg;
          if ((option != null ? option.thisArg : void 0) != null) {
            thisArg = option.thisArg;
          }
          if (this.___._ebIf == null) {
            return func.apply(thisArg, args);
          } else {
            if (this.___.objIsEqual(this.___._ebIf, thisArg)) {
              return func.apply(thisArg, args);
            }
          }
        });
        return this.setFunctionToDomain(subDomain);
      },
      objIsEqual: function(fromObj, toObj) {
        var k, v;
        if ((fromObj == null) || (toObj == null)) {
          return false;
        }
        for (k in fromObj) {
          v = fromObj[k];
          if (!(v === toObj[k])) {
            return false;
          }
        }
        return true;
      }
    },
    option: {
      setOption: function(options) {
        var key, opt, results;
        results = [];
        for (key in options) {
          opt = options[key];
          if (key === 'thisArg' && opt instanceof Object) {
            results.push(this.eo.thisArg = opt);
          } else if (key === 'onReady' && opt instanceof Boolean) {
            results.push(this.onReady = opt);
          } else if (key === 'remove' && (typeof opt === 'string' || opt instanceof String)) {
            results.push(this.ebRemove(opt));
          } else if (key === 'if' && opt instanceof Object) {
            results.push(this.ebIf(opt));
          } else if (opt instanceof Function) {
            results.push(this.createFunction(key, opt, options));
          } else if (key === 'instance' && (opt instanceof Object || opt instanceof Array)) {
            results.push(this.createInstance(opt));
          } else {
            if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
              results.push(console.log("what do to with option[" + key + "]=", opt));
            } else {
              results.push(void 0);
            }
          }
        }
        return results;
      }
    }
  };

}).call(this);



},{}],3:[function(require,module,exports){
(function() {
  var EventObject, EventObjectHiddenFunctions, Mixin, addFunctions, instance, option, ref, remove,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('./event-object-functions'), remove = ref.remove, instance = ref.instance, addFunctions = ref.addFunctions, option = ref.option;

  Mixin = (function() {
    function Mixin() {}

    Mixin.mixin = function(array) {
      var i, key, len, obj, ref1, results, value;
      results = [];
      for (i = 0, len = array.length; i < len; i++) {
        obj = array[i];
        for (key in obj) {
          value = obj[key];
          this.prototype[key] = value;
        }
        if ((ref1 = obj.included) != null) {
          ref1.apply(this);
        }
        results.push(this);
      }
      return results;
    };

    return Mixin;

  })();

  EventObjectHiddenFunctions = (function(superClass) {
    extend(EventObjectHiddenFunctions, superClass);

    EventObjectHiddenFunctions.mixin([remove, instance, addFunctions, option]);

    function EventObjectHiddenFunctions(eo) {
      this.eo = eo;
      this.functions = {};
    }

    EventObjectHiddenFunctions.prototype.ebIf = function(obj) {
      this._ebIf = obj;
      return this.eo;
    };

    EventObjectHiddenFunctions.prototype.goToDomain = function(domain) {
      var obj, sub, subRE;
      subRE = /([\w$]+)\.?/g;
      obj = this.eo;
      while (sub = subRE.exec(domain)) {
        sub = sub[1];
        if (obj[sub] == null) {
          return false;
        }
        obj = obj[sub];
      }
      return obj;
    };

    EventObjectHiddenFunctions.prototype.createDomainIfNotExist = function(domain, withoutLast) {
      var currentObj, lastDomain, sub, subRE;
      if (withoutLast == null) {
        withoutLast = false;
      }
      if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
        console.log("createDomainIfNotExist with domain:" + domain + " and withoutLast=" + withoutLast);
      }
      currentObj = this.eo;
      subRE = /([\w$]+)\.?/g;
      if (withoutLast) {
        subRE = /([\w$]+)\./g;
        lastDomain = /\.([\w$]+)$/.exec(domain)[1];
      }
      while (sub = subRE.exec(domain)) {
        sub = sub[1];
        if (currentObj[sub] == null) {
          currentObj[sub] = new EventObject();
        }
        currentObj = currentObj[sub];
      }
      return {
        obj: currentObj,
        lastDomain: withoutLast ? lastDomain : void 0
      };
    };

    return EventObjectHiddenFunctions;

  })(Mixin);

  module.exports = EventObject = (function() {
    function EventObject() {
      this.___ = new EventObjectHiddenFunctions(this);
    }

    EventObject.prototype.eb = function(arg1, arg2, arg3) {
      var domain, func, lastDomain, obj, ref1, sortArgs, wihtoutLast;
      sortArgs = eb._defineArg(arg1, arg2, arg3);
      if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
        console.log("eb:", sortArgs);
      }
      func = sortArgs.func, domain = sortArgs.domain, option = sortArgs.option;
      if (domain != null) {
        domain = eb._replaceToCamelCase(domain);
      }
      if (/^[\w$]+$/.test(domain) && (func != null)) {
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("eb#1");
        }
        this.___.createFunction(domain, func, option);
      } else if (domain != null) {
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("eb#2");
        }
        wihtoutLast = false;
        if (func != null) {
          wihtoutLast = true;
        }
        ref1 = this.___.createDomainIfNotExist(domain, wihtoutLast), obj = ref1.obj, lastDomain = ref1.lastDomain;
        return obj.eb(lastDomain, func, option);
      } else {
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("no route!", sortArgs);
        }
      }
      if (option != null) {
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("eb#3");
        }
        this.___.setOption(option);
      }
      return this;
    };

    return EventObject;

  })();

}).call(this);



},{"./event-object-functions":2}],4:[function(require,module,exports){
var EventBus;

EventBus = require('../lib/event-bus');

new EventBus();

describe('Default Tests', function() {
  it('is eb global and an EventBus?', function() {
    return expect(eb instanceof EventBus).toBe(true);
  });
  return it('is eb.eb a Function', function() {
    return expect(eb.eb instanceof Function).toBe(true);
  });
});


},{"../lib/event-bus":1}],5:[function(require,module,exports){
(function (global){
var EventBus;

EventBus = require('../lib/event-bus');

describe('Will define', function() {
  beforeEach(function() {
    return global.eb = new EventBus();
  });
  it('simple createDomain', function() {
    eb.eb('test1.test2.test3');
    return expect(eb.test1.test2.test3).not.toBe(void 0);
  });
  it('simple add', function() {
    var foo;
    foo = {
      test: function(value) {
        return 'works';
      }
    };
    spyOn(foo, 'test');
    eb.eb('test', foo.test);
    eb.test();
    expect(foo.test).toHaveBeenCalled();
    return expect(eb.test instanceof Function).toBe(true);
  });
  it('add with thisArg on call', function() {
    var obj;
    obj = {
      attribute: 'test',
      call: function() {
        return this.attribute = 'yes';
      }
    };
    eb.eb({
      thisArg: obj
    }, 'test1.test1', obj.call);
    eb.eb('test2.test2', obj.call);
    eb.test2.test2();
    expect(obj.attribute).toBe('test');
    eb.test1.test1();
    return expect(obj.attribute).toBe('yes');
  });
  it('add many domains only one execute', function() {
    var obj;
    obj = {
      attribute: 'test',
      call: function() {
        return this.attribute = 'yes';
      }
    };
    eb.eb({
      thisArg: obj
    }, 'test1.test1', obj.call);
    eb.eb('test2.test2', obj.call);
    eb.eb('test3.test', obj.call);
    eb.eb('test4.test', obj.call);
    eb.eb('test5.test', obj.call);
    eb.eb('test6.test', obj.call);
    eb.eb('test7.test', obj.call);
    eb.eb('test', {
      thisArg: obj,
      f1: obj.call,
      f2: obj.call,
      f3: obj.call,
      f4: obj.call,
      f5: obj.call
    });
    eb.test2.test2();
    expect(obj.attribute).toBe('test');
    eb.test1.test1();
    expect(obj.attribute).toBe('yes');
    expect(eb.test7.test().length).toBe(1);
    return expect(eb.test.f3().length).toBe(1);
  });
  it('rm domain', function() {
    var obj;
    obj = {
      func: function() {
        return 'hello';
      }
    };
    eb.eb('test.test.test', obj.func);
    expect(eb.test.test.test !== void 0).toBe(true);
    expect(eb.eb({
      remove: 'test.test'
    })).not.toBe(false);
    return expect(eb.test.test.test === void 0).toBe(true);
  });
  it('require EventBus again', function() {
    var obj;
    obj = {
      func: function() {
        return 'hello';
      }
    };
    spyOn(obj, 'func');
    eb.eb('test.test1', obj.func);
    new EventBus;
    eb.test.test1();
    return expect(obj.func).toHaveBeenCalled();
  });
  it('func within option', function() {
    var obj;
    obj = {
      attr: 'yes!',
      call1: function() {
        return 'yes';
      },
      call2: function() {
        return this.attr;
      }
    };
    spyOn(obj, 'call1');
    spyOn(obj, 'call2');
    eb.eb('testContainer', {
      thisArg: obj,
      call1: obj.call1,
      call2: obj.call2
    });
    eb.testContainer.call1();
    eb.testContainer.call2();
    expect(obj.call1).toHaveBeenCalled();
    return expect(obj.call2).toHaveBeenCalled();
  });
  return it('try eb -> If', function() {
    var obj1, obj2;
    obj1 = {
      id: 1,
      call: function() {
        return console.log('Hello from obj1');
      }
    };
    obj2 = {
      id: 2,
      call: function() {
        return console.log('Hello from obj2');
      }
    };
    spyOn(obj1, 'call');
    spyOn(obj2, 'call');
    eb.eb('test.test', obj1.call, {
      thisArg: obj1
    });
    eb.eb('test.test', obj2.call, {
      thisArg: obj2
    });
    eb.test.eb({
      "if": {
        id: 1
      }
    }).test();
    expect(obj1.call).toHaveBeenCalled();
    return expect(obj2.call).not.toHaveBeenCalled();
  });
});

describe('ThisArg Test', function() {
  beforeEach(function() {
    return global.eb = new EventBus;
  });
  it('with thisArg on define', function() {
    var obj;
    obj = {
      attribute: 'test',
      call: function() {
        return this.attribute = 'yes';
      }
    };
    eb.eb({
      thisArg: obj
    }, 'test1.test1', obj.call);
    eb.eb('test2.test2', obj.call);
    eb.test2.test2();
    expect(obj.attribute).toBe('test');
    eb.test1.test1();
    return expect(obj.attribute).toBe('yes');
  });
  return it('with thisArg on call', function() {
    var obj;
    obj = {
      attribute: 'test',
      call: function() {
        return this.attribute = 'yes';
      }
    };
    eb.eb('test1.test1', obj.call);
    eb.eb('test2.test2', obj.call);
    eb.test2.test2();
    expect(obj.attribute).toBe('test');
    eb.test1.eb({
      thisArg: obj
    }).test1();
    return expect(obj.attribute).toBe('yes');
  });
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../lib/event-bus":1}],6:[function(require,module,exports){
(function (global){
var EventBus;

EventBus = require('../lib/event-bus');

describe('Instance Test', function() {
  beforeEach(function() {
    return global.eb = new EventBus;
  });
  it('standart instance', function() {
    var TestObject, instance;
    TestObject = require('./test-object.coffee');
    instance = new TestObject('hello');
    eb.eb('test', {
      thisArg: instance,
      call: instance.call,
      setInfo: instance.setInfo
    });
    expect(eb.test.call instanceof Function).toBe(true);
    return expect(eb.test.call('world')).toContain('hello world');
  });
  return it('instance on call', function() {
    eb.eb({
      instance: {
        domain: 'test',
        watch: ['call', 'setInfo'],
        create: function() {
          var TestObject;
          TestObject = require('./test-object.coffee');
          return new TestObject('hello');
        }
      }
    });
    expect(eb.test.call instanceof Function).toBe(true);
    return expect(eb.test.call('world')).toContain('hello world');
  });
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../lib/event-bus":1,"./test-object.coffee":8}],7:[function(require,module,exports){
require('./default_spec.coffee');

require('./define_spec.coffee');

require('./instance_spec.coffee');


},{"./default_spec.coffee":4,"./define_spec.coffee":5,"./instance_spec.coffee":6}],8:[function(require,module,exports){
var TestObject;

module.exports = TestObject = (function() {
  function TestObject(info) {
    this.info = info;
  }

  TestObject.prototype.call = function(arg) {
    return this.info + " " + arg;
  };

  TestObject.prototype.setInfo = function(info) {
    this.info = info;
  };

  return TestObject;

})();


},{}]},{},[7])


//# sourceMappingURL=jasmine_boundle.js.map
