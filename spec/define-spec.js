Eventbus = require('../lib/eventbus');

describe("Will define", function() {
  afterEach(function() {
    //reset eb
    global.eb = new Eventbus();
  });

  it("simple createDomain", function() {
    eb.ebAdd('test1.test2.test3');

    expect(eb.test1.test2.test3).not.toBe(undefined);
  });

  it("simple add", function() {
    var foo = {
      test: function(value) {
        return 'works'
      }
    };
    spyOn(foo,'test');
    eb.ebAdd('test', foo.test);

    eb.test()

    expect(foo.test).toHaveBeenCalled();
    // expect(eb.test()).toBe(['works']);
    expect(eb.test instanceof Function).toBe(true);
  });
  it("add with thisArg on call", function() {
    var obj = {
      attribute: 'test',
      call: function() {
        this.attribute = 'yes';
      }
    }
    eb.ebAdd({thisArg:obj},'test1.test1', obj.call);
    eb.ebAdd('test2.test2',obj.call);

    eb.test2.test2();
    expect(obj.attribute).toBe('test');

    eb.test1.test1();
    expect(obj.attribute).toBe('yes');
  });
  it("rm domain", function() {
    var obj = {
      func: function() {
        return "hello"
      }
    }
    // spyOn(obj,'func');

    eb.ebAdd('test.test.test',obj.func);
    expect(eb.test.test.test!=undefined).toBe(true);

    expect(eb.ebRemove('test.test')).not.toBe(false);
    expect(eb.test.test.test==undefined).toBe(true);
    // expect(obj.call).not.toHaveBeenCalled();
  });
  it("require eventbus again", function() {
    var obj = {
      func: function() {
        return "hello"
      }
    }
    spyOn(obj,'func');

    eb.ebAdd('test.test1', obj.func);
    new Eventbus();
    eb.test.test1();
    expect(obj.func).toHaveBeenCalled();
  });
  it('func within option',function() {
    var obj = {
      attr : 'yes!',
      call1: function() {
        return 'yes'
      },
      call2: function() {
        return this.attr;
      }
    }
    spyOn(obj,'call1');
    spyOn(obj,'call2');

    eb.ebAdd('testContainer',{
      thisArg: obj,
      call1: obj.call1,
      call2: obj.call2
    });
    eb.testContainer.call1()
    eb.testContainer.call2()
    expect(obj.call1).toHaveBeenCalled();
    expect(obj.call2).toHaveBeenCalled();
  });
  it('try ebIf',function() {
    var obj1 = {
      id: 1,
      call: function() {
        console.log("Hello from obj1");
      }
    }
    var obj2 = {
      id: 2,
      call: function() {
        console.log("Hello from obj2");
      }
    }
    spyOn(obj1,'call');
    spyOn(obj2,'call');

    eb.ebAdd('test.test',obj1.call,{thisArg:obj1});
    eb.ebAdd('test.test',obj2.call,{thisArg:obj2});

    eb.test.ebIf({id:1}).test() // will only log 'Hello from obj1', based on thisArg
    expect(obj1.call).toHaveBeenCalled();
    expect(obj2.call).not.toHaveBeenCalled();
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
