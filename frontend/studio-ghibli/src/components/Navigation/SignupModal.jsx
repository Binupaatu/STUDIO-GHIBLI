import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api';
import React, { useState } from "react";

const SignUpModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    phone_no:"",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  //const tracer = useTracer();  // Use the tracer hook inside the component

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const signUpUser = async () => {
    const tracer = trace.getTracer('frontend');
    const span = tracer.startSpan('User Signup');
    try {
       // Set the span as the active span in the current context
    const activeContext = trace.setSpan(context.active(), span);
    const carrier = {};
    // Inject the current context (which includes the active span) into the carrier (headers)
    propagation.inject(activeContext, carrier);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...carrier, // Include the trace context in the headers
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password,
            phone_no: formData.phone_no,
            status: 1,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      const data = await response.json();
      console.log("Signup successful:", data);
      setSnackbarMessage("Signup successful!");
      span.setStatus({ code: SpanStatusCode.OK });
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error during signup:", error);
      setSnackbarMessage("Signup failed. Please try again.");
      setSnackbarOpen(true);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });

    }finally {
      span.end();
      }
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signUpUser();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="full_name"
              label="Full Name"
              type="text"
              fullWidth
              value={formData.full_name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="phone_no"
              label="Phone Number"
              type="text"
              fullWidth
              value={formData.phone_no}
              onChange={handleChange}
            />
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" style={{ marginLeft: 10 }}>
                Sign Up
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default SignUpModal;