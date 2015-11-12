(function() {
  var EventObject,
    slice = [].slice;

  module.exports = EventObject = (function() {
    function EventObject() {
      this.___functions = {};
    }

    EventObject.prototype.eb = function(arg1, arg2, arg3) {
      var domain, func, lastDomain, obj, option, ref, sortArgs, wihtoutLast;
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
        this.___createFunction(domain, func, option);
      } else if (domain != null) {
        if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
          console.log("eb#2");
        }
        wihtoutLast = false;
        if (func != null) {
          wihtoutLast = true;
        }
        ref = this.___createDomainIfNotExist(domain, wihtoutLast), obj = ref.obj, lastDomain = ref.lastDomain;
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
        this.___setOption(option);
      }
      return this;
    };

    EventObject.prototype.___ebRemove = function(domain) {
      var obj;
      if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
        console.log("ebRemove: " + domain);
      }
      if (domain instanceof Boolean) {
        obj = this;
      } else {
        obj = this.___goToDomain(domain);
      }
      if (obj === false) {
        return false;
      }
      obj.___removeAllSub();
      return obj;
    };

    EventObject.prototype.___removeAllSub = function() {
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

    EventObject.prototype.___goToDomain = function(domain) {
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

    EventObject.prototype.___ebIf = function(obj) {
      this.____ebIf = obj;
      return this;
    };

    EventObject.prototype.___setOption = function(options) {
      var key, opt, results;
      results = [];
      for (key in options) {
        opt = options[key];
        if (key === 'thisArg' && opt instanceof Object) {
          results.push(this.thisArg = opt);
        } else if (key === 'onReady' && opt instanceof Boolean) {
          results.push(this.___onReady = opt);
        } else if (key === 'remove' && (typeof opt === 'string' || opt instanceof String)) {
          results.push(this.___ebRemove(opt));
        } else if (key === 'if' && opt instanceof Object) {
          results.push(this.___ebIf(opt));
        } else if (opt instanceof Function) {
          results.push(this.___createFunction(key, opt, options));
        } else if (key === 'instance' && (opt instanceof Object || opt instanceof Array)) {
          results.push(this.___createInstance(opt));
        } else {
          if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
            results.push(console.log("what do to with option[" + key + "]=", opt));
          } else {
            results.push(void 0);
          }
        }
      }
      return results;
    };

    EventObject.prototype.___createInstance = function(instance) {
      var fName, i, j, l, len, len1, obj, ref, results;
      console.log("___createInstance with ", instance);
      if (instance instanceof Array) {
        for (j = 0, len = instance.length; j < len; j++) {
          i = instance[j];
          this.___createInstance(i);
        }
      }
      if (instance.domain != null) {
        obj = this.___createDomainIfNotExist(instance.domain);
        delete instance.domain;
        return obj.obj.___createInstance(instance);
      }
      ref = instance.watch;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        fName = ref[l];
        results.push(this[fName] = this.___tmpFunction(fName, instance));
      }
      return results;
    };

    EventObject.prototype.___tmpFunction = function(fName, instance) {
      console.log("___tmpFunction with ", fName, instance);
      return function() {
        var args, ins, j, len, ref;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        this.___removeAllSub();
        ins = instance.create();
        console.info("watch: ", instance.watch);
        ref = instance.watch;
        for (j = 0, len = ref.length; j < len; j++) {
          fName = ref[j];
          console.info("function " + fName);
          this.___createFunction(fName, ins[fName], {
            thisArg: ins
          });
        }
        return this[fName].apply(null, args);
      };
    };

    EventObject.prototype.___setFunctionToDomain = function(subDomain) {
      if (this[subDomain] == null) {
        return this[subDomain] = function() {
          var args, func, j, len, ref, ret;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          ret = [];
          ref = this.___functions[subDomain];
          for (j = 0, len = ref.length; j < len; j++) {
            func = ref[j];
            ret.push(func.apply(this, args));
          }
          if (this.____ebIf != null) {
            delete this.____ebIf;
          }
          return ret;
        };
      }
    };

    EventObject.prototype.___createFunction = function(subDomain, func, option) {
      if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
        console.log("createFunction subDomain:" + subDomain + " func:", func);
      }
      if (this.___functions[subDomain] == null) {
        this.___functions[subDomain] = [];
      }
      this.___functions[subDomain].push(function() {
        var args, thisArg;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        thisArg = this.thisArg;
        if ((option != null ? option.thisArg : void 0) != null) {
          thisArg = option.thisArg;
        }
        if (this.____ebIf == null) {
          return func.apply(thisArg, args);
        } else {
          if (this.___objIsEqual(this.____ebIf, thisArg)) {
            return func.apply(thisArg, args);
          }
        }
      });
      return this.___setFunctionToDomain(subDomain);
    };

    EventObject.prototype.___objIsEqual = function(fromObj, toObj) {
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

    EventObject.prototype.___createDomainIfNotExist = function(domain, withoutLast) {
      var currentObj, lastDomain, sub, subRE;
      if (withoutLast == null) {
        withoutLast = false;
      }
      if (typeof eb !== "undefined" && eb !== null ? eb.debug : void 0) {
        console.log("createDomainIfNotExist with domain:" + domain + " and withoutLast=" + withoutLast);
      }
      currentObj = this;
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

    return EventObject;

  })();

}).call(this);

//# sourceMappingURL=event-object.js.map
