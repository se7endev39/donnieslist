import React from "react";

const RotatorItem = (props) => {
  return (
    <div className="slide">
      {props.selectedSlide.map((rotator, index) => (
        <div className="rotator-item" key={`${index}-${rotator.headline}`}>
          <img className="rotator-image" src={rotator.img} alt="Rotor" />
          {rotator.headline ? `<h3>${rotator.headline}</h3>` : ""}
          <div className="rotator-text-container">
            <p className="rotator-text">{rotator.text}</p>
            <p className="rotator-author">{rotator.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RotatorItem;
