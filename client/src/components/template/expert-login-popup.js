import React, { useState } from "react";

const ExpertLoginPopup = (props) => {
  const [state, setState] = useState({ show: props.showStatus });

  const handleClose = () => {
    setState({ ...state, show: false });
  };

  return (
    <div show={state.show} onHide={handleClose}>
      Hello Donny
    </div>
  );
};

export default ExpertLoginPopup;