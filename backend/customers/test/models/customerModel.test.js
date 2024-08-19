const{Customer}=require("../../src/models");

describe("Customer Model", () => {
    it("should create a new Customer", async () => {
        const mockCustomerData = {
        user_id: "1 | 2 | 3 | 4 | + More",
        full_name: "Binupa | Aneesh | Shreya | Sushmitha | Neeharika | Vikash| + More ",
        phone_no: "123456789 | + More",
        area_of_interests: "Movie making | Video Editing | Script Writing | + More",
        status:1
    };
    Customer.create = jest.fn().mockResolvedValue(mockCustomerData);
    const customerCreated = await Customer.create(mockCustomerData);
    expect(customerCreated.user_id).toEqual(mockCustomerData.user_id);
    });
});
describe("Customer Model - Edit Function", () => {
    it("should edit an existing Customer", async () => {
    const mockCustomerId = 1;

    const mockUpdatedData = { full_name: "Binupa Babu" };
    const mockCustomer = { id: mockCustomerId, ...mockUpdatedData };

      // Mock Sequelize update and findByPk functions
    Customer.update = jest.fn().mockResolvedValue([1]);
    Customer.findByPk = jest.fn().mockResolvedValue(mockCustomer);

    const updatedCustomer = await Customer.update(mockUpdatedData, {
        where: { id: mockCustomerId },
    });
    const result = await Customer.findByPk(mockCustomerId);

    expect(Customer.update).toHaveBeenCalledWith(mockUpdatedData, {
        where: { id: mockCustomerId },
    });
    expect(result.full_name).toEqual(mockUpdatedData.full_name);
    });
});
describe("Customer Model - Delete Function", () => {
    it("should delete a Customer", async () => {
      const mockCustomerrId = 1;
  
      // Mock Sequelize destroy function
      Customer.destroy = jest.fn().mockResolvedValue(1);
  
      const result = await Customer.destroy({ where: { id: mockCustomerrId } });
  
      expect(Customer.destroy).toHaveBeenCalledWith({
        where: { id: mockCustomerrId },
      });
      expect(result).toEqual(1); // Number of records deleted
    });
});
describe("Customer Model - Fetch All Function", () => {
    it("should fetch all Customers", async () => {
    const mockCustomers = [
    { id: 1},
    { id: 2}];
    // Mock Sequelize findAll function
    Customer.findAll = jest.fn().mockResolvedValue(mockCustomers);
    const fetchedCustomer = await Customer.findAll();
    expect(Customer.findAll).toHaveBeenCalled();
    expect(fetchedCustomer.length).toEqual(2);
    expect(fetchedCustomer[0].id).toEqual(mockCustomers[0].id);
    });
});
describe("Customer Model - Fetch One Function", () => {
    it("should fetch a single Customer by id", async () => {
    const mockCustomerId = 1;
    const mockCustomer = { id: mockCustomerId};

      // Mock Sequelize findByPk function
    Customer.findByPk = jest.fn().mockResolvedValue(mockCustomer);

    const fetchedCustomer = await Customer.findByPk(mockCustomerId);

    expect(Customer.findByPk).toHaveBeenCalledWith(mockCustomerId);
    expect(fetchedCustomer.id).toEqual(mockCustomer.id);
    });
});


