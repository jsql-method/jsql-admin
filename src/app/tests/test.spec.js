// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe("Users factory", function() {
  it("has a dummy spec to test 2 + 2 passing", function() {
    // An intentionally passing test.
    expect(4).toEqual(4);
  });

  it("has a dummy spec to test 2 + 2 failing", function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect().toEqual(4);
  });
});
