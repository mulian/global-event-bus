module.exports =
class EventObject
  constructor: ->
    @func = {}
  ebRemove: (domain) ->
    currentObj = @
    if domain?
      re = /^([\w$_]+)\./
      while sub=re.exec domain
        next = sub[1]
        currentObj = currentObj[next]
        domain = domain.substring (next.length+1),domain.length
      currentObj = currentObj[domain]
      currentObj._removeAllSub()
    else
      currentObj._removeAllSub()
  _removeAllSub: ->
    for key,obj of @
      delete @[key] if obj instanceof EventObject or obj instanceof Function


  ebAdd: (arg1,arg2,arg3) =>
    sortArgs = eb._defineArg arg1,arg2,arg3
    console.log "ebAdd:",sortArgs if eb.debug
    {func,domain,option} = sortArgs
    if domain?
      {currentObj,subDomain} = @_createDomain domain, if func? then false else true
      if currentObj!=@
        console.log "go deeper" if eb.debug
        return currentObj.ebAdd func,option,subDomain

    if option?
      @_setOption option
    if func?
      @_addFunction domain,func,@thisArg
    return @

  _setOption: (options) ->
    console.log @func if eb.debug
    for key,opt of options
      if key=='thisArg'
        @thisArg = opt
      else if key == 'onReady'
        @onReady = opt
      else if opt instanceof Function
        # @ = new EventObject if not @[domain]?
        @_addFunction key,opt,@thisArg

  # _runWith: (thisArg,call) ->
  #   return (args...) ->
  #     call.apply thisArg,args

  _addFunction: (domain,func,thisArg) ->
    console.log "_addFunction #{domain}" if eb.debug
    if not @func[domain]?
      @func[domain] = []
      console.log "createFunctionArray #{domain}" if eb.debug
    @func[domain].push {} =
      func: func
      thisArg: thisArg
    if not @[domain]?
      @[domain] = (args...) ->
        for f in @func[domain]
          if f.thisArg?
            f.func.apply f.thisArg,args
          else f.func.apply @thisArg,args
    # @func[domain] = [] if not @func[domain]?
    # @func[domain].push func
    # @[domain] = (args...) ->
    #   for func in @func[domain]
    #     func.apply @[domain].thisArg,args

  #Create
  _createDomain: (channel,withSub=false) ->
    firstChan = channel
    channel = eb._replaceToCamelCase(channel)
    obj = @
    re = /^([\w$_]+)\./
    while sub=re.exec channel
      next = sub[1]
      if not obj[next]? #if not (obj[next] instanceof EventObject)
        obj[next] = new EventObject()
        console.log "create obj[#{next}]: ",obj if eb.debug
      obj = obj[next]
      channel = channel.substring (sub[1].length+1),channel.length
    if withSub
      if not obj[channel]?
        obj[channel] = new EventObject()
        console.log "and create obj[#{channel}]: ",obj if eb.debug
      obj = obj[channel]
      channel = undefined
    console.log eb if eb.debug
    rObj = {} =
      currentObj: obj
      subDomain: channel
    console.log "_createDomain: #{firstChan}",rObj if eb.debug
    return rObj
