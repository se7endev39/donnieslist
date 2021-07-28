import React from "react";

const CommentForm = (props) => (
  <form onSubmit={(e) => {props.handleSubmitComment(e)}}>
    {props.formType === "form_reply" && (
      <div className="input-column">
        <div className="image-wrapper">
          <img
            className="reply-user"
            alt="reply user"
            src="/img/person.jpg"
          />
        </div>
      </div>
    )}
    <div className="input-column full-width">
      <div className="input-row">
        <textarea
          name="text"
          maxLength="10000"
          autoComplete="off"
          value={props.text}
          rows={props.text ? props.text.split("\n").length : 1}
          placeholder={props.placeholder}
          onChange={(e) => props.handleChangeText(e.target.value)}
        />
      </div>
      <div className="input-row">
        <div className="button-wrapper">
          <button
            className="button-cancel button-reply"
            onClick={(e) => props.handleShowForm(e, false)}
          >
            Cancel
          </button>
          <button className="button-reply" type="submit">
            {props.buttonName}
          </button>
        </div>
      </div>
    </div>
  </form>
);

export default CommentForm;
