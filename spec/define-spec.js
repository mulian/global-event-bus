Eventbus = require('../lib/eventbus');

describe("Will define", function() {
  afterEach(function() {
    //reset eb
    global.eb = new Eventbus();
  });

  it("simple add/rm", function() {
    var func = function() {
      return 'works'
    }
    eb.ebAdd('test', func);
    expect(eb.test()).toBe('works');
    expect(eb.test instanceof Function).toBe(true);
  });

  it("with thisArg add/rm", function() {
    // eb.debug=true;
    var obj = {
      attribute: 'test',
      call: function() {
        return this.attribute;
      },
    };
    // var newObj = new obj()
    eb.ebAdd({thisArg:obj},'test.test1', obj.call);
    // eb.debug=false;
    eb.ebAdd('test2.test2',obj.call);
    expect(eb.test.test1()).toBe('test');
    expect(eb.test2.test2()).toBe(undefined);
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
    eb.ebAdd('test2.test2',obj.call);
    expect(eb.test.ebAdd({thisArg:obj}).test1()).toBe('test');
    expect(eb.test2.test2()).toBe(undefined);
  });
  it("rm domain", function() {
    var func = function() {
      return "hello"
    }
    // var newObj = new obj()
    eb.ebAdd('test1.test2.test3', func);
    expect(eb.test1.test2.test3()).toBe('hello');
    eb.ebRemove('test1.test2');
    expect(eb.test1.test2.test3).toBe(undefined);

    eb.ebAdd('test1.test2.test3', func);
    eb.ebRemove('test1');
    expect(eb.test1.test2).toBe(undefined);
    // expect(eb.test.test1 instanceof Object).toBe(true);
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
  it('define func within option',function() {
    var obj = {
      attr : 'yes!',
      call1: function() {
        return 'yes'
      },
      call2: function() {
        return this.attr;
      }
    }
    eb.ebAdd('testContainer',{
      thisArg: obj,
      call1: obj.call1,
      call2: obj.call2
    });

    expect(eb.testContainer.call1()).toBe('yes');
    expect(eb.testContainer.call2()).toBe('yes!');
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
