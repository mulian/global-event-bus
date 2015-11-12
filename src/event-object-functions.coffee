module.exports =
  remove :
    # Removes all objects von 'xxx.xxx' domain
    # Goto domain and then call removeAllSub()
    # * domain{String}: undefined (call on self) or domain
    # * return
    #   * {Boolean}: false there was no domain
    #   * {Object}: get the sub Domain where its all deleted
    ebRemove: (domain) ->
      console.log "ebRemove: #{domain}" if eb?.debug
      if domain instanceof Boolean
        obj = @eo
      else obj = @goToDomain domain
      return false if obj==false
      # console.info "ebRemove: ",obj
      obj.___.removeAllSub()
      return obj
    removeAllSub: ->
      for key,obj of @eo
        delete @eo[key] if obj.eb instanceof Function or obj instanceof Function

  instance : {} =
    createInstance: (instance) ->
      console.log "createInstance with ",instance
      if instance instanceof Array
        for i in instance
          @createInstance i
      if instance.domain?
        obj = @createDomainIfNotExist(instance.domain)
        delete instance.domain
        return obj.obj.createInstance instance
      for fName in instance.watch
        @eo[fName] = @tmpFunction fName,instance
    tmpFunction: (fName,instance) -> #@==EventObjectHiddenFunctions
      console.log "tmpFunction with ",fName,instance
      return (args...) ->#@==EventObject?
        @___.removeAllSub()
        ins = instance.create()
        console.info "watch: ",instance.watch
        for fName in instance.watch
          console.info "function #{fName}"
          @___.createFunction(fName,ins[fName],{thisArg:ins})
        return @[fName].apply null,args

  addFunctions : {} =
    setFunctionToDomain: (subDomain) -> #@==EventObjectHiddenFunctions
      if not @eo[subDomain]?
        @eo[subDomain] = (args...) -> #@==EventObject
          ret = []
          # console.log "@functions[#{subDomain}]: ",@functions[subDomain]
          for func in @___.functions[subDomain]
            ret.push func.apply @,args
          delete @___._ebIf if @___._ebIf?
          return ret
    createFunction: (subDomain,func,option) -> #@==EventObjectHiddenFunctions
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

  option: {} =
    setOption: (options) ->
      # console.log "options"
      # console.log @_functions if eb?.debug
      for key,opt of options
        if key=='thisArg' and opt instanceof Object
          # console.log "set this arg to ",@obj
          @eo.thisArg = opt
        else if key == 'onReady' and opt instanceof Boolean #TODO: del?
          @onReady = opt
        else if key == 'remove' and (typeof(opt) == 'string' || opt instanceof String)
          @ebRemove opt
        else if key == 'if' and opt instanceof Object
          @ebIf opt
        else if opt instanceof Function
          # @ = new EventObject if not @[domain]?
          @createFunction key,opt,options
        else if key == 'instance' and (opt instanceof Object or opt instanceof Array)
          @createInstance opt
        else
          console.log "what do to with option[#{key}]=",opt if eb?.debug
