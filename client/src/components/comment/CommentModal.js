import React from "react";
import { Modal, Button } from "react-bootstrap";

const CommentModal = (props) => (
  <Modal
    className="modal-container"
    show={props.showModal}
    onHide={props.handleModalClose}
    animation={true}
  >
    <Modal.Header>{props.title}</Modal.Header>
    <Modal.Body>
      <div>{props.text}</div>
    </Modal.Body>
    <Modal.Footer>
      {props.showModal === true && (
        <Button onClick={() => {props.handleModalLogin()}}>Login</Button>
      )}
      <Button onClick={() => {props.handleModalClose()}}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default CommentModal;
