EventObject = require './event-object'

module.exports =
class EventBus extends EventObject
  constructor: ->
    @_toGlobal()

  _toGlobal: ->
    if not global.eb?
      global.eb = @

  _isInstance: (arg) ->
    if not arg?
      return 'undefined'
    else if arg instanceof Function
      return 'function'
    else if arg instanceof Object
      return 'object'
    else return 'string'
  _defineArg: (args...) ->
    obj = {}
    for arg in args
      switch @_isInstance arg
        when 'function' then obj.func = arg
        when 'string' then obj.domain = arg
        when 'object' then obj.option = arg
    return obj

  _replaceToCamelCase: (channel) ->
    #First char to upper
    # channel = "#{channel.charAt(0).toUpperCase()}#{channel.substring 1,channel.length}"
    #replace all -\w with - uppercase w
    channel = channel.replace /-\w/g, (match,pos) ->
      return match.charAt(1).toUpperCase()
    #replace : to .
    channel = channel.replace /:/g, '.'
    return channel

new EventBus()
