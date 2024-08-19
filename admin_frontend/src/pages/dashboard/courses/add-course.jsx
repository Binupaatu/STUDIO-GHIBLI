import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Alert,
    Chip,
    Button,
    Input,
    Textarea,
    Switch,
} from "@material-tailwind/react";
import { authorsTableData, projectsTableData } from "@/data";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export function Courses() {
    
    const [course, setCourse] = useState({
        title: '',
        description: '',
        learning_outcomes: '',
        course_inclusions: '',
        is_certified: false,
        author: '',
        price:'',
        status: '',
        course_content: ''
    });    
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
      
        // Required fields validation
        if (!course.title.trim()) {
          newErrors.title = "Title is required";
          isValid = false;
        }

        if (!course.price.trim() || isNaN(course.price.trim())) {
            newErrors.price = "Enter a valid price";
            isValid = false;
          }        
      
        if (!course.course_content.trim()) {
          newErrors.course_content = "Course Content is required";
          isValid = false;
        }
      
        setErrors(newErrors);
        return isValid;
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Validation failed.");
            return; // Stop form submission
        }

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/courses/create`; // Your API endpoint
        let subMissionErrors = {};
      
        try {
            const updatedCourse = {
                ...course,
                status: 1, // Add or update the status key with the desired value
                rating: 0,
                total_enrollments: 0
              };

          const response = await fetch(apiUrl, {
            method: 'POST', // or 'PUT' if you are updating an existing record
            headers: {
              'Content-Type': 'application/json',
              // Include other headers as needed, like authorization tokens
            },
            body: JSON.stringify(updatedCourse), // Convert the course state to a JSON string
          });
      
          if (!response.ok) {
            //console.log(await response.json());
            // Handle response errors
            const message = `An error has occurred: ${response.statusText}`;
            subMissionErrors.create_error = message;
            setErrors(subMissionErrors);
            return false;
          }
          window.location.href = '/dashboard/courses';
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
        Add Course
        </Typography>
        <NavLink to={`/dashboard/courses`}>
        <Button
        variant="contained"
        color="lightBlue" // You can choose the color that matches your design
        className="ml-4" // Add margin left if needed, adjust according to your spacing requirements
        // Add additional Tailwind classes as needed for styling
        >
        List Courses
        </Button>
        </NavLink>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <div className="mb-10 flex items-center justify-between">
            <form className="mt-8 mb-2 mx-auto w-180 max-w-screen-lg w-full" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Course Title
                        </label>
                        <Input
                            name="title"
                            placeholder=""
                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={handleChange}
                        />  
                        { !!errors.title ? <p class="text-red-500 text-xs italic">Please enter a valid title.</p> : <></> }
                    </div>             
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Course Description
                        </label>
                        <Textarea name="description" onChange={handleChange} />
                        <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                    </div>             
                </div>     
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Learning Outcomes
                        </label>
                        <Textarea name="learning_outcomes" onChange={handleChange} />
                        <p className="text-gray-600 text-xs italic">One item per line</p>
                    </div>             
                </div> 
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Course Inclusions
                        </label>
                        <Textarea name="course_inclusions" onChange={handleChange} />
                        <p className="text-gray-600 text-xs italic">One item per line</p>
                    </div>             
                </div> 
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Author Name
                        </label>
                        <Input
                            name="author"
                            placeholder=""
                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={handleChange}
                        />                      
                    </div>   
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Course Price
                        </label>
                        <Input
                            name="price"
                            placeholder=""
                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={handleChange}
                        />       
                        { !!errors.price ? <p class="text-red-500 text-xs italic">Enter a valid price.</p> : <></> }               
                    </div>   
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">                               
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">Show ON Header</label>
                        <Switch
                        name="is_certified"
                        checked={course.is_certified}
                          label={"Yes Promoting Now"}
                          defaultChecked={true}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                          onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Course Content/Material
                        </label>
                        <Input
                        name="course_content"
                            placeholder=""
                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={handleChange}
                        />  
                        { !!errors.course_content ? <p class="text-red-500 text-xs italic">Please enter a valid content.</p> : <></> }
                    </div>  
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
    
    export default Courses;
    