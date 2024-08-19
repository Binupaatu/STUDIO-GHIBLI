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

export function Enrollments() {
    const [enrollmentData, setEnrollmentData] = useState([]); //Hello This is set to ok

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/enrollment`; // Your API endpoint
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => setEnrollmentData(data.data))
          .catch(error => console.error("Failed to fetch data:", error));
      }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
            <Typography variant="h6" color="white" className="flex-1">
             Enrollment Listing
            </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Course", "customer name", "email",  "phone no",  "payment method", "enrolled date"].map((el) => (
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
              {enrollmentData.map(
                ({ full_name, title, email_id, phone_no, payment_method, created_at, id}, key) => {
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
                              {full_name}
                            </Typography>
                       
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
                              {payment_method}
                            </Typography>
                      </td>                                        
                      <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                              {created_at}
                            </Typography>
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

export default Enrollments;
