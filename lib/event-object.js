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
        } else if (key === 'onReady' && opt instanceof Boolean) {
          results.push(this.onReady = opt);
        } else if (key === 'remove' && (typeof opt === 'string' || opt instanceof String)) {
          results.push(this.ebRemove(opt));
        } else if (key === 'if' && opt instanceof Object) {
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

//# sourceMappingURL=event-object.js.map
