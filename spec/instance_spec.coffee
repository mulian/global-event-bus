EventBus = require('../lib/event-bus')

describe 'Instance Test', ->
  beforeEach ->
    global.eb = new EventBus
    # eb.debug=true

  it 'standart instance', ->
    TestObject = require('./test-object.coffee')
    instance = new TestObject('hello')
    eb.eb 'test', {} =
      thisArg: instance
      call: instance.call
      setInfo: instance.setInfo

    expect(eb.test.call instanceof Function).toBe(true)
    expect(eb.test.call('world')).toContain 'hello world'

    expect(eb.test.setInfo('work')).toContain 'work'
    expect(eb.test.call('world')).toContain 'work world'

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
    #again, maby this works only on instanceiate
    expect(eb.test.setInfo('work')).toContain 'work'
    expect(eb.test.call('world')).toContain 'work world'

  it 'instance two domains on call', ->
    i1 = {} =
      domain: 'test1',
      watch: ['call','setInfo'],
      create: ->
        TestObject = require('./test-object.coffee')
        return new TestObject('hello')
    i2 = {} =
      domain: 'test2',
      watch: ['call','setInfo'],
      create: ->
        TestObject = require('./test-object.coffee')
        return new TestObject('hello')
    eb.eb {} =
      instance: [i1,i2]

    expect(eb.test1.call instanceof Function).toBe(true)
    expect(eb.test1.call('world')).toContain 'hello world'
    #again, maby this works only on instanceiate
    expect(eb.test1.setInfo('work')).toContain 'work'
    expect(eb.test1.call('world')).toContain 'work world'

    expect(eb.test2.call instanceof Function).toBe(true)
    expect(eb.test2.call('world')).toContain 'hello world'
    #again, maby this works only on instanceiate
    expect(eb.test2.setInfo('work')).toContain 'work'
    expect(eb.test2.call('world')).toContain 'work world'
