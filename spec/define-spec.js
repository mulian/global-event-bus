require('../lib/eventbus');

describe("Will define", function() {
  it("simple add/rm", function() {
    var func = function() {
      return 'works'
    }
    var rm = eb('on')('Test',func);
    expect(eb().Test()).toBe('works');
    expect(eb().Test instanceof Function).toBe(true);
    rm();
    expect(eb().Test instanceof Function).toBe(false);
  });

  it("with thisArg add/rm", function() {
    var obj = {
      attribute: 'test',
      call: function() {
        return this.attribute;
      },
    }
    // var newObj = new obj()
    var rm = eb('on',{thisArg:obj})('Test.test1',obj.call);
    var rm2 = eb('on')('Test.test2',obj.call);
    expect(eb().Test.test1()).toBe('test');
    expect(eb().Test.test2()).toBe(undefined);

    expect(eb().Test.test1 instanceof Function).toBe(true);
    rm(); rm2();
    expect(eb().Test.test1 instanceof Function).toBe(false);
  });
  it("add/rm with thisArg on call", function() {
    var obj = {
      attribute: 'test',
      call: function() {
        return this.attribute;
      },
    }
    // var newObj = new obj()
    var rm = eb('on')('Test.test1',obj.call);
    var rm2 = eb('on')('Test.test2',obj.call);
    expect(eb({thisArg:obj}).Test.test1()).toBe('test');
    expect(eb().Test.test2()).toBe(undefined);

    expect(eb().Test.test1 instanceof Function).toBe(true);
    rm(); rm2();
    expect(eb().Test.test1 instanceof Function).toBe(false);
  });
});
