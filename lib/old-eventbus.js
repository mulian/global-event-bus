(function() {
  var EventBus,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  module.exports = EventBus = (function() {
    function EventBus() {
      this.rm = bind(this.rm, this);
      this.call = bind(this.call, this);
      this._callReady = bind(this._callReady, this);
      this._toGlobal();
      this.emit = {};
      this.debug = false;
      this._callReadyQue = [];
      this._documentReady(this._callReady);
      return this.call;
    }

    EventBus.prototype._toGlobal = function() {
      if (global.eb == null) {
        return global.eb = this.call;
      }
    };

    EventBus.prototype._documentReady = function(callback) {
      if (typeof document !== "undefined" && document !== null) {
        return document.addEventListener("DOMContentLoaded", function() {
          document.removeEventListener("DOMContentLoaded", arguments.callee, false);
          return callback();
        }, false);
      } else {
        return this._callReady = false;
      }
    };

    EventBus.prototype._callReady = function() {
      var call;
      while (call = this._callReadyQue.shift()) {
        call();
      }
      return this._callReadyQue = false;
    };

    EventBus.prototype._isOption = function(option) {
      if (option instanceof Object) {
        if ((option.thisArg != null) || (option.onReady != null)) {
          return true;
        }
      }
      return false;
    };

    EventBus.prototype.call = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (this.debug) {
        console.log("e.call with args:", args);
      }
      if (args[0] === void 0 || this._isOption(args[0])) {
        return this.getEmitObj(args[0]);
      } else if (args[0] === 'on') {
        return this.on(args[1]);
      } else if (args[0] === 'debug') {
        this.debug = args[1];
        return this.call;
      } else if (args[0] === 'rm') {
        return this.rm;
      }
    };

    EventBus.prototype.rm = function(domain) {
      var next, obj, re, sub;
      obj = this.emit;
      re = /^([\w$_]+)\./;
      while (sub = re.exec(domain)) {
        next = sub[1];
        obj = obj[next];
        domain = domain.substring(next.length + 1, domain.length);
      }
      return delete obj[domain];
    };

    EventBus.prototype.getEmitObj = function(option) {
      this.emit_option = option;
      return this.emit;
    };

    EventBus.prototype.on = function(option) {
      var onReady, thisArg;
      if (this._isOption(option)) {
        thisArg = option.thisArg, onReady = option.onReady;
      }
      return (function(_this) {
        return function(channel, arg) {
          var chan;
          chan = _this.createChannel(channel);
          if (arg instanceof Function) {
            return _this._onFunction(chan, arg, thisArg, onReady);
          } else if (arg instanceof Object) {
            return _this._onObject(chan, arg, thisArg, onReady);
          } else {
            if (_this.debug) {
              return console.log("error eb.on!");
            }
          }
        };
      })(this);
    };

    EventBus.prototype._onFunction = function(chan, func, thisArg, onReady) {
      chan.obj[chan.name] = this._createFunction(func, thisArg, onReady);
      return function() {
        return delete chan.obj[chan.name];
      };
    };

    EventBus.prototype._onObject = function(chan, functions, thisArg, onReady) {
      var key, obj, val;
      if (chan.obj[chan.name] == null) {
        chan.obj[chan.name] = {};
      }
      obj = chan.obj[chan.name];
      for (key in functions) {
        val = functions[key];
        if (val instanceof Function) {
          obj[key] = this._createFunction(val, thisArg, onReady);
        }
      }
      return function() {
        var results;
        results = [];
        for (key in obj) {
          val = obj[key];
          if (val instanceof Function) {
            results.push(delete obj[key]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    };

    EventBus.prototype._createFunction = function(func, thisArg, onReady) {
      return (function(_this) {
        return function() {
          var args, ref;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (_this._isOption(_this.emit_option)) {
            ref = _this.emit_option, thisArg = ref.thisArg, onReady = ref.onReady;
          }
          if (_this._callReadyQue === false || !onReady) {
            if (_this.debug) {
              console.log("run function with", _this);
            }
            return func.apply(thisArg, args);
          } else {
            if (_this.debug) {
              console.log("add run function to que with", _this);
            }
            return _this._callReadyQue.push(function() {
              return func.apply(thisArg, args);
            });
          }
        };
      })(this);
    };

    EventBus.prototype.createChannel = function(channel) {
      var next, obj, re, sub;
      channel = this._replaceToCamelCase(channel);
      obj = this.emit;
      re = /^([\w$_]+)\./;
      while (sub = re.exec(channel)) {
        next = sub[1];
        if (obj[next] == null) {
          obj[next] = {};
        }
        obj = obj[next];
        channel = channel.substring(sub[1].length + 1, channel.length);
      }
      return {
        obj: obj,
        name: channel
      };
    };

    EventBus.prototype._replaceToCamelCase = function(channel) {
      channel = "" + (channel.charAt(0).toUpperCase()) + (channel.substring(1, channel.length));
      channel = channel.replace(/-\w/g, function(match, pos) {
        return match.charAt(1).toUpperCase();
      });
      channel = channel.replace(/:/g, '.');
      return channel;
    };

    return EventBus;

  })();

  new EventBus();

}).call(this);
