Eventbus = require('../lib/eventbus');

describe("Will define", function() {
  it("simple add/rm", function() {
    var func = function() {
      return 'works'
    }
    eb.ebAdd('test', func);
    expect(eb.test()).toBe('works');
    expect(eb.test instanceof Function).toBe(true);
  });

  it("with thisArg add/rm", function() {
    eb.debug=true;
    var obj = {
      attribute: 'test',
      call: function() {
        return this.attribute;
      },
    };
    // var newObj = new obj()
    eb.ebAdd({thisArg:obj},'test.test1', obj.call);
    eb.ebAdd('test2.test2',obj.call);
    expect(eb.test.test1()).toBe('test');
    expect(eb.test2.test2()).toBe(undefined);
    eb.debug=false;
  });
  it("add/rm with thisArg on call", function() {
    var obj = {
      attribute: 'test',
      call: function() {
        return this.attribute;
      },
    }
    // var newObj = new obj()
    eb.ebAdd('test.test1',obj.call);
    eb.ebAdd('test.test2',obj.call);
    expect(eb.test.ebAdd({thisArg:obj}).test1()).toBe('test');
    expect(eb.test.test2()).toBe(undefined);
  });
  it("rm domain", function() {
    var func = function() {
      return "hello"
    }
    // var newObj = new obj()
    eb.ebAdd('test.test1', func);
    expect(eb.test.test1()).toBe('hello');
    expect(eb.test instanceof Object).toBe(true);
    eb.ebRemove('test');
    expect(eb.test.test1).toBe(undefined);
    expect(eb.test instanceof Object).toBe(true);
  });
  it("require eventbus again", function() {
    var func = function() {
      return "hello"
    }
    // var newObj = new obj()
    eb.ebAdd('test.test1', func);
    expect(eb.test.test1()).toBe('hello');
    new Eventbus();
    expect(eb.test.test1()).toBe('hello');
  });
  // it("Use other notation", function() {
  //   var func = function() {
  //     return "str"
  //   }
  //   // var newObj = new obj()
  //   var rm = eb('on')('test-case:test-test10',func);
  //   expect(eb.TestCase.testTest10()).toBe('str');
  // });
});
