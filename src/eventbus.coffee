
module.exports =
class EventBus
  constructor: ->
    @_toGlobal()
    @emitObj = {}
    @debug = off

  _toGlobal: ->
    global.e = @call

  call: (args...) =>
    console.log "e.call with args:", args if @debug
    switch args[0]
      when undefined then return @emitObj
      when 'on' then return @on
      when 'debug'
        @debug = args[1]
        return @call

  # * channel {String} : Channel name
  # * arg could be ...
  #   * {Function} : call back Function
  #   * {Object} : options and multiple functions
  on: (channel,arg) =>
    chan = @createChannel channel
    if arg instanceof Function
      # console.log chan
      chan.obj[chan.name] = arg
      return ->
        delete chan.obj[chan.name]
    else if arg instanceof Object
      chan.obj[chan.name] = {} if not chan.obj[chan.name]?
      obj = chan.obj[chan.name]
      for key,val of arg
        if val instanceof Function
          obj[key] = val
      return ->
        for key,val of arg
          if val instanceof Function
            delete obj[key]
    else
      console.log "error eb.on!" if @debug

  #Create
  createChannel: (channel) ->
    obj = @emitObj
    re = /^([\w$_]+)\./
    while sub=re.exec channel
      next = sub[1]
      obj[next] = {} if not obj[next]?
      obj = obj[next]
      channel = channel.substring (sub[1].length+1),channel.length
    return {} =
      obj: obj
      name: channel

  #Emit channel?
  emit: (channel) ->

new EventBus()
