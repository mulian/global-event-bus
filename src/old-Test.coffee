Eventbus = require './eventbus'

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
    # @rm2()
    try
      @test2() # null, on debug -> Error
    catch e
      console.log "jo test2() geht nicht mehr"
    console.log "RM:"
    eb('rm') 'Test.xy'

  reqEventBus: ->
    eb('debug',true) # turn debug on
    @rm1 = eb('on',{thisArg:@})('Test.xy.z.a.sayHello',@sayHallo)
    #and
    @rm2 = eb('on',{thisArg:@}) 'Test.xy.z', {} =
      'sayTest1' : @sayTest1
      'sayTest2' : @sayTest2

    @rm3 = eb('on',{thisArg:@})('Test.html.sayHello',@sayHallo)
    @rm4 = eb('on',{thisArg:@})('test-case:html-sayHello:asd',@sayHallo)

  o:
    thisArg: @
    onReady: true

  test: ->
    # console.log eb()
    eb(@o).Test.xy.z.a.sayHello '-test-'

  test2: ->
    eb({thisArg:@}).Test.xy.z.sayTest1()
    eb().Test.xy.z.sayTest2('LÄUFT')

  sayHallo: (arg) ->
    console.log "Hallo #{arg}"

  sayTest1: ->
    console.log "test1"
  sayTest2: (arg) ->
    console.log "test2 #{arg}"

new Test()
