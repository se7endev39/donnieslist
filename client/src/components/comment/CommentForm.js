// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentForm = props => (
  <form onSubmit={ props.submitComment }>
    {/* <input
      type="text"
      name="author"
      placeholder="Your name…"
      value={props.author}
      onChange={props.handleChangeText}
    /> */}
    <div className="input-column">
      <div className="image-wrapper">
        <img src="/src/public/img/person.jpg" className="comment-user"/>
      </div>
    </div>
    <div className="input-column full-width">
      <div className="input-row">
        <textarea
          name="text"
          rows="1"
          maxLength="10000"
          placeholder="Add a public comment..."
          autocomplete="off"
          value={ props.text }
          onChange={ props.handleChangeText }
          onFocus={ (e) => props.handleFocus(true) }
        />
      </div>
      {
        props.showCommentButton ? (
          <div className="input-row">
            <div className="button-wrapper">
              <button className="button-cancel" onClick={ (e) => props.handleFocus(false) }>Cancel</button>
              <button type="submit">Comment</button>
            </div>
          </div>
        ) : null
      }
    </div>
  </form>
)

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  text: PropTypes.string,
  author: PropTypes.string,
  showCommentButton: PropTypes.boolean
}

CommentForm.defaultProps = {
  text: '',
  author: '',
}

export default CommentForm;
