const expect = require("expect");
const { Users } = require("./users");

describe("users", () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "123",
        name: "Leo",
        room: "234"
      },
      {
        id: "1234",
        name: "Leon",
        room: "234"
      },
      {
        id: "1235",
        name: "Leonr",
        room: "23456"
      }
    ];
  });

  it("should add new user", () => {
    var users = new Users();
    var user = {
      id: "123",
      name: "Leo",
      room: "234"
    };

    users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it("should return user list", () => {
    var userList = users.getUserList('234');
    expect(userList).toEqual(['Leo', 'Leon']);
  });

  it("should find user", () => {
    var userGetter = users.getUser('123');
    expect(userGetter.id).toEqual('123');
  });

  it("should not find user", () => {
    var userGetter = users.getUser('99');
    // expect(userGetter).toNotExist();
  });

  it("should remove user", () => {
    var userGetter = users.removeUser('123');
    expect(userGetter.id).toBe('123');
    expect(users.users.length).toBe(2)
  });
});
