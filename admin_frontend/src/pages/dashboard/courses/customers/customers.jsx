import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { authorsTableData, projectsTableData } from "@/data";
  import { NavLink } from "react-router-dom";
  import { useEffect, useState } from "react";


export function Customers() {
    const [customerList, setCustomerList] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/customers`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setCustomerList(data.data);
            setSuccessMessage(""); // Clear success message on data fetch
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const handleDeleteClick = async (e, itemId) => {
        e.preventDefault();
        if(confirm('Are you sure?')) {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/customers/${itemId}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                });
                
                if (response.ok) {
                    setCustomerList(currentCustomers => currentCustomers.filter(customer => customer.id !== itemId));
                    setSuccessMessage("Customer deleted successfully.");
                } else {
                    alert("Unable to perform delete.");
                }
            } catch (error) {
                console.error("Error deleting customer:", error);
                alert("An error occurred.");
            }
        }
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
              <Typography variant="h6" color="white" className="flex-1">
               Customer Listing
              </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["fullname", "email address", "phone",  "created date", "status", "", ""].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customerList.map(
                  ({ full_name, email_id, phone_no, created_at, status, id, role}, key) => {
                    const className = `py-3 px-5 ${
                      key === authorsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={`${id}-tr`}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {full_name}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {email_id}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {phone_no}
                          </Typography>
                        </td>  
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {created_at}
                          </Typography>
                        </td>                                          
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={status ? "green" : "blue-gray"}
                            value={status ? "Active" : "Inactive"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                        <div className="flex items-center space-x-2">
                        
                        {
       role == 'customer' && (
          <><Typography
            as="a"
            href={`customers/edit/${id}`}
            className="text-xs font-semibold text-blue-gray-600"
          >
            Edit
          </Typography><span>|</span></>
        )
      }
                      
                      
                      <Typography
                          as="a"
                          href="#"
                          onClick={(e) => handleDeleteClick(e, id)} // Assuming `itemId` is the parameter you want to pass
                          className="text-xs font-semibold text-blue-gray-600"
                          >
                          Delete
                          </Typography>
                      </div>
  
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    );
}

export default Customers;
