(function() {
  var EventObject, HiddenFunctions,
    slice = [].slice;

  module.exports = EventObject = (function() {
    function EventObject() {
      this.___ = new HiddenFunctions(this);
    }

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
      console.log("current Obj: ", this);
      if (/^[\w$]+$/.test(domain) && (func != null)) {
        if (eb.debug) {
          console.log("eb#1");
        }
        this.___.createFunction(domain, func, option);
      } else if (domain != null) {
        if (eb.debug) {
          console.log("eb#2");
        }
        wihtoutLast = false;
        if (func != null) {
          wihtoutLast = true;
        }
        ref = this.___.createDomainIfNotExist(domain, wihtoutLast), obj = ref.obj, lastDomain = ref.lastDomain;
        console.log(obj);
        return obj.eb(lastDomain, func, option);
      } else if (option != null) {
        if (eb.debug) {
          console.log("eb#3");
        }
        this.___.setOption(option);
      } else {
        if (eb.debug) {
          console.log("no route!", sortArgs);
        }
      }
      return this;
    };

    return EventObject;

  })();

  HiddenFunctions = (function() {
    HiddenFunctions.prototype.functions = {};

    function HiddenFunctions(obj) {
      console.log("set to ", obj);
      this.obj = obj;
    }

    HiddenFunctions.prototype.ebRemove = function(domain) {
      var obj;
      if (eb.debug) {
        console.log("ebRemove: " + domain);
      }
      if (domain instanceof Boolean) {
        obj = this.obj;
      } else {
        obj = this.goToDomain(domain);
      }
      if (obj === false) {
        return false;
      }
      obj.___.removeAllSub();
      return obj;
    };

    HiddenFunctions.prototype.removeAllSub = function() {
      var key, obj, ref, results;
      ref = this.obj;
      results = [];
      for (key in ref) {
        obj = ref[key];
        if (obj instanceof EventObject || obj instanceof Function) {
          results.push(delete this.obj[key]);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HiddenFunctions.prototype.goToDomain = function(domain) {
      var obj, sub, subRE;
      subRE = /([\w$]+)\.?/g;
      obj = this.obj;
      while (sub = subRE.exec(domain)) {
        sub = sub[1];
        if (obj[sub] == null) {
          return false;
        }
        obj = obj[sub];
      }
      return obj;
    };

    HiddenFunctions.prototype.ebIf = function(obj) {
      this._ebIf = obj;
      return this.obj;
    };

    HiddenFunctions.prototype.setOption = function(options) {
      var key, opt, results;
      results = [];
      for (key in options) {
        opt = options[key];
        if (key === 'thisArg') {
          results.push(this.obj.thisArg = opt);
        } else if (key === 'onReady' && opt instanceof Boolean) {
          results.push(this.onReady = opt);
        } else if (key === 'remove' && (typeof opt === 'string' || opt instanceof String)) {
          results.push(this.ebRemove(opt));
        } else if (key === 'if' && opt instanceof Object) {
          results.push(this.ebIf(opt));
        } else if (opt instanceof Function) {
          results.push(this.createFunction(key, opt, options));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HiddenFunctions.prototype.setFunctionToDomain = function(subDomain) {
      if (this.obj[subDomain] == null) {
        return this.obj[subDomain] = function() {
          var args, func, i, len, ref, ret;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          ret = [];
          ref = this.___.functions[subDomain];
          for (i = 0, len = ref.length; i < len; i++) {
            func = ref[i];
            ret.push(func.apply(this, args));
          }
          if (this.___._ebIf != null) {
            delete this.___._ebIf;
          }
          return ret;
        };
      }
    };

    HiddenFunctions.prototype.createFunction = function(subDomain, func, option) {
      if (eb.debug) {
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
    };

    HiddenFunctions.prototype.objIsEqual = function(fromObj, toObj) {
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
    };

    HiddenFunctions.prototype.createDomainIfNotExist = function(domain, withoutLast) {
      var currentObj, lastDomain, sub, subRE;
      if (withoutLast == null) {
        withoutLast = false;
      }
      if (eb.debug) {
        console.log("createDomainIfNotExist with domain:" + domain + " and withoutLast=" + withoutLast);
      }
      currentObj = this.obj;
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
        console.log("currentObj: ", currentObj, "add ", currentObj[sub]);
        currentObj = currentObj[sub];
      }
      return {
        obj: currentObj,
        lastDomain: withoutLast ? lastDomain : void 0
      };
    };

    return HiddenFunctions;

  })();

}).call(this);

//# sourceMappingURL=event-object.js.map
