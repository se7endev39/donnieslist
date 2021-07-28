import React from "react";

const CommentNew = (props) => (
  <form
    onSubmit={(e) => {
      props.handleSubmitComment(e);
    }}
  >
    <div className="input-column">
      <div className="image-wrapper">
        <img
          role="presentation"
          alt="presentation"
          src="/img/person.jpg"
          className="comment-user"
        />
      </div>
    </div>
    <div className="input-column full-width">
      <div className="input-row">
        <textarea
          name="text"
          rows="1"
          maxLength="10000"
          placeholder="Add a public comment..."
          autoComplete="off"
          value={props.text}
          onChange={(e) => {
            props.handleChangeText(e.target.value);
          }}
          onFocus={() => {
            props.handleShowButton(true, null);
          }}
          onBlur={() => {
            props.text.length === 0
              ? props.handleShowButton(false, null)
              : props.handleShowButton(true, null);
          }}
        />
      </div>
      {props.showButton && (
        <div className="input-row">
          <div className="button-wrapper">
            <button
              className="button-cancel"
              onClick={() => props.handleShowButton(false, "cancel")}
            >
              Cancel
            </button>
            <button type="submit">Comment</button>
          </div>
        </div>
      )}
    </div>
  </form>
);

export default CommentNew;
