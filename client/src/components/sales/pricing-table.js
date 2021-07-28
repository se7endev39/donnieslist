import React from "react";
import { Link } from "react-router-dom";

const PricingTable = (props) => {
  const componentStyle = {
    backgroundColor: props.color || "#5BC0DE",
    color: props.fontColor || "#FFF",
  };
  return (
    <div className="pricing-table">
      <div className="col-md-4 col-sm-6 col-xs-12 float-shadow">
        <div className="price_table_container">
          <div className="price_table_heading">{props.planName}</div>
          <div className="price_table_body">
            <div className="price_table_row cost" style={componentStyle}>
              <strong>{props.price}</strong>
              <span>/MONTH</span>
            </div>
            {props.features.map((data, index) => (
              <div key={`${data}-${index}`} className="price_table_row">
                {data}
              </div>
            ))}
          </div>
          <Link
            to={`checkout/${props.planName.toLowerCase()}`}
            className="btn btn-lg btn-block"
            style={componentStyle}
          >
            Subscribe!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
