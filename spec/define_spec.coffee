EventBus = require('../lib/event-bus')

describe 'Will define', ->
  beforeEach ->
    global.eb = new EventBus()
  it 'simple createDomain', ->
    eb.eb 'test1.test2.test3'
    expect(eb.test1.test2.test3).not.toBe undefined
  it 'simple add', ->
    foo = test: (value) ->
      'works'
    spyOn foo, 'test'
    eb.eb 'test', foo.test
    eb.test()
    expect(foo.test).toHaveBeenCalled()
    # expect(eb.test()).toBe(['works']);
    expect(eb.test instanceof Function).toBe true
  it 'add with thisArg on call', ->
    obj =
      attribute: 'test'
      call: ->
        @attribute = 'yes'

    eb.eb { thisArg: obj }, 'test1.test1', obj.call
    eb.eb 'test2.test2', obj.call
    eb.test2.test2()
    expect(obj.attribute).toBe 'test'
    eb.test1.test1()
    expect(obj.attribute).toBe 'yes'
  it 'add many domains only one execute', ->
    obj =
      attribute: 'test'
      call: ->
        @attribute = 'yes'

    eb.eb { thisArg: obj }, 'test1.test1', obj.call
    eb.eb 'test2.test2', obj.call
    eb.eb 'test3.test', obj.call
    eb.eb 'test4.test', obj.call
    eb.eb 'test5.test', obj.call
    eb.eb 'test6.test', obj.call
    eb.eb 'test7.test', obj.call
    eb.eb 'test', {} =
      thisArg: obj
      f1: obj.call
      f2: obj.call
      f3: obj.call
      f4: obj.call
      f5: obj.call

    eb.test2.test2()
    expect(obj.attribute).toBe 'test'
    eb.test1.test1()
    expect(obj.attribute).toBe 'yes'

    expect(eb.test7.test().length).toBe 1
    expect(eb.test.f3().length).toBe 1

  it 'rm domain', ->
    obj = func: ->
      'hello'
    # spyOn(obj,'func');
    eb.eb 'test.test.test', obj.func
    expect(eb.test.test.test != undefined).toBe true
    expect(eb.eb({remove:'test.test'})).not.toBe false
    expect(eb.test.test.test == undefined).toBe true
    # expect(obj.call).not.toHaveBeenCalled();
  it 'require EventBus again', ->
    obj = func: ->
      'hello'
    spyOn obj, 'func'
    eb.eb 'test.test1', obj.func
    new EventBus
    eb.test.test1()
    expect(obj.func).toHaveBeenCalled()
  it 'func within option', ->
    obj =
      attr: 'yes!'
      call1: ->
        'yes'
      call2: ->
        @attr
    spyOn obj, 'call1'
    spyOn obj, 'call2'
    eb.eb 'testContainer',
      thisArg: obj
      call1: obj.call1
      call2: obj.call2
    eb.testContainer.call1()
    eb.testContainer.call2()
    expect(obj.call1).toHaveBeenCalled()
    expect(obj.call2).toHaveBeenCalled()
  it 'try eb -> If', ->
    obj1 =
      id: 1
      call: ->
        console.log 'Hello from obj1'
    obj2 =
      id: 2
      call: ->
        console.log 'Hello from obj2'
    spyOn obj1, 'call'
    spyOn obj2, 'call'
    eb.eb 'test.test', obj1.call, thisArg: obj1
    eb.eb 'test.test', obj2.call, thisArg: obj2
    eb.test.eb({if:{id: 1}}).test()
    # will only log 'Hello from obj1', based on thisArg
    expect(obj1.call).toHaveBeenCalled()
    expect(obj2.call).not.toHaveBeenCalled()

describe 'ThisArg Test', ->
  beforeEach ->
    global.eb = new EventBus
  it 'with thisArg on define', ->
    obj =
      attribute: 'test'
      call: ->
        @attribute = 'yes'
    eb.eb { thisArg: obj }, 'test1.test1', obj.call
    eb.eb 'test2.test2', obj.call
    eb.test2.test2()
    expect(obj.attribute).toBe 'test'
    eb.test1.test1()
    expect(obj.attribute).toBe 'yes'
  it 'with thisArg on call', ->
    obj =
      attribute: 'test'
      call: ->
        @attribute = 'yes'
    eb.eb 'test1.test1', obj.call
    eb.eb 'test2.test2', obj.call
    eb.test2.test2()
    expect(obj.attribute).toBe 'test'
    eb.test1.eb({ thisArg: obj }).test1()
    expect(obj.attribute).toBe 'yes'
