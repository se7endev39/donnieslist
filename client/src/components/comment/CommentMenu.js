// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';

const CommentMenu = props => (
  <DropdownButton
    id="comment-menu"
    title=""
    bsStyle="custom"
    noCaret
    onSelect={ (eKey, e) => eKey == 1 ? props.handleUpdateComment(e, props.id, props.text) : props.handleDeleteComment(e, props.id) }
  >
    <MenuItem eventKey="1">Edit</MenuItem>
    <MenuItem eventKey="2">Delete</MenuItem>
  </DropdownButton>
)

CommentMenu.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired
}

CommentMenu.defaultProps = {
  id: null
}

export default CommentMenu;
