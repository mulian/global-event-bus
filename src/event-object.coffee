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
      if domain.length>0
        currentObj = currentObj[domain]
    else
      currentObj._removeAllSub()
  _removeAllSub: ->
    for key,obj of @
      delete @[key] if obj instanceof EventObject


  ebAdd: (arg1,arg2,arg3) ->
    sortArgs = eb._defineArg arg1,arg2,arg3
    console.log "ebAdd:",sortArgs if eb.debug
    {func,domain,option} = sortArgs
    if domain?
      {currentObj,subDomain} = @_createDomain domain, if func? then false else true
      if currentObj!=@
        return currentObj.ebAdd subDomain,func,option

    if option?
      @_setOption option,domain
    if func?
      @_addFunction domain,func
    return @

  _setOption: (options,domain) ->
    for key,opt of options
      if key=='thisArg'
        @thisArg = opt
      else if key == 'onReady'
        @onReady = opt
      else if opt instanceof Function
        @[domain] = new EventObject if not @[domain]?
        @[domain]._addFunction key,opt

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
      obj = obj[next] = new EventObject() if not obj[next]?
      channel = channel.substring (sub[1].length+1),channel.length
    if withSub
      obj = obj[channel] = new EventObject()
      channel = undefined
    rObj = {} =
      currentObj: obj
      subDomain: channel
    console.log "_createDomain: #{firstChan}",rObj if eb.debug
    return rObj
