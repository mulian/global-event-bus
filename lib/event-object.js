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

//# sourceMappingURL=event-object.js.map
