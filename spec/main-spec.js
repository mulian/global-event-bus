require('../lib/eventbus');

describe("First tests", function() {
  it("is eb global", function() {
    expect(eb).not.toBe(undefined);
  });
  it("is eb a Function", function() {
    expect(eb instanceof Function).toBe(true);
  });
  it("is eb() an Object", function() {
    expect(eb() instanceof Object).toBe(true);
  });
  it("is eb(optionObj) an Object", function() {
    expect(eb({thisArg:{}}) instanceof Object).toBe(true);
  });
  it("is eb('on') a Function", function() {
    expect(eb('on') instanceof Function).toBe(true);
  });
  it("is eb('debug',true) a Function", function() {
    expect(eb('debug',true) instanceof Function).toBe(true);
  });
});
