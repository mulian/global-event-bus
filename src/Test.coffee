require './eventbus'

class Test
  constructor: ->
    @reqEventBus()
    @test() # how "Hallo"
    @rm1() #kills sayHallo
    # @test() # null, on debug -> Error
    @test2()
    @rm2()
    @test2()

  reqEventBus: ->
    e('debug',true) # turn debug on
    @rm1 = e('on',{thisArg:@})('Test.xy.z.a.sayHello',@sayHallo)
    #and
    @rm2 = e('on') 'Test.xy.z', {} =
      thisArg: @
      'sayTest1' : @sayTest1
      'sayTest2' : @sayTest2

  test: ->
    console.log e()
    e().Test.xy.z.a.sayHello('-test-')

  test2: ->
    e().Test.xy.z.sayTest1()
    e().Test.xy.z.sayTest2()

  sayHallo: (arg) ->
    console.log "Hallo #{arg}"

  sayTest1: ->
    console.log "test1"
  sayTest2: ->
    console.log "test2"

new Test()
