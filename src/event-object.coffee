module.exports =
class EventObject
  constructor: ->
    @_functions = {}

  # Removes all objects von 'xxx.xxx' domain
  # Goto domain and then call _removeAllSub()
  # * domain{String}: undefined (call on self) or domain
  # * return
  #   * {Boolean}: false there was no domain
  #   * {Object}: get the sub Domain where its all deleted
  ebRemove: (domain) ->
    console.log "ebRemove: #{domain}" if eb.debug
    if domain instanceof Boolean
      obj = @
    else obj = @_goToDomain domain
    return false if obj==false
    obj._removeAllSub()
    return obj
  _removeAllSub: ->
    for key,obj of @
      delete @[key] if obj instanceof EventObject or obj instanceof Function
  _goToDomain: (domain) ->
    subRE = /([\w$]+)\.?/g
    obj = @
    while sub=subRE.exec(domain)
      sub = sub[1]
      return false if not obj[sub]?
      obj = obj[sub]
    return obj

  ebIf: (obj) ->
    @_ebIf=obj
    return @

  eb: (arg1,arg2,arg3) ->
    sortArgs = eb._defineArg arg1,arg2,arg3
    console.log "eb:",sortArgs if eb.debug
    {func,domain,option} = sortArgs
    domain = eb._replaceToCamelCase domain if domain?

    if /^[\w$]+$/.test(domain) and func?
      @_createFunction domain,func,option
    else if domain?
      wihtoutLast=false
      wihtoutLast=true if func?
      {obj,lastDomain} = @_createDomainIfNotExist(domain,wihtoutLast)
      return obj.eb(lastDomain,func,option)
    else if option?
      @_setOption option
    else
      console.log "no route!",sortArgs if eb.debug

    return @


  _setOption: (options) ->
    # console.log @_functions if eb.debug
    for key,opt of options
      if key=='thisArg'
        @thisArg = opt
      else if key == 'onReady' and opt instanceof Boolean #TODO: del?
        @onReady = opt
      else if key == 'remove' and (typeof(opt) == 'string' || opt instanceof String)
        @ebRemove opt
      else if key == 'if' and opt instanceof Object
        @ebIf opt
      else if opt instanceof Function
        # @ = new EventObject if not @[domain]?
        @_createFunction key,opt,options

  _setFunctionToDomain: (subDomain) ->
    if not @[subDomain]?
      @[subDomain] = (args...) ->
        ret = []
        for func in @_functions[subDomain]
          ret.push func.apply @,args
        delete @_ebIf if @_ebIf?
        return ret
  _createFunction: (subDomain,func,option) ->
    console.log "_createFunction subDomain:#{subDomain} func:",func if eb.debug
    @_functions[subDomain] = [] if not @_functions[subDomain]?
    @_functions[subDomain].push (args...) ->
      thisArg = @thisArg #use default thisarg
      thisArg = option.thisArg if option?.thisArg? #or other
      if not @_ebIf?
        func.apply thisArg,args
      else
        if @_objIsEqual @_ebIf,thisArg
          func.apply thisArg,args
    @_setFunctionToDomain subDomain
  _objIsEqual: (fromObj,toObj) ->
    for k,v of fromObj
      if not (v == toObj[k])
        return false
    return true

  #create domain
  # * domain{String}: domain ex. test.test
  # * withoutLast{Boolean}: true to without last domain, maby because it is a methode domain
  _createDomainIfNotExist: (domain, withoutLast=false) ->
    console.log "_createDomainIfNotExist with domain:#{domain} and withoutLast=#{withoutLast}" if eb.debug
    subRE = /([\w$]+)\.?/g
    if withoutLast
      subRE = /([\w$]+)\./g
      lastDomain = /\.([\w$]+)$/.exec(domain)[1]
    currentObj = @
    while sub=subRE.exec(domain)
      sub = sub[1]
      currentObj[sub] = new EventObject() if not currentObj[sub]?
      currentObj = currentObj[sub]
    return {} =
      obj: currentObj
      lastDomain: lastDomain if withoutLast
