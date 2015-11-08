(function() {
  var EventObject,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  module.exports = EventObject = (function() {
    function EventObject() {
      this.ebAdd = bind(this.ebAdd, this);
      this._functions = {};
    }

    EventObject.prototype.ebRemove = function(domain) {
      var currentObj, next, re, sub;
      currentObj = this;
      if (domain != null) {
        re = /^([\w$_]+)\./;
        while (sub = re.exec(domain)) {
          next = sub[1];
          currentObj = currentObj[next];
          domain = domain.substring(next.length + 1, domain.length);
        }
        currentObj = currentObj[domain];
        return currentObj._removeAllSub();
      } else {
        return currentObj._removeAllSub();
      }
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

    EventObject.prototype.ebIf = function(obj) {
      this._if = obj;
      return this;
    };

    EventObject.prototype.ebAdd = function(arg1, arg2, arg3) {
      var currentObj, domain, func, option, ref, sortArgs, subDomain;
      sortArgs = eb._defineArg(arg1, arg2, arg3);
      if (eb.debug) {
        console.log("ebAdd:", sortArgs);
      }
      func = sortArgs.func, domain = sortArgs.domain, option = sortArgs.option;
      if (domain != null) {
        ref = this._createDomain(domain, func != null ? false : true), currentObj = ref.currentObj, subDomain = ref.subDomain;
        if (currentObj !== this) {
          if (eb.debug) {
            console.log("go deeper");
          }
          return currentObj.ebAdd(func, option, subDomain);
        }
      }
      if (option != null) {
        this._setOption(option);
      }
      if (func != null) {
        this._addFunction(domain, func, this.thisArg);
      }
      return this;
    };

    EventObject.prototype._setOption = function(options) {
      var key, opt, results;
      if (eb.debug) {
        console.log(this._functions);
      }
      results = [];
      for (key in options) {
        opt = options[key];
        if (key === 'thisArg') {
          results.push(this.thisArg = opt);
        } else if (key === 'onReady') {
          results.push(this.onReady = opt);
        } else if (opt instanceof Function) {
          results.push(this._addFunction(key, opt, this.thisArg));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    EventObject.prototype._addFunction = function(domain, func, thisArg) {
      if (eb.debug) {
        console.log("_addFunction " + domain);
      }
      if (this._functions[domain] == null) {
        this._functions[domain] = [];
        if (eb.debug) {
          console.log("createFunctionArray " + domain);
        }
      }
      this._functions[domain].push({
        func: func,
        thisArg: thisArg
      });
      if (this[domain] == null) {
        return this[domain] = function() {
          var args, f, i, len, ref, results;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          ref = this._functions[domain];
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            f = ref[i];
            if (f.thisArg != null) {
              results.push(f.func.apply(f.thisArg, args));
            } else {
              results.push(f.func.apply(this.thisArg, args));
            }
          }
          return results;
        };
      }
    };

    EventObject.prototype._createDomain = function(channel, withSub) {
      var firstChan, next, obj, rObj, re, sub;
      if (withSub == null) {
        withSub = false;
      }
      firstChan = channel;
      channel = eb._replaceToCamelCase(channel);
      obj = this;
      re = /^([\w$_]+)\./;
      while (sub = re.exec(channel)) {
        next = sub[1];
        if (obj[next] == null) {
          obj[next] = new EventObject();
          if (eb.debug) {
            console.log("create obj[" + next + "]: ", obj);
          }
        }
        obj = obj[next];
        channel = channel.substring(sub[1].length + 1, channel.length);
      }
      if (withSub) {
        if (obj[channel] == null) {
          obj[channel] = new EventObject();
          if (eb.debug) {
            console.log("and create obj[" + channel + "]: ", obj);
          }
        }
        obj = obj[channel];
        channel = void 0;
      }
      if (eb.debug) {
        console.log(eb);
      }
      rObj = {
        currentObj: obj,
        subDomain: channel
      };
      if (eb.debug) {
        console.log("_createDomain: " + firstChan, rObj);
      }
      return rObj;
    };

    return EventObject;

  })();

}).call(this);
