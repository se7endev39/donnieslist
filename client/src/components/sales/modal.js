import React from "react";

const Modal = (props) => {
  return (
    <div className={`modal ${props.isOpen ? "is-open" : ""}`}>
      <div className="modal-container">
        <div className="modal-content">
          <i
            onClick={() => {
              props.handleClose();
            }}
            className="material-icons close"
          >
            close
          </i>
          <h3>{props.heading}</h3>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
