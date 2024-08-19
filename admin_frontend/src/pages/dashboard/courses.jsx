import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import CurrencyFormatter from "@/widgets/CurrencyFormatter";

export function Courses() {
    const [courseData, setCourseData] = useState([]); //Hello This is set to ok

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/courses`; // Your API endpoint
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => setCourseData(data.data))
          .catch(error => console.error("Failed to fetch data:", error));
      }, []);


      const handleDeleteClick = async (e, itemId) => {
        e.preventDefault(); // Prevent the default anchor behavior
        console.log('Deleting item with ID:', itemId);

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/courses/${itemId}`; // Your API endpoint
        const response = await fetch(apiUrl, {
            method: 'DELETE', // or 'PUT' if you are updating an existing record
            headers: {
              'Content-Type': 'application/json',
              // Include other headers as needed, like authorization tokens
            }
          });
      
          if (!response.ok) {
            alert("Unable to perfoem delete !!");
            return false;
          }
          window.location.href = '/dashboard/courses';
      };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
            <Typography variant="h6" color="white" className="flex-1">
             Courses Listing
            </Typography>
            <NavLink to={`add`}>
            <Button
                variant="contained"
                color="lightBlue" // You can choose the color that matches your design
                className="ml-4" // Add margin left if needed, adjust according to your spacing requirements
                // Add additional Tailwind classes as needed for styling
             >
                Add New
            </Button>
            </NavLink>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["title", "price", "total enrollments", "status",  "created date","", ""].map((el) => (
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
              {courseData.map(
                ({ title, price, total_enrollments, status, created_at, id}, key) => {
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={title}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {title}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          <CurrencyFormatter value={price}></CurrencyFormatter>
                        </Typography>
                      </td>                        
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {total_enrollments}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          Students
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status ? "green" : "blue-gray"}
                          value={status ? "online" : "offline"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {created_at}
                        </Typography>
                      </td>
                      <td className={className}>
                      <div className="flex items-center space-x-2">
                     
                        <Typography
                            as="a"
                            href={`courses/edit/${id}`}
                            className="text-xs font-semibold text-blue-gray-600"
                        >
                            Edit
                        </Typography>
                    <span>|</span>
                    
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

export default Courses;
