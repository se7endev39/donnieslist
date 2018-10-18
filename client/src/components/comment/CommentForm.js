// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentForm = props => (
  <form onSubmit={ props.submitComment }>
    {
      props.updateId != props.id ? (
        <div className="input-column">
          <div className="image-wrapper">
            <img className="reply-user" src="/src/public/img/person.jpg"/>
          </div>
        </div>
      ) : null
    }
    <div className="input-column full-width">
      <div className="input-row">
        <input id="parentId" name="parentId" type="hidden" value={ props.parentId }/>
        <textarea
          name="text"
          maxLength="10000"
          autocomplete="off"
          value={ props.text }
          rows={ props.text ? props.text.split('\n').length : 1 }
          placeholder={ props.placeholder }
          onChange={ (e) => props.handleChangeText(e) }
        />
      </div>
      <div className="input-row">
        <div className="button-wrapper">
          <button className="button-cancel button-reply" onClick={ (e) => props.handleSetComment(e, null, '') }>Cancel</button>
          <button className="button-reply" type="submit">{ props.buttonName }</button>
        </div>
      </div>
    </div>
  </form>
)

CommentForm.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  buttonName: PropTypes.string,
  placeholder: PropTypes.string,
  author: PropTypes.string,
  updateId: PropTypes.string,
  parentId: PropTypes.parentId,
  commentId: PropTypes.string.isRequired,
  submitComment: PropTypes.func.isRequired,
  handleSetComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
}

CommentForm.defaultProps = {
  id: '',
  text: '',
  author: '',
  commentId: null
}

export default CommentForm;
