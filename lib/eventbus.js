(function() {
  var EventBus, EventObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  EventObject = require('./event-object');

  module.exports = EventBus = (function(superClass) {
    extend(EventBus, superClass);

    function EventBus() {
      this._toGlobal();
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

  new EventBus();

}).call(this);
