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

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  //const tracer = useTracer();  // Use the tracer hook inside the component

  const loginUser = async (email, password) => {
    const tracer = trace.getTracer('frontend');
    const span = tracer.startSpan('User Login');

    try {
      // Set the span as the active span in the current context
    const activeContext = trace.setSpan(context.active(), span);
    
    const carrier = {};
    
    // Inject the current context (which includes the active span) into the carrier (headers)
    propagation.inject(activeContext, carrier);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...carrier, // Include the trace context in the headers

          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      if (data) {
        localStorage.setItem("authToken", data.token);
        setSnackbarMessage("You are logged in!");
        setSnackbarOpen(true);
        span.setStatus({ code: SpanStatusCode.OK });
        onLoginSuccess();
      } else {
        setSnackbarMessage("Login failed. Please try again.");
        setSnackbarOpen(true);
      }
      handleClose();
    } catch (error) {
      console.error("Error during login:", error);
      setSnackbarMessage("Login failed. Please try again.");
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });

      setSnackbarOpen(true);
    }finally {
      span.end();
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(email, password);
    setEmail("");
    setPassword("");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transitionDuration={500}
      />
    </div>
  );
};

export default LoginModal;