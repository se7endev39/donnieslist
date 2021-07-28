import React from "react";

const RotatorNav = (props) => {
  const renderNav = () => {
    const toMap = [];
    for (let i = 0; i < props.length; i++) {
      toMap.push(
        <li
          key={`${i}nav`}
          value={i}
          className={
            i === props.active
              ? "slider-nav-bullet active"
              : "slider-nav-bullet"
          }
          onClick={(e) => {
            props.setPage(e);
          }}
        />
      );
    }
    return toMap;
  };
  return <ul>{renderNav()}</ul>;
};

export default RotatorNav;
