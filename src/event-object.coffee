{remove,instance,addFunctions,option} = require './event-object-functions'

class Mixin
  @mixin: (array) ->
    for obj in array
      for key, value of obj
        @::[key] = value
      obj.included?.apply(@)
      @
class EventObjectHiddenFunctions extends Mixin
  @mixin [remove,instance,addFunctions,option]

  # * @eo{EventObject}: current event object
  constructor: (@eo) ->
    @functions = {}

  ebIf: (obj) ->
    @_ebIf=obj
    return @eo

  goToDomain: (domain) ->
    subRE = /([\w$]+)\.?/g
    obj = @eo
    while sub=subRE.exec(domain)
      sub = sub[1]
      return false if not obj[sub]?
      obj = obj[sub]
    return obj

  #create domain
  # * domain{String}: domain ex. test.test
  # * withoutLast{Boolean}: true to without last domain, maby because it is a methode domain
  createDomainIfNotExist: (domain, withoutLast=false) ->
    console.log "createDomainIfNotExist with domain:#{domain} and withoutLast=#{withoutLast}" if eb?.debug
    currentObj = @eo
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

module.exports =
class EventObject
  constructor: ->
    # @___.obj=@
    # @___ = new HiddenFunctions @
    # @___functions = {}
    @___ = new EventObjectHiddenFunctions(@)

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
# class HiddenFunctions
