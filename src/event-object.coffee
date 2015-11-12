
module.exports =
class EventObject
  constructor: ->
    # @___.obj=@
    # @___ = new HiddenFunctions @
    @___functions = {}

  eb: (arg1,arg2,arg3) ->
    sortArgs = eb._defineArg arg1,arg2,arg3
    console.log "eb:",sortArgs if eb?.debug
    {func,domain,option} = sortArgs
    domain = eb._replaceToCamelCase domain if domain?
    if /^[\w$]+$/.test(domain) and func? #if eb('asd',function() ...)
      console.log "eb#1" if eb?.debug
      @___createFunction domain,func,option
    else if domain? #if eb('asd.asd')
      console.log "eb#2" if eb?.debug
      wihtoutLast=false
      wihtoutLast=true if func?
      {obj,lastDomain} = @___createDomainIfNotExist(domain,wihtoutLast)
      return obj.eb(lastDomain,func,option)
    else
      console.log "no route!",sortArgs if eb?.debug

    if option? #only if options are set
      console.log "eb#3" if eb?.debug
      @___setOption option

    return @

# HiddenFunctions = require './hidden-functions'
# class HiddenFunctions

  # Removes all objects von 'xxx.xxx' domain
  # Goto domain and then call removeAllSub()
  # * domain{String}: undefined (call on self) or domain
  # * return
  #   * {Boolean}: false there was no domain
  #   * {Object}: get the sub Domain where its all deleted
  ___ebRemove: (domain) ->
    console.log "ebRemove: #{domain}" if eb?.debug
    if domain instanceof Boolean
      obj = @
    else obj = @___goToDomain domain
    return false if obj==false
    obj.___removeAllSub()
    return obj
  ___removeAllSub: ->
    for key,obj of @
      delete @[key] if obj instanceof EventObject or obj instanceof Function
  ___goToDomain: (domain) ->
    subRE = /([\w$]+)\.?/g
    obj = @
    while sub=subRE.exec(domain)
      sub = sub[1]
      return false if not obj[sub]?
      obj = obj[sub]
    return obj

  ___ebIf: (obj) ->
    @____ebIf=obj
    return @

  ___setOption: (options) ->
    # console.log "options"
    # console.log @_functions if eb?.debug
    for key,opt of options
      if key=='thisArg' and opt instanceof Object
        # console.log "set this arg to ",@obj
        @thisArg = opt
      else if key == 'onReady' and opt instanceof Boolean #TODO: del?
        @___onReady = opt
      else if key == 'remove' and (typeof(opt) == 'string' || opt instanceof String)
        @___ebRemove opt
      else if key == 'if' and opt instanceof Object
        @___ebIf opt
      else if opt instanceof Function
        # @ = new EventObject if not @[domain]?
        @___createFunction key,opt,options
      else if key == 'instance' and (opt instanceof Object or opt instanceof Array)
        @___createInstance opt
      else
        console.log "what do to with option[#{key}]=",opt if eb?.debug
  ___createInstance: (instance) ->
    console.log "___createInstance with ",instance
    if instance instanceof Array
      for i in instance
        @___createInstance i
    if instance.domain?
      obj = @___createDomainIfNotExist(instance.domain)
      delete instance.domain
      return obj.obj.___createInstance instance
    for fName in instance.watch
      @[fName] = @___tmpFunction fName,instance
  ___tmpFunction: (fName,instance) ->
    console.log "___tmpFunction with ",fName,instance
    return (args...) ->
      @___removeAllSub()
      ins = instance.create()
      console.info "watch: ",instance.watch
      for fName in instance.watch
        console.info "function #{fName}"
        @___createFunction(fName,ins[fName],{thisArg:ins})
      return @[fName].apply null,args

  ___setFunctionToDomain: (subDomain) -> #@==EventObject.___
    if not @[subDomain]?
      @[subDomain] = (args...) -> #@==EventObject
        ret = []
        for func in @___functions[subDomain]
          ret.push func.apply @,args
        delete @____ebIf if @____ebIf?
        return ret
  ___createFunction: (subDomain,func,option) -> #@==EventObject.___
    console.log "createFunction subDomain:#{subDomain} func:",func if eb?.debug
    @___functions[subDomain] = [] if not @___functions[subDomain]?
    @___functions[subDomain].push (args...) -> #@==EventObject
      thisArg = @thisArg #use default thisarg
      thisArg = option.thisArg if option?.thisArg? #or other
      if not @____ebIf?
        func.apply thisArg,args
      else
        if @___objIsEqual @____ebIf,thisArg
          func.apply thisArg,args
    @___setFunctionToDomain subDomain
  ___objIsEqual: (fromObj,toObj) ->
    return false if not fromObj? or not toObj?
    for k,v of fromObj
      if not (v == toObj[k])
        return false
    return true

  #create domain
  # * domain{String}: domain ex. test.test
  # * withoutLast{Boolean}: true to without last domain, maby because it is a methode domain
  ___createDomainIfNotExist: (domain, withoutLast=false) ->
    console.log "createDomainIfNotExist with domain:#{domain} and withoutLast=#{withoutLast}" if eb?.debug
    currentObj = @
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
