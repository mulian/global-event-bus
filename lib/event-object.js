(function() {
  var EventObject;

  module.exports = EventObject = (function() {
    function EventObject() {}

    EventObject.prototype.ebRemove = function(domain) {
      var currentObj, next, re, sub;
      currentObj = this;
      re = /^([\w$_]+)\./;
      while (sub = re.exec(domain)) {
        next = sub[1];
        currentObj = currentObj[next];
        domain = domain.substring(next.length + 1, domain.length);
      }
      if (domain.length > 0) {
        currentObj = currentObj[domain];
      }
      return currentObj._removeAllSub();
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
      var currentObj, domain, func, option, ref, ref1, subDomain;
      ref = eb._defineArg(arg1, arg2, arg3), func = ref.func, domain = ref.domain, option = ref.option;
      if (domain != null) {
        ref1 = this._createDomain(domain), currentObj = ref1.currentObj, subDomain = ref1.subDomain;
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
          results.push(this[domain]._addFunction(key, opt));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    EventObject.prototype._addFunction = function(domain, func) {
      return this[domain] = func;
    };

    EventObject.prototype._createDomain = function(channel) {
      var next, obj, re, sub;
      channel = eb._replaceToCamelCase(channel);
      obj = this;
      re = /^([\w$_]+)\./;
      while (sub = re.exec(channel)) {
        next = sub[1];
        if (obj[next] == null) {
          obj[next] = new EventObject();
        }
        obj = obj[next];
        channel = channel.substring(sub[1].length + 1, channel.length);
      }
      return {
        currentObj: obj,
        subDomain: channel
      };
    };

    return EventObject;

  })();

}).call(this);
