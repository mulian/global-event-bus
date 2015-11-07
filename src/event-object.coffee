module.exports =
class EventObject
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


  ebAdd: (arg1,arg2,arg3) ->
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
      @_addFunction domain,func
    return @

  _setOption: (options) ->
    for key,opt of options
      if key=='thisArg'
        @thisArg = opt
      else if key == 'onReady'
        @onReady = opt
      else if opt instanceof Function
        # @ = new EventObject if not @[domain]?
        @_addFunction key,opt

  # _runWith: (thisArg,call) ->
  #   return (args...) ->
  #     call.apply thisArg,args

  _addFunction: (domain,func) ->
    @[domain] =  (args...) ->
      func.apply @thisArg,args

  #Create
  _createDomain: (channel,withSub=false) ->
    firstChan = channel
    channel = eb._replaceToCamelCase(channel)
    obj = @
    re = /^([\w$_]+)\./
    while sub=re.exec channel
      next = sub[1]
      obj[next] = new EventObject() if not obj[next]? #if not (obj[next] instanceof EventObject)
      obj = obj[next]
      console.log "create obj[#{next}]: ",obj
      channel = channel.substring (sub[1].length+1),channel.length
    if withSub
      obj = obj[channel] = new EventObject()
      channel = undefined
    console.log eb if eb.debug
    rObj = {} =
      currentObj: obj
      subDomain: channel
    console.log "_createDomain: #{firstChan}",rObj if eb.debug
    return rObj
