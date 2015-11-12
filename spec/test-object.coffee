module.exports =
class TestObject
  constructor: (@info) ->
    # console.info "TestObject init"
  call: (arg) ->
    # console.info "TestObject call"
    return "#{@info} #{arg}"
  setInfo: (@info) ->
