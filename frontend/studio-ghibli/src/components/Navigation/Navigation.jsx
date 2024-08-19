import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignupModal";
import MenuButton from "../../share/UIElements/MenuButton/MenuButtom";
import RightTooltip from "./RightTooltip/RightTooltip";
import SearchBar from "./SearchBar/SearchBar";
import CartTooltip from "./CartTooltip/CartTooltip";
import Categories from "./Categories/Categories";
import { AppRegistration, Person } from "@mui/icons-material";

const Navigation = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleSignUpClick = () => {
    setSignUpModalOpen(true);
  };

  const handleSignUpModalClose = () => {
    setSignUpModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    setSnackbarMessage("You are logged out!");
    setSnackbarOpen(true);
  };

  // Styled tooltip wrappers
  const RightTooltipWithStyle = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "transparent",
      color: theme.palette.grey[900],
      borderRadius: 0,
      padding: 0,
    },
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          height: "7.2rem",
          px: "2.4rem",
          boxShadow: "0 2px 4px rgb(0 0 0 / 8%), 0 4px 12px rgb(0 0 0 / 8%)",
        }}
      >
        <Toolbar
          disableGutters
          sx={{ my: "auto", gap: 1, alignItems: "center" }}
        >
          {/* Studio Ghibli Logo */}
          <Box
            sx={{
              bgcolor: "#000000", // Use theme's primary color
              color: "white", // Text color
              fontWeight: "bold",
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "20px", // Rounded corners
              width: "200px", // Fixed width
              height: "100px", // Fixed height
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
              "&:hover": {
                // Hover effect
                backgroundColor: "primary.dark", // Darken on hover
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", // Larger shadow on hover
              },
              userSelect: "none", // Prevent text selection
              transition: "all 0.3s ease-in-out", // Smooth transition for hover effects
              cursor: "pointer", // Change cursor to indicate interactivity
            }}
          >
            Studio Ghibli
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
          </Box>
          <MenuButton>
            <RightTooltipWithStyle
              title={<CartTooltip />}
              placement="bottom-end"
            >
              <Person sx={{ fontSize: 24 }} />
            </RightTooltipWithStyle>
          </MenuButton>
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="text"
              sx={{
                color: "blue",
                fontSize: "1.4rem",
                height: "4rem",
                minWidth: "8rem",
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                onClick={handleLoginClick}
                variant="text"
                sx={{
                  border: "1px solid #000000",
                  color: "#000000",
                  fontSize: "1.4rem",
                  borderRadius: 0,
                  textTransform: "none",
                }}
              >
                Log in
              </Button>
              <Button
                onClick={handleSignUpClick}
                variant="text"
                sx={{
                  border: "1px solid #000000",
                  color: "#ffffff",
                  fontSize: "1.4rem",
                  borderRadius: 0,
                  textTransform: "none",
                  bgcolor: "#000000",
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <LoginModal
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
      <SignUpModal
        open={signUpModalOpen}
        handleClose={handleSignUpModalClose}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => setSnackbarOpen(false)}
          >
            Close
          </Button>
        }
      />
    </Box>
  );
};

export default Navigation;
