EventBus = require('../lib/eventbus')

describe 'Default Tests', ->
  beforeEach ->
    global.eb = new EventBus
    eb.debug = true
  it 'is eb global and an EventBus?', ->
    expect(eb instanceof EventBus).toBe true
  it 'is eb.ebAdd a Function', ->
    expect(eb.ebAdd instanceof Function).toBe true
  it 'is eb.ebRemove a Function', ->
    expect(eb.ebRemove instanceof Function).toBe true
  it 'is eb.ebIf a Function', ->
    expect(eb.ebIf instanceof Function).toBe true
