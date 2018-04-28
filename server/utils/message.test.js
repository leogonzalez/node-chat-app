const expect = require("expect");
const { generateMessage } = require("./message");

describe("generateMessage function", () => {
  it("should generate the correct message object", () => {
    const res = generateMessage("Admin", "This is from admin");

    expect(res.from).toEqual("Admin");
    expect(res.text).toEqual("This is from admin");
    // expect(res.createdAt).toBeA("number");
    expect(typeof res.createdAt).toBe("number");
  });
});
