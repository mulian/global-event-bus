EventBus = require('../lib/event-bus')

describe 'Instance Test', ->
  beforeEach ->
    global.eb = new EventBus
    
  it 'standart instance', ->
    TestObject = require('./test-object.coffee')
    instance = new TestObject('hello')
    eb.eb 'test', {} =
      thisArg: instance
      call: instance.call
      setInfo: instance.setInfo

    expect(eb.test.call instanceof Function).toBe(true)
    expect(eb.test.call('world')).toContain 'hello world'

  it 'instance on call', ->
    eb.eb {} =
      instance: {} =
        domain: 'test',
        watch: ['call','setInfo'],
        create: ->
          TestObject = require('./test-object.coffee')
          return new TestObject('hello')

    expect(eb.test.call instanceof Function).toBe(true)
    expect(eb.test.call('world')).toContain 'hello world'
