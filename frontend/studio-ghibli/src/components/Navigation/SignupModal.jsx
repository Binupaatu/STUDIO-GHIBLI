
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";

const SignUpModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    phone_no:"",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const signUpUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error during signup:", error);
      setSnackbarMessage("Signup failed. Please try again.");
      setSnackbarOpen(true);
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
