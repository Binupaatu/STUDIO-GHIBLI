import React, { useState, useRef, forwardRef } from "react";
import ReactDOM from "react-dom";
import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "../../utils";
import { Grid, TextField, Typography } from "@mui/material";

const CreditCard = forwardRef((props) => {
  const [state, setState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formData: null,
  });

  const formRef = useRef(null);

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setState({ ...state, issuer });
    }
  };

  const handleInputFocus = ({ target }) => {
    setState({ ...state, focused: target.name });
  };

  const handleInputChange = ({ target }) => {
    let value = target.value;
    if (target.name === "number") {
      value = formatCreditCardNumber(value);
    } else if (target.name === "expiry") {
      value = formatExpirationDate(value);
    } else if (target.name === "cvc") {
      value = formatCVC(value);
    }

    setState({ ...state, [target.name]: value });
    props.handleChange(state);
  };

  const handleSubmit = () => {
    props.handleSubmitForm(state);
    formRef.current.reset();
  };

  return (
    <div key="Payment">
      <div className="App-payment">
        <Card
          number={state.number}
          name={state.name}
          expiry={state.expiry}
          cvc={state.cvc}
          focused={state.focused}
          issuer={state.issuer}
          callback={handleCallback}
        />
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{ margin: "20px 0 20px" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Name:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                variant="outlined"
                placeholder="Enter your name"
                pattern="[a-z A-Z-]+"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Card Number:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="number"
                variant="outlined"
                placeholder="Card Number"
                pattern="[\d| ]{16,22}"
                maxLength="19"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Expiry Date:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="expiry"
                type="tel"
                variant="outlined"
                placeholder="Valid Thru"
                pattern="\d\d/\d\d"
                maxLength="19"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">CVC:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="cvc"
                type="tel"
                variant="outlined"
                placeholder="CVC"
                pattern="\d{3}"
                maxLength="19"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            {/* Add more label-input pairs as needed */}
          </Grid>
          <input type="hidden" name="issuer" value={state.issuer} />
        </form>
      </div>
    </div>
  );
});

export default CreditCard;
