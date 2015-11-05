module.exports =
class Emitter
  constructor: ->
    @que = []
    @channels = {}
    @_possible_options = ['onReady','thisArg']

  # Check if arg1 is an Option attribute
  _isOption: (arg1) ->
    if (arg1 instanceof Object)
      for op in @_possible_options
        return true if arg[op]?
    return false

  # prepare function for call on emit
  # should work faster on running. Everything is predefined.
  _callFunction: (func,option) ->
    return (args...) =>
      if @_isOption args[0]
        option = args.splice 0,1
      if option?
        {thisArg} = option
      func.apply thisArg,args

  # You could swap options and function!
  # * channel {String} channel name
  # * func {Function} the called function
  # * option {Object}
  #   * onReady {Boolean}: default false, true: call only if dom is ready
  #   * thisArg {Object}: replace this arg for called function
  on: (channel,func,option) ->
    console.log "on #{channel}"
    #swap func<->option
    if option instanceof Function
      tmp = func
      func = option
      option = tmp
    @channels[channel]=[] if not @channels[channel]?
    @channels[channel].push @_callFunction(func,option)

  # * channel {String}: Channel name
  # * option {Object}: option, **could** be first arg!
  #                   or its first arg for called function
  # * The rest are args for the called Function
  emit: (channel,option) ->
    return (args) ->
      chan = @channels[channel]
      if @channels[channel]?
        for item in chan
          item.apply null,args

emitter = new Emitter()
emitter.on 'testi1', true ,(arg,num)->
  console.log "testi1: #{arg} and #{num}"

# emitter.emit 'testi1', 'blubb', 66


emitter.emit('test').DOMready 'blubb'
