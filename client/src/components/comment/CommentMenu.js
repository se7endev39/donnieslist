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
    onSelect={ (eKey, e) => eKey == 1 ? props.handleUpdateComment(e, true) : props.handleDeleteComment(e) }
  >
    <MenuItem eventKey="1">Edit</MenuItem>
    <MenuItem eventKey="2">Delete</MenuItem>
  </DropdownButton>
);

CommentMenu.propTypes = {
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
};

export default CommentMenu;
