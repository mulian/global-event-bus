EventBus = require('../lib/event-bus')
new EventBus()
describe 'Default Tests', ->
  # beforeEach ->
    # global.eb = new EventBus
    # eb.debug = true
  it 'is eb global and an EventBus?', ->
    expect(eb instanceof EventBus).toBe true
  it 'is eb.eb a Function', ->
    expect(eb.eb instanceof Function).toBe true
