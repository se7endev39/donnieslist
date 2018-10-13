// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentReply = props => (
  <form onSubmit={ props.submitReply }>
    <div className="input-column">
      <div className="image-wrapper">
        <img src="/src/public/img/person.jpg" className="reply-user"/>
      </div>
    </div>
    <div className="input-column full-width">
      <div className="input-row">
        <input id="commentId" type="hidden" value={ props.commentId }/>
        <input id="replyId" type="hidden" value={ props.id }/>
        <textarea
          name="reply_text"
          rows="1"
          maxLength="10000"
          placeholder="Add a public reply..."
          autocomplete="off"
          onChange={ props.handleChangeText }
        />
      </div>
      <div className="input-row">
        <div className="button-wrapper">
          <button className="button-cancel button-reply" onClick={ (e) => props.handleReply(props.id, false) }>Cancel</button>
          <button className="button-reply" type="submit">Reply</button>
        </div>
      </div>
    </div>
  </form>
)

CommentReply.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  author: PropTypes.string,
  commentId: PropTypes.string.isRequired,
  submitReply: PropTypes.func.isRequired,
  handleReply: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
}

CommentReply.defaultProps = {
  id: '',
  text: '',
  author: '',
  commentId: null
}

export default CommentReply;
