import React from "react";

import CheckoutForm from "./checkout-form";

const InitialCheckout = (props) => {
  return <CheckoutForm plan={props.params.plan} />;
};

export default InitialCheckout;
