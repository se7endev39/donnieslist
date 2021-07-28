import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

const CommentMenu = (props) => {
  const openDropdown = (e) => {
    window.$(".dropdown-menu").css("display", "block")
  }
  return(
    <DropdownButton
      id="comment-menu"
      onClick={() => {openDropdown()}}
      title=""
      // bsStyle="custom"
      noCaret
      onSelect={(eKey, e) =>
        eKey === 1
          ? props.handleUpdateComment(e, true)
          : props.handleDeleteComment(e)
      }
    >
      <MenuItem eventKey="1">Edit</MenuItem>
      <MenuItem eventKey="2">Delete</MenuItem>
    </DropdownButton>
  );
}

export default CommentMenu;
