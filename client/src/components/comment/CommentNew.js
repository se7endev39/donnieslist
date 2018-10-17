// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentNew = props => (
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
    <input type="hidden" name="parentId" id="parentId" value={ props.id }/>
    {
      props.commentId == props.id ? (
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
              onFocus={ (e) => props.handleSetComment(e, props.id, '') }
            />
          </div>
          <div className="input-row">
            <div className="button-wrapper">
              <button className="button-cancel" onClick={ (e) => props.handleSetComment(e, null, '') }>Cancel</button>
              <button type="submit">Comment</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="input-column full-width">
          <div className="input-row">
            <textarea
              name="text"
              rows="1"
              maxLength="10000"
              placeholder="Add a public comment..."
              autocomplete="off"
              value=""
              onFocus={ (e) => props.handleSetComment(e, props.id, '') }
            />
          </div>
        </div>
      )
    }
  </form>
)

CommentNew.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  author: PropTypes.string,
  commentId: PropTypes.string,
  handleChangeText: PropTypes.func.isRequired,
  handleSetComment: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired
}

CommentNew.defaultProps = {
  text: '',
  author: '',
}

export default CommentNew;
