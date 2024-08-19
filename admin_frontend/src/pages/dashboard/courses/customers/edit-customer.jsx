import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Alert,
    Button,
    Input,
    Textarea,
    Switch,
} from "@material-tailwind/react";
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function EditCustomer() {
    
    const [customer, setCustomer] = useState({
        full_name: '',
        phone: '',
        status: ''
    });    

    const [errors, setErrors] = useState({});
    let { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/customers/${id}`; // Your API endpoint
          try {
            const response = await fetch(apiUrl); 
            const {data} = await response.json();
            console.log(data[0]);
            setCustomer({
              full_name: data[0].full_name,
              phone: data[0].phone_no,
              status: data[0].status          
            });
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
      
        fetchData();
    }, []); // Empty dependency array ensures this effect runs only once on mount
      

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
      
        // Required fields validation
        if (!customer.full_name.trim()) {
          newErrors.full_name = "Fullname is required";
          isValid = false;
        }
      
        if (!customer.phone.trim()) {
          newErrors.phone = "Phone Number is required";
          isValid = false;
        }
      
        setErrors(newErrors);
        return isValid;
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Validation failed.");
            return; // Stop form submission
        }
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/customers/${id}`; // Your API endpoint
        let subMissionErrors = {};
      
        try {
            const updatedCustomer = {
                ...customer
            };
            if( !updatedCustomer.status) updatedCustomer.status = 0; else updatedCustomer.status = 1;
            
          const response = await fetch(apiUrl, {
            method: 'PUT', // or 'PUT' if you are updating an existing record
            headers: {
              'Content-Type': 'application/json',
              // Include other headers as needed, like authorization tokens
            },
            body: JSON.stringify(updatedCustomer), // Convert the course state to a JSON string
          });
      
          if (!response.ok) {
            //console.log(await response.json());
            // Handle response errors
            const message = `An error has occurred: ${response.statusText}`;
            subMissionErrors.create_error = message;
            setErrors(subMissionErrors);
            return false;
          }
          window.location.href = '/dashboard/customers';
        } catch (error) {
          console.error('Error:', error);
        }
        // Submit logic here
    };
    
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
        <Typography variant="h6" color="white" className="flex-1">
        Edit Customer
        </Typography>
        <NavLink to={`/dashboard/customers`}>
        <Button
        variant="contained"
        color="lightBlue" // You can choose the color that matches your design
        className="ml-4" // Add margin left if needed, adjust according to your spacing requirements
        // Add additional Tailwind classes as needed for styling
        >
        List Customers
        </Button>
        </NavLink>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <div className="mb-10 flex items-center justify-between">
            <form className="mt-8 mb-2 mx-auto w-180 max-w-screen-lg w-full" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Fullname
                        </label>
                        <Input
                            name="full_name"
                            value={customer.full_name}
                            placeholder=""
                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={handleChange}
                        />  
                        { !!errors.full_name ? <p class="text-red-500 text-xs italic">Please enter a valid name.</p> : <></> }
                    </div>             
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Phone Number
                        </label>
                        <Input
                            name="phone"
                            value={customer.phone}
                            placeholder=""
                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={handleChange}
                        />                         
                        { !!errors.phone ? <p class="text-red-500 text-xs italic">Please enter a valid Phone.</p> : <></> }
                    </div>             
                </div>   
                <div className="flex flex-wrap -mx-3 mb-6">           
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">Customer Status</label>
                        <Switch
                        name="status"
                        checked={customer.status}
                          label={"Active"}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                          onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 flex justify-end">   
                            <Button className="mt-6" type="submit">
                                Save
                            </Button>
                        </div>
                    </div> 
                    {
                        !!errors.create_error && (
                            <Alert key="red" open={true} color="red">
                            {errors.create_error}
                            </Alert>
                        )
                    }                    
                </div>                                                                              
            </form>        
        </div>
        </CardBody>
        </Card>
        </div>
        );
    }
    
    export default EditCustomer;
    