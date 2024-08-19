const User = require("../../src/models/userModel");
describe("User Model", () => {
    it("should create a new User", async () => {
        const mockUserData = {
        id: "1 | 2 | 3 | 4 | + More",
        email_id: "admin@gmail.com | User@gmail.com | + More ",
        password: "adminpwd |",
        role: "adm | User",
        status:1
    };
    User.create = jest.fn().mockResolvedValue(mockUserData);
    const UserCreated = await User.create(mockUserData);
    expect(UserCreated.id).toEqual(mockUserData.id);
    });
});
describe("User Model - Fetch All Function", () => {
    it("should fetch all Users", async () => {
    const mockUsers = [
    { id: 1},
    { id: 2}];
    // Mock Sequelize findAll function
    User.findAll = jest.fn().mockResolvedValue(mockUsers);
    const fetchedUser = await User.findAll();
    expect(User.findAll).toHaveBeenCalled();
    expect(fetchedUser.length).toEqual(2);
    expect(fetchedUser[0].id).toEqual(mockUsers[0].id);
    });
});
describe("User Model - Fetch One Function", () => {
    it("should fetch a single User by id", async () => {
    const mockUserId = 1;
    const mockUser = { id: mockUserId};

      // Mock Sequelize findByPk function
    User.findByPk = jest.fn().mockResolvedValue(mockUser);

    const fetchedUser = await User.findByPk(mockUserId);

    expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
    expect(fetchedUser.id).toEqual(mockUser.id);
    });
});
describe("User Model - Delete Function", () => {
    it("should delete a User", async () => {
    const mockUserId = 1;

    const mockUpdatedData = { status: -1 };
    const mockUser = { id: mockUserId, ...mockUpdatedData };

      // Mock Sequelize update and findByPk functions
    User.update = jest.fn().mockResolvedValue([1]);
    User.findByPk = jest.fn().mockResolvedValue(mockUser);

    const updatedUser = await User.update(mockUpdatedData, {
        where: { id: mockUserId },
    });
    const result = await User.findByPk(mockUserId);

    expect(User.update).toHaveBeenCalledWith(mockUpdatedData, {
        where: { id: mockUserId },
    });
    expect(result.status).toEqual(mockUpdatedData.status);
    });
});


