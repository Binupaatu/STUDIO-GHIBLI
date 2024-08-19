import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { AppRegistration, Star, StarHalf } from "@mui/icons-material";
import styled from "styled-components";
import LoginModal from "../Navigation/LoginModal";
import CreditCard from "../Utilities/CreditCard";
import StarRating from "../Utilities/StarRating";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 37.5rem;
  min-width: 17.3rem;
  color: #1c1d1f;
`;

const CourseImgWrapper = styled.div`
  width: 100%;
`;

const CourseImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
`;

const CourseTextWrapper = styled.div`
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.4;
  width: 100%;
`;

const CourseTitle = styled.h3`
  font-size: 1.6rem;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin-top: 0.8rem;
  margin-bottom: 0.4rem;
  letter-spacing: -0.02rem;
  font-weight: 700;
  line-height: 1.2;
`;

const CourseDes = styled.div`
  height: 18px;
  font-size: 1.2rem;
  line-height: 1.4;
  margin: 0;
  margin-bottom: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CourseRateWrapper = styled.div`
  display: flex;
  margin-bottom: 0.4rem;
`;

const CourseRateScore = styled.span`
  margin-right: 0.4rem;
  color: #b4690e;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02rem;
  font-size: 1.4rem;
`;

const CourseRateStars = styled.div`
  display: flex;
  align-items: center;
`;

const CourseRateReviewerNum = styled.span`
  color: #6a6f73;
  margin-left: 0.4rem;
  font-weight: 400;
  line-height: 1.4;
  font-size: 1.2rem;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
`;

const CrossOffPrice = styled.p`
  text-decoration: line-through;
  color: #787878;
  font-weight: 500;
  font-size: 1.4rem;
`;

const CoursePrice = styled.div`
  letter-spacing: -0.02rem;
  font-size: 1.6rem;
  font-weight: 700;
`;

const Course = ({ item }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [courseDetails, setCourseDetails] = useState([]);

  const cardFormRef = useRef(null);

  const [formValues, setFormValues] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [courseId, setCourseId] = useState("");

  const handleCardFormChange = (data) => {
    setFormValues({ ...formValues, ...data });
  };

  const handleEnrollClick = () => {
    if (null != localStorage.getItem("authToken")) {
      setDialogOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const onItemClick = (e, id) => {
    if (id) {
      fetchCourseDetails(id);
      setCourseId(id);
    }
    setDialogOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handlePayAndEnroll = (id) => {
    if (0 != id) {
      setCourseId(id);
    }
    setDialogOpen(false);
    setPaymentDialogOpen(true);
  };

  const handlePaymentComplete = async () => {
    const formData = { course_id: courseId, payment_method: "card" };
    const apiResponse = await postEnrollCourse(formData);
    if (apiResponse.ok) {
      setPaymentDialogOpen(false);
      setPaymentComplete(true);
    } else {
      alert(
        "Something went wrong !! Your enrollment attempt was not successful!"
      );
    }
  };

  const postEnrollCourse = async (data) => {
    const apiUrl = await `${process.env.REACT_APP_API_BASE_URL}/api/enrollment`; // Your API endpoint
    const authToken = localStorage.getItem("authToken");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    return response;
  };

  const fetchCourseDetails = async (id) => {
    const apiUrl =
      await `${process.env.REACT_APP_API_BASE_URL}/api/courses/${id}`; // Your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setCourseDetails(data.data))
      .catch((error) => console.error("Failed to fetch data:", error));
  };

  return (
    <>
      <Container>
        <CourseImgWrapper>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onItemClick(item.id);
            }}
          >
            <CourseImg src={"https://fakeimg.pl/1430x810"} alt={item.title} />
          </a>
        </CourseImgWrapper>

        <CourseTextWrapper>
          <CourseTitle>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onItemClick(event, item.id);
              }}
            >
              {item.title}
            </a>
          </CourseTitle>
          <CourseDes>{item.description}</CourseDes>

          <CourseRateWrapper>
            <CourseRateScore>{item.rateScore}</CourseRateScore>
            <CourseRateStars>
              <StarRating rating={item.rating}></StarRating>
            </CourseRateStars>
            <CourseRateReviewerNum>
              ({item.total_enrollments})
            </CourseRateReviewerNum>
          </CourseRateWrapper>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <PriceWrapper>
              {item.onSale ? (
                <>
                  <CoursePrice>€{item.onSalePrice}</CoursePrice>
                  &nbsp;&nbsp;
                  <CrossOffPrice>€{item.price}</CrossOffPrice>
                </>
              ) : (
                <CoursePrice>€{item.price}</CoursePrice>
              )}
            </PriceWrapper>

            <button
              onClick={() => handlePayAndEnroll(item.id)}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                cursor: "pointer",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#1c1d1f",
                color: "white",
              }}
            >
              Enroll <AppRegistration sx={{ fontSize: 15 }} />
            </button>
          </div>
        </CourseTextWrapper>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              padding: "40px",
              minWidth: "40%",
              maxWidth: "600px",
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)",
            },
          }}
        >
          <DialogTitle
            style={{
              color: "#333",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "600",
                paddingBotom: "10px",
              }}
            >
              {courseDetails.title}
            </Typography>

            <div
              style={{
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <small style={{ fontSize: "12px" }}>
                <b>Author: </b>
              </small>
              <span style={{ fontSize: "1.3rem" }}>{courseDetails.author}</span>{" "}
              |
              <small>
                <b> Total Enrollments: </b>
              </small>
              <span style={{ fontSize: "1.3rem" }}>
                {courseDetails.total_enrollments}
              </span>{" "}
              |
              <small>
                <b> Rating: </b>
              </small>
              <span style={{ fontSize: "1.3rem" }}>
                <StarRating rating={item.rating}></StarRating>
              </span>{" "}
            </div>
          </DialogTitle>
          <DialogContent
            dividers
            style={{
              backgroundColor: "#f9f9f9",
              color: "#333",
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            <p>
              <small>Description:</small>
            </p>
            <p>{courseDetails.description}</p>
            <p>
              <small>Learning Outcome:</small>
            </p>
            <p>{courseDetails.learning_outcomes}</p>
            <p>
              <small>Course Inclusions:</small>
            </p>
            <p>{courseDetails.course_inclusions}</p>
          </DialogContent>
          <DialogActions
            style={{
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleCloseDialog}
              color="primary"
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handlePayAndEnroll(0)}
              color="primary"
              variant="contained"
            >
              PAY and ENROLL
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          PaperProps={{
            style: {
              borderRadius: "20px",
              padding: "24px",
              minWidth: "320px",
            },
          }}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            <h1>Enter your payment details</h1>
            <small>please input your information below</small>
          </DialogTitle>
          <DialogContent>
            <form
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <CreditCard handleChange={handleCardFormChange} />
              </div>
              <div>
                <p>
                  Your total amount is:{" "}
                  <strong>
                    €{item.onSale ? item.onSalePrice : item.price}
                  </strong>
                </p>
              </div>
            </form>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={() => setPaymentDialogOpen(false)}
              color="primary"
              variant="outlined"
              style={{ margin: "0 8px" }}
            >
              Close
            </Button>
            <Button
              onClick={handlePaymentComplete}
              color="primary"
              variant="contained"
              style={{ margin: "0 8px" }}
            >
              Complete Payment
            </Button>
          </DialogActions>
        </Dialog>

        {paymentComplete && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "clamp(300px, 50%, 500px)",
              textAlign: "center",
            }}
          >
            <svg
              style={{ height: "64px", marginBottom: "20px" }}
              fill="#4caf50"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h2
              style={{
                margin: "0 0 20px 0",
                fontSize: "24px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Payment Complete!
            </h2>
            <p
              style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}
            >
              Your payment has been successfully processed.
            </p>
            <Button
              onClick={() => setPaymentComplete(false)}
              color="primary"
              autoFocus
              style={{
                backgroundColor: "#4caf50",
                padding: "10px 20px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#43a047",
                },
              }}
            >
              Close
            </Button>
          </div>
        )}
      </Container>
      <LoginModal
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    </>
  );
};

export default Course;
