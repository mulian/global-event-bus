EventBus = require('../lib/eventbus')

describe 'Will define', ->
  beforeEach ->
    global.eb = new EventBus
  it 'simple createDomain', ->
    eb.ebAdd 'test1.test2.test3'
    expect(eb.test1.test2.test3).not.toBe undefined
  it 'simple add', ->
    foo = test: (value) ->
      'works'
    spyOn foo, 'test'
    eb.ebAdd 'test', foo.test
    eb.test()
    expect(foo.test).toHaveBeenCalled()
    # expect(eb.test()).toBe(['works']);
    expect(eb.test instanceof Function).toBe true
  it 'add with thisArg on call', ->
    obj =
      attribute: 'test'
      call: ->
        @attribute = 'yes'

    eb.ebAdd { thisArg: obj }, 'test1.test1', obj.call
    eb.ebAdd 'test2.test2', obj.call
    eb.test2.test2()
    expect(obj.attribute).toBe 'test'
    eb.test1.test1()
    expect(obj.attribute).toBe 'yes'
  it 'rm domain', ->
    obj = func: ->
      'hello'
    # spyOn(obj,'func');
    eb.ebAdd 'test.test.test', obj.func
    expect(eb.test.test.test != undefined).toBe true
    expect(eb.ebRemove('test.test')).not.toBe false
    expect(eb.test.test.test == undefined).toBe true
    # expect(obj.call).not.toHaveBeenCalled();
  it 'require EventBus again', ->
    obj = func: ->
      'hello'
    spyOn obj, 'func'
    eb.ebAdd 'test.test1', obj.func
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
    eb.ebAdd 'testContainer',
      thisArg: obj
      call1: obj.call1
      call2: obj.call2
    eb.testContainer.call1()
    eb.testContainer.call2()
    expect(obj.call1).toHaveBeenCalled()
    expect(obj.call2).toHaveBeenCalled()
  it 'try ebIf', ->
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
    eb.ebAdd 'test.test', obj1.call, thisArg: obj1
    eb.ebAdd 'test.test', obj2.call, thisArg: obj2
    eb.test.ebIf(id: 1).test()
    # will only log 'Hello from obj1', based on thisArg
    expect(obj1.call).toHaveBeenCalled()
    expect(obj2.call).not.toHaveBeenCalled()

  # it("Use other notation", function() {
  #   var func = function() {
  #     return "str"
  #   }
  #   // var newObj = new obj()
  #   var rm = eb('on')('test-case:test-test10',func);
  #   expect(eb.TestCase.testTest10()).toBe('str');
  # });
