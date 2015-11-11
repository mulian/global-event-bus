
module.exports =
class EventObject
  constructor: ->
    # @___.obj=@
    @___ = new HiddenFunctions @

  eb: (arg1,arg2,arg3) ->
    sortArgs = eb._defineArg arg1,arg2,arg3
    console.log "eb:",sortArgs if eb?.debug
    {func,domain,option} = sortArgs
    domain = eb._replaceToCamelCase domain if domain?
    if /^[\w$]+$/.test(domain) and func? #if eb('asd',function() ...)
      console.log "eb#1" if eb?.debug
      @___.createFunction domain,func,option
    else if domain? #if eb('asd.asd')
      console.log "eb#2" if eb?.debug
      wihtoutLast=false
      wihtoutLast=true if func?
      {obj,lastDomain} = @___.createDomainIfNotExist(domain,wihtoutLast)
      return obj.eb(lastDomain,func,option)
    else
      console.log "no route!",sortArgs if eb?.debug

    if option? #only if options are set
      console.log "eb#3" if eb?.debug
      @___.setOption option

    return @

# HiddenFunctions = require './hidden-functions'
class HiddenFunctions
  functions : {}
  constructor : (obj) ->
    console.log "Init Hiddenfunction for ",obj if eb?.debug
    @obj = obj

  # Removes all objects von 'xxx.xxx' domain
  # Goto domain and then call removeAllSub()
  # * domain{String}: undefined (call on self) or domain
  # * return
  #   * {Boolean}: false there was no domain
  #   * {Object}: get the sub Domain where its all deleted
  ebRemove: (domain) ->
    console.log "ebRemove: #{domain}" if eb?.debug
    if domain instanceof Boolean
      obj = @obj
    else obj = @goToDomain domain
    return false if obj==false
    obj.___.removeAllSub()
    return obj
  removeAllSub: ->
    for key,obj of @obj
      delete @obj[key] if obj instanceof EventObject or obj instanceof Function
  goToDomain: (domain) ->
    subRE = /([\w$]+)\.?/g
    obj = @obj
    while sub=subRE.exec(domain)
      sub = sub[1]
      return false if not obj[sub]?
      obj = obj[sub]
    return obj

  ebIf: (obj) ->
    @_ebIf=obj
    return @obj

  setOption: (options) ->
    console.log "options"
    # console.log @_functions if eb?.debug
    for key,opt of options
      if key=='thisArg' and opt instanceof Object
        console.log "set this arg to ",@obj
        @obj.thisArg = opt
      else if key == 'onReady' and opt instanceof Boolean #TODO: del?
        @onReady = opt
      else if key == 'remove' and (typeof(opt) == 'string' || opt instanceof String)
        @ebRemove opt
      else if key == 'if' and opt instanceof Object
        @ebIf opt
      else if opt instanceof Function
        # @ = new EventObject if not @[domain]?
        @createFunction key,opt,options

  setFunctionToDomain: (subDomain) -> #@==EventObject.___
    if not @obj[subDomain]?
      @obj[subDomain] = (args...) -> #@==EventObject
        ret = []
        for func in @___.functions[subDomain]
          ret.push func.apply @,args
        delete @___._ebIf if @___._ebIf?
        return ret
  createFunction: (subDomain,func,option) -> #@==EventObject.___
    console.log "createFunction subDomain:#{subDomain} func:",func if eb?.debug
    @functions[subDomain] = [] if not @functions[subDomain]?
    @functions[subDomain].push (args...) -> #@==EventObject
      thisArg = @thisArg #use default thisarg
      thisArg = option.thisArg if option?.thisArg? #or other
      if not @___._ebIf?
        func.apply thisArg,args
      else
        if @___.objIsEqual @___._ebIf,thisArg
          func.apply thisArg,args
    @setFunctionToDomain subDomain
  objIsEqual: (fromObj,toObj) ->
    return false if not fromObj? or not toObj?
    for k,v of fromObj
      if not (v == toObj[k])
        return false
    return true

  #create domain
  # * domain{String}: domain ex. test.test
  # * withoutLast{Boolean}: true to without last domain, maby because it is a methode domain
  createDomainIfNotExist: (domain, withoutLast=false) ->
    console.log "createDomainIfNotExist with domain:#{domain} and withoutLast=#{withoutLast}" if eb?.debug
    currentObj = @obj
    subRE = /([\w$]+)\.?/g
    if withoutLast
      subRE = /([\w$]+)\./g
      lastDomain = /\.([\w$]+)$/.exec(domain)[1]
    while sub=subRE.exec(domain)
      sub = sub[1]
      currentObj[sub] = new EventObject() if not currentObj[sub]?
      currentObj = currentObj[sub]
    return {} =
      obj: currentObj
      lastDomain: lastDomain if withoutLast
