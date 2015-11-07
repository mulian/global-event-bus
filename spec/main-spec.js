EventBus = require('../lib/eventbus');

describe("First tests", function() {
  it("is eb global", function() {
    expect(eb).not.toBe(undefined);
  });
  it("is eb an Eventbus?", function() {
    expect(eb instanceof EventBus).toBe(true);
  });
  it("is eb.ebAdd a Function", function() {
    expect(eb.ebAdd instanceof Function).toBe(true);
  });
});
