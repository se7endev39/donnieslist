import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import { Modal, Button } from 'react-bootstrap';

class SendEmail extends Component {

	/* Class constructor */
	constructor(props, context) {
		super(props, context);
	}

  render() {
		return (
			<Modal className="modal-container"
				show={this.state.showModal}
				onHide={this.close}
				animation={true}
				bsSize="large">
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
