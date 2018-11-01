// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const CommentModal = props => (
  <Modal
    className="modal-container"
    show={ !!props.showModal }
    onHide={ props.handleModalClose }
    animation={ true }
    bsSize=""
  >
    <Modal.Header>
      { props.title }
    </Modal.Header>
    <Modal.Body>
      <div>{ props.text }</div>
    </Modal.Body>
    <Modal.Footer>
      {
        props.showModal === 'need_login' ? (
          <Button onClick={ props.handleModalLogin }>Login</Button>
        ) : null
      }
      <Button onClick={ props.handleModalClose }>Close</Button>
    </Modal.Footer>
  </Modal>
);

CommentModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  showModal: PropTypes.string,
  handleModalClose: PropTypes.func.isRequired,
  handleModalLogin: PropTypes.func.isRequired,
};

CommentModal.defaultProps = {
  title: '',
  text: '',
};

export default CommentModal;
