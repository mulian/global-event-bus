(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var EventObject,
    slice = [].slice;

  module.exports = EventObject = (function() {
    function EventObject() {
      this._functions = {};
    }

    EventObject.prototype.ebRemove = function(domain) {
      var obj;
      if (eb.debug) {
        console.log("ebRemove: " + domain);
      }
      if (domain instanceof Boolean) {
        obj = this;
      } else {
        obj = this._goToDomain(domain);
      }
      if (obj === false) {
        return false;
      }
      obj._removeAllSub();
      return obj;
    };

    EventObject.prototype._removeAllSub = function() {
      var key, obj, results;
      results = [];
      for (key in this) {
        obj = this[key];
        if (obj instanceof EventObject || obj instanceof Function) {
          results.push(delete this[key]);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    EventObject.prototype._goToDomain = function(domain) {
      var obj, sub, subRE;
      subRE = /([\w$]+)\.?/g;
      obj = this;
      while (sub = subRE.exec(domain)) {
        sub = sub[1];
        if (obj[sub] == null) {
          return false;
        }
        obj = obj[sub];
      }
      return obj;
    };

    EventObject.prototype.ebIf = function(obj) {
      this._ebIf = obj;
      return this;
    };

    EventObject.prototype.eb = function(arg1, arg2, arg3) {
      var domain, func, lastDomain, obj, option, ref, sortArgs, wihtoutLast;
      sortArgs = eb._defineArg(arg1, arg2, arg3);
      if (eb.debug) {
        console.log("eb:", sortArgs);
      }
      func = sortArgs.func, domain = sortArgs.domain, option = sortArgs.option;
      if (domain != null) {
        domain = eb._replaceToCamelCase(domain);
      }
      if (/^[\w$]+$/.test(domain) && (func != null)) {
        this._createFunction(domain, func, option);
      } else if (domain != null) {
        wihtoutLast = false;
        if (func != null) {
          wihtoutLast = true;
        }
        ref = this._createDomainIfNotExist(domain, wihtoutLast), obj = ref.obj, lastDomain = ref.lastDomain;
        return obj.eb(lastDomain, func, option);
      } else if (option != null) {
        this._setOption(option);
      } else {
        if (eb.debug) {
          console.log("no route!", sortArgs);
        }
      }
      return this;
    };

    EventObject.prototype._setOption = function(options) {
      var key, opt, results;
      results = [];
      for (key in options) {
        opt = options[key];
        if (key === 'thisArg') {
          results.push(this.thisArg = opt);
        } else if (key === 'onReady') {
          results.push(this.onReady = opt);
        } else if (key === 'remove') {
          results.push(this.ebRemove(opt));
        } else if (key === 'if') {
          results.push(this.ebIf(opt));
        } else if (opt instanceof Function) {
          results.push(this._createFunction(key, opt, options));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    EventObject.prototype._setFunctionToDomain = function(subDomain) {
      if (this[subDomain] == null) {
        return this[subDomain] = function() {
          var args, func, i, len, ref, ret;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          ret = [];
          ref = this._functions[subDomain];
          for (i = 0, len = ref.length; i < len; i++) {
            func = ref[i];
            ret.push(func.apply(this, args));
          }
          if (this._ebIf != null) {
            delete this._ebIf;
          }
          return ret;
        };
      }
    };

    EventObject.prototype._createFunction = function(subDomain, func, option) {
      if (eb.debug) {
        console.log("_createFunction subDomain:" + subDomain + " func:", func);
      }
      if (this._functions[subDomain] == null) {
        this._functions[subDomain] = [];
      }
      this._functions[subDomain].push(function() {
        var args, thisArg;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        thisArg = this.thisArg;
        if ((option != null ? option.thisArg : void 0) != null) {
          thisArg = option.thisArg;
        }
        if (this._ebIf == null) {
          return func.apply(thisArg, args);
        } else {
          if (this._objIsEqual(this._ebIf, thisArg)) {
            return func.apply(thisArg, args);
          }
        }
      });
      return this._setFunctionToDomain(subDomain);
    };

    EventObject.prototype._objIsEqual = function(fromObj, toObj) {
      var k, v;
      for (k in fromObj) {
        v = fromObj[k];
        if (!(v === toObj[k])) {
          return false;
        }
      }
      return true;
    };

    EventObject.prototype._createDomainIfNotExist = function(domain, withoutLast) {
      var currentObj, lastDomain, sub, subRE;
      if (withoutLast == null) {
        withoutLast = false;
      }
      if (eb.debug) {
        console.log("_createDomainIfNotExist with domain:" + domain + " and withoutLast=" + withoutLast);
      }
      subRE = /([\w$]+)\.?/g;
      if (withoutLast) {
        subRE = /([\w$]+)\./g;
        lastDomain = /\.([\w$]+)$/.exec(domain)[1];
      }
      currentObj = this;
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

    return EventObject;

  })();

}).call(this);

},{}],2:[function(require,module,exports){
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

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./event-object":1}],3:[function(require,module,exports){
var EventBus;

EventBus = require('../lib/eventbus');

new EventBus();

describe('Default Tests', function() {
  it('is eb global and an EventBus?', function() {
    return expect(eb instanceof EventBus).toBe(true);
  });
  return it('is eb.eb a Function', function() {
    return expect(eb.eb instanceof Function).toBe(true);
  });
});


},{"../lib/eventbus":2}],4:[function(require,module,exports){
(function (global){
var EventBus;

EventBus = require('../lib/eventbus');

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

},{"../lib/eventbus":2}],5:[function(require,module,exports){
require('./default_spec.coffee');

require('./define_spec.coffee');


},{"./default_spec.coffee":3,"./define_spec.coffee":4}]},{},[5])


//# sourceMappingURL=jasmine_boundle.js.map
