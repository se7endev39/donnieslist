import React, { Component } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { API_URL } from "../constants/api";
import { Modal, Button } from "react-bootstrap";

class SendEmail extends Component {
  render() {
    return (
      <Modal
        className="modal-container"
        show={this.state.showModal}
        onHide={this.close}
        animation={true}
        bsSize="large"
      >
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.modalMessageNotAuthorized}</Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SendEmail;
