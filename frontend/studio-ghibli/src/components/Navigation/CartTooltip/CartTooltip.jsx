// import { useEffect, useState } from "react";
// import TooltipCard from "../TooltipCard/TooltipCard";
// import { TextContainer, LinkContainer } from "./CartTooltip.styles";

// const CartTooltip = () => {
//   const [userEnrollments, setUserEnrollments] = useState([]);
//   useEffect(() => {
//     const enrolledCourses = fetchEnrolledCoursesCourses();
//     setUserEnrollments(enrolledCourses);
//   }, []);

// const fetchEnrolledCoursesCourses = async () => {
//   const authToken = localStorage.getItem("authToken");
//   try {
//     const response = await fetch(
//       `${process.env.REACT_APP_API_BASE_URL}/api/enrollment/user/enrollments?order_by=id&sort=desc`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error("Login failed");
//     }
//     const data = await response.json();
//   } catch (error) {
//     console.error("Error during login:", error);
//     alert("Unable to load the data, try login again");
//   }
// };

//   return (
//     <TooltipCard marginTop="3rem">
//       {null == userEnrollments ? (
//         <TextContainer>Your cart is empty.</TextContainer>
//       ) : (
//         <>
//           <TextContainer>Your items.</TextContainer>
//           <LinkContainer>Keep shopping</LinkContainer>
//         </>
//       )}
//     </TooltipCard>
//   );
// };

// export default CartTooltip;

// import React, { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
// import TooltipCard from "../TooltipCard/TooltipCard";
// import { TextContainer, LinkContainer } from "./CartTooltip.styles";

// const CartTooltip = () => {
//   const [userEnrollments, setUserEnrollments] = useState([]);
//   const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Function to fetch user enrollments from API
//     const fetchUserEnrollments = async () => {
//       const authToken = localStorage.getItem("authToken");
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_BASE_URL}/api/enrollment/user/enrollments?order_by=id&sort=desc`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Login failed");
//         }
//         const data = await response.json();
//         setUserEnrollments(data.data);
//         setLoading(false)
//       } catch (error) {
//         console.error("Error during login:", error);
//         alert("Unable to load the data, try login again");
//       }
//     };

//     fetchUserEnrollments(); // Call the fetch function when component mounts
//   }, []); // Empty dependency array ensures this effect runs only once on mount

//   const handleTitleClick = (courseContentUrl) => {
//     setSelectedVideoUrl(courseContentUrl);
//   };

//   const handleClose = () => {
//     setSelectedVideoUrl(null);
//   };

//   return (
//     <div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <TooltipCard marginTop="3rem">
//           {userEnrollments.length === 0 ? (
//             <TextContainer>Your cart is empty.</TextContainer>
//           ) : (
//             <>
//               <TextContainer>Your items:</TextContainer>
//               <ul>
//                 {userEnrollments.map((enrollment, index) => (
//                   <li
//                     key={index}
//                     onClick={() => handleTitleClick(enrollment.course_content)}
//                   >
//                     {enrollment.title}
//                   </li>
//                 ))}
//               </ul>
//               <LinkContainer>Keep shopping</LinkContainer>
//             </>
//           )}
//         </TooltipCard>
//       )}
//       <Dialog open={selectedVideoUrl !== null} onClose={handleClose}>
//         <DialogTitle>Video</DialogTitle>
//         <DialogContent>
//           <iframe
//             width="560"
//             height="315"
//             src={selectedVideoUrl}
//             frameborder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowfullscreen
//           ></iframe>
//           <Button onClick={handleClose}>Close</Button>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CartTooltip;

import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  ListSubheader,
} from "@mui/material";

const CartTooltip = () => {
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserEnrollments = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/enrollment/user/enrollments?order_by=id&sort=desc`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Login failed");
        }
        const data = await response.json();
        setUserEnrollments(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error during login:", error);
        alert("Unable to load the data, try login again");
      }
    };

    fetchUserEnrollments();
  }, []);

  const handleListItemClick = (courseContentUrl) => {
    setSelectedVideoUrl(courseContentUrl);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setSelectedVideoUrl(null);
    setDialogOpen(false);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <List
          sx={{ bgcolor: "#FFFFFF" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Enrolled Courses
            </ListSubheader>
          }
        >
          {userEnrollments.map((enrollment, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleListItemClick(enrollment.course_content)}
            >
              <ListItemText
                primary={enrollment.title}
                secondary={enrollment.description}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Video</DialogTitle>
        <DialogContent>
          <iframe
            width="560"
            height="315"
            src={selectedVideoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <Button onClick={handleClose}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartTooltip;
