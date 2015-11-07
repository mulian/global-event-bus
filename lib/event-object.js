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
        if (domain.length > 0) {
          return currentObj = currentObj[domain];
        }
      } else {
        return currentObj._removeAllSub();
      }
    };

    EventObject.prototype._removeAllSub = function() {
      var key, obj, results;
      results = [];
      for (key in this) {
        obj = this[key];
        if (obj instanceof EventObject) {
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
          return currentObj.ebAdd(subDomain, func, option);
        }
      }
      if (option != null) {
        this._setOption(option, domain);
      }
      if (func != null) {
        this._addFunction(domain, func);
      }
      return this;
    };

    EventObject.prototype._setOption = function(options, domain) {
      var key, opt, results;
      results = [];
      for (key in options) {
        opt = options[key];
        if (key === 'thisArg') {
          results.push(this.thisArg = opt);
        } else if (key === 'onReady') {
          results.push(this.onReady = opt);
        } else if (opt instanceof Function) {
          if (this[domain] == null) {
            this[domain] = new EventObject;
          }
          results.push(this[domain]._addFunction(key, opt));
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
          obj = obj[next] = new EventObject();
        }
        channel = channel.substring(sub[1].length + 1, channel.length);
      }
      if (withSub) {
        obj = obj[channel] = new EventObject();
        channel = void 0;
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
