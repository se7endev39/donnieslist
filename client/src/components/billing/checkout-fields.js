import React from "react";

const CheckoutFields = (props) => {
  return (
    <form
      onSubmit={(e) => {
        props.onSubmit(e);
      }}
    >
      <div className="row">
        <div className="col-md-9">
          <label>Card Number</label>
          <input
            id="cardNumber"
            className="form-control"
            onChange={(e) => {
              props.handleChange(e);
            }}
            value={props.formState.cardNumber}
            autoComplete="off"
          />
        </div>

        <div className="col-md-3">
          <label>CVC</label>
          <input
            id="cvc"
            className="form-control"
            onChange={(e) => {
              props.handleChange(e);
            }}
            value={props.formState.cvc}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label>Expiration Month (MM)</label>
          <input
            id="expMonth"
            className="form-control"
            onChange={(e) => {
              props.handleChange(e);
            }}
            value={props.formState.expMonth}
            autoComplete="off"
          />
        </div>

        <div className="col-md-6">
          <label>Expiration Year (YYYY)</label>
          <input
            id="expYear"
            className="form-control"
            onChange={(e) => {
              props.handleChange(e);
            }}
            value={props.formState.expYear}
            autoComplete="off"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Get Started!
      </button>
    </form>
  );
};

export default CheckoutFields;
