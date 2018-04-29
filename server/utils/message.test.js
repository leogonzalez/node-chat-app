const expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage function", () => {
  it("should generate the correct message object", () => {
    const res = generateMessage("Admin", "This is from admin");

    expect(res.from).toEqual("Admin");
    expect(res.text).toEqual("This is from admin");
    // expect(res.createdAt).toBeA("number");
    expect(typeof res.createdAt).toBe("number");
  });
});

describe("generateLocationMessage function", () => {
  it("should generate the correct location message object", () => {
    const res = generateLocationMessage("Admin", -25, -46);

    expect(res.from).toEqual("Admin");
    expect(res.url).toEqual("https://www.google.com/maps/place/-25,-46");
    // expect(res.createdAt).toBeA("number");
    expect(typeof res.createdAt).toBe("number");
  });
});
