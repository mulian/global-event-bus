Eventbus = require './event-bus'
new Eventbus()
class Test
  constructor: ->
    @reqEventBus()
    @test() # how "Hallo"
    # @rm1() #kills sayHallo
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
    eb.eb
      remove: 'Test.xy'


  reqEventBus: ->
    eb.debug=true
    @rm1 = eb.eb 'Test.xy.z.a.test'
    @rm1 = eb.eb 'Test.xy.z.a.sayHello',@sayHallo
    #and
    console.log "define Object functions"
    @rm2 = eb.eb 'Test.xy.z.b', {} =
      thisArg:@
      'sayTest1' : @sayTest1
      'sayTest2' : @sayTest2

    @rm3 = eb.eb {thisArg:@},'Test.html.sayHello',@sayHallo
    @rm4 = eb.eb {thisArg:@},'test-case:html-sayHello:asd',@sayHallo

    eb.eb 'damn',@test
    eb.eb 'damn',@sayHallo
    console.log "----"
    eb.damn()
    console.log "----"
    console.log eb

  o:
    thisArg: @
    onReady: true
    once:true

  test: ->
    # console.log eb()
    eb.Test.xy.z.a.eb(@o).sayHello '-test-'

  test2: ->
    eb.Test.xy.z.b.eb({thisArg:@}).sayTest1()
    eb.Test.xy.z.b.sayTest2('LÄUFT')

  sayHallo: (arg) ->
    console.log "Hallo #{arg}"

  sayTest1: ->
    console.log "test1"
  sayTest2: (arg) ->
    console.log "test2 #{arg}"

new Test()
