import React, { useState } from "react";

import RotatorItem from "./rotator-item";
import RotatorNav from "./rotator-nav";

const Rotator = (props) => {
  const [state, setState] = useState({ index: 0 });

  const setPage = (e) => {
    setState({ index: e.target.value });
  };

  const selectedSlide = () => {
    return props.rotators.filer((slider, index) => {
      if (index === state.index) return slider;
    });
  };

  return (
    <div className="rotator-container">
      <RotatorItem selectedSlide={selectedSlide()} />
      <RotatorNav
        length={props.rotators.length}
        active={state.index}
        setPage={(e) => {
          setPage(e);
        }}
      />
    </div>
  );
};

export default Rotator;
