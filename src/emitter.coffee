module.exports =
class Emitter
  constructor: ->
    @que = []
    @channels = {}

  callFunction: (func,option) ->
    if option instanceof Boolean
      callOnReady=option
    else
      thisArg=option
    return (args...) ->
      func.apply thisArg,args

  #option: could be an ...
  # * boolean -> callOnReady or
  # * everything else -> thisArg
  on: (channel,func,option) ->
    #swap func<->option
    if option instanceof Function
      tmp = func
      func = option
      option = tmp
    @channels[channel]=[] if not @channels[channel]?
    @channels[channel].push @callFunction(func,option)

  emit: (channel,args...) ->
    chan = @channels[channel]
    if @channels[channel]?
      for item in chan
        item.apply null,args


emitter = new Emitter()
emitter.on 'testi1', true ,(arg,num)->
  console.log "testi1: #{arg} and #{num}"

emitter.emit 'testi1', 'blubb', 66
