import { Star, StarHalf } from "@mui/icons-material";
import React from "react";

const StarRating = ({ rating }) => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <React.Fragment key={index}>
          {index + 1 <= rating ? (
            <Star style={{ color: "#e59819" }} />
          ) : index + 1 - rating < 1 ? (
            <StarHalf style={{ color: "#e59819" }} />
          ) : (
            <Star style={{ color: "gray" }} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default StarRating;
