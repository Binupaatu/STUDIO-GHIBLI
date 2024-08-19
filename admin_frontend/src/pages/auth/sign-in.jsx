import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export function SignIn() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setAuthenticated] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const loginCredentials = {
      email,
      password,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json(); // Assuming the response contains the auth token
      localStorage.setItem('authToken', data.token); // Save the token in local storage
      navigate("/dashboard/home",{ replace: true }); // Redirect after successful login
      window.location.href = '/dashboard/courses';

    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
    }
  };
  
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p>{error}</p>}
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;