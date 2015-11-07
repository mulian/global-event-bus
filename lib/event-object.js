(function() {
  var EventObject,
    slice = [].slice;

  module.exports = EventObject = (function() {
    function EventObject() {}

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
        this._addFunction(domain, func);
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
        } else if (opt instanceof Function) {
          results.push(this._addFunction(key, opt));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    EventObject.prototype._addFunction = function(domain, func) {
      return this[domain] = function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return func.apply(this.thisArg, args);
      };
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
        }
        obj = obj[next];
        console.log("create obj[" + next + "]: ", obj);
        channel = channel.substring(sub[1].length + 1, channel.length);
      }
      if (withSub) {
        obj = obj[channel] = new EventObject();
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
