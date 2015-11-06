
module.exports =
class EventBus
  constructor: ->
    @_toGlobal()
    @emitObj = {}
    @debug = off
    @_callReadyQue= []
    @_documentReady @_callReady
    return @call

  _toGlobal: ->
    if not global.eb?
      global.eb = @call

  _documentReady: (callback) ->
    if document?
      document.addEventListener "DOMContentLoaded", ->
        document.removeEventListener "DOMContentLoaded", arguments.callee, false
        callback()
      , false
    else @_callReady=false

  _callReady: =>
    call() while call=@_callReadyQue.shift()
    @_callReadyQue=off

  _isOption: (option) ->
    if option instanceof Object
      if option.thisArg? or option.onReady?
        return true
    return false

  call: (args...) =>
    console.log "e.call with args:", args if @debug
    if args[0] == undefined or @_isOption args[0]
      return @getEmitObj args[0]
    else if args[0] == 'on'
      return @on(args[1])
    else if args[0] == 'debug'
      @debug = args[1]
      return @call
    else if args[0] == 'rm'
      return @rm

  rm: (domain) =>
    obj = @emitObj
    re = /^([\w$_]+)\./
    while sub=re.exec domain
      next = sub[1]
      obj = obj[next]
      domain = domain.substring (next.length+1),domain.length
    delete obj[domain]

  getEmitObj: (option) ->
    @emit_option = option
    return @emitObj

  # * channel {String} : Channel name
  # * arg could be ...
  #   * {Function} : call back Function
  #   * {Object} : options and multiple functions
  on: (option) ->
    {thisArg,onReady} = option if @_isOption option
    return (channel,arg) =>
      chan = @createChannel channel
      if arg instanceof Function
        # console.log chan
        @onFunction chan,arg,thisArg,onReady
      else if arg instanceof Object
        @onObject chan,arg,thisArg,onReady
      else
        console.log "error eb.on!" if @debug
  onFunction: (chan,func,thisArg,onReady) ->
    chan.obj[chan.name] = @createFunction(func,thisArg,onReady)
    return ->
      delete chan.obj[chan.name]
  onObject: (chan,functions,thisArg,onReady) ->
    chan.obj[chan.name] = {} if not chan.obj[chan.name]?
    obj = chan.obj[chan.name]
    for key,val of functions
      if val instanceof Function
        obj[key] = @createFunction(val,thisArg,onReady)
    return ->
      for key,val of obj
        if val instanceof Function
          delete obj[key]

  #Return a function and reads the possible emit Option
  createFunction: (func,thisArg,onReady) ->
    return (args...) =>
      {thisArg,onReady} = @emit_option if @_isOption @emit_option
      if @_callReadyQue==false or not onReady
        func.apply thisArg,args
      else #add to @_callReadyQue
        console.log "add to que"
        @_callReadyQue.push ->
          func.apply thisArg,args

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

new EventBus()
