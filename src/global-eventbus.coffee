DEBUG=on

module.exports =
class EventBus
  constructor:  ->
    @channels = {}
    @_attachToGlobal()

  _attachToGlobal: ->
    if window?
      window.eventbus=@
      @_callReadyQue=[]
      @_documentReady @_callReady
    else if global?
      global.eventbus=@
    else
      return false

  _documentReady: (callback) ->
    document.addEventListener "DOMContentLoaded", ->
      document.removeEventListener "DOMContentLoaded", arguments.callee, false
      callback()
    , false

  _callReady: =>
    call() while call=@_callReadyQue.shift()
    @_callReadyQue=off

  # * channle {String}: Channel name
  # * callback {Function}: called function
  # * options {Object}:
  #   * thisArg {Instance}: define thisArg on call
  #   * callOnReady {Boolean}: call if Dom is Ready
  # OR
  # * options {Object}
  #   * channle {String}: Channel name, important
  #   * callback {Function}: called function, important
  #   * thisArg {Instance}: define thisArg on call
  #   * callOnReady {Boolean}: call if Dom is Ready
  on: (channel,callback,options) ->
    if channel instanceof Object
      {channel,callback,thisArg,callOnReady} = channel
    else
      {thisArg,callOnReady} = options if options?
    clearChannel = ->
      if @channels[channel]?
        return delete @channels[channel]
      else return false
    if channel? and callback?
      @channels[channel] =
        function: callback
        thisArg: thisArg
        callOnReady: callOnReady
      return =>
        clearChannel.call @
    else return null

  emit: (channel,args...) ->
    run = @channels[channel]
    call = ->
      run.function.apply run.thisArg, args
    if run?
      if @_callReadyQue==off or not run.callOnReady
        call()
      else
        @_callReadyQue.push call
    else
      return null

new EventBus()


# Test cases
asd1 = eventbus.on "asd1", (a1)->
  console.log "läuft1 #{a1}"
, {callOnReady:true}
asd2 = eventbus.on "asd2", (a1)->
  console.log "läuft2 #{a1}"
, {callOnReady:false}

test = {} =
  blubb: "geht auch"

asd3 = eventbus.on {} =
  channel: 'asd3'
  callback: (a1) ->
    console.log "läuft3 #{a1}"
    console.log "Und: #{@blubb}"
  callOnReady: true
  thisArg: test
# asd()
