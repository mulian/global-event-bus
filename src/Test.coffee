require './eventbus'

class Test
  constructor: ->
    @reqEventBus()
    @test() # how "Hallo"
    @rm1() #kills sayHallo
    try
      @test() # null, on debug -> Error
    catch e
      console.log "jo test() geht nicht mehr"
    @test2()
    @rm2()
    try
      @test2() # null, on debug -> Error
    catch e
      console.log "jo test2() geht nicht mehr"

  reqEventBus: ->
    e('debug',true) # turn debug on
    @rm1 = e('on',{thisArg:@})('Test.xy.z.a.sayHello',@sayHallo)
    #and
    @rm2 = e('on') 'Test.xy.z', {} =
      eb:
        thisArg: @
      'sayTest1' : @sayTest1
      'sayTest2' : @sayTest2

  test: ->
    console.log e()
    e().Test.xy.z.a.sayHello('-test-')

  test2: ->
    e().Test.xy.z.sayTest1()
    e().Test.xy.z.sayTest2('LÄUFT')

  sayHallo: (arg) ->
    console.log "Hallo #{arg}"

  sayTest1: ->
    console.log "test1"
  sayTest2: (arg) ->
    console.log "test2 #{arg}"

new Test()
