// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentNew = props => (
  <form onSubmit={ props.handleSubmitComment }>
    <div className="input-column">
      <div className="image-wrapper">
        <img role="presentation" src="/src/public/img/person.jpg" className="comment-user"/>
      </div>
    </div>
    {
      props.showButton ? (
        <div className="input-column full-width">
          <div className="input-row">
            <textarea
              name="text"
              rows="1"
              maxLength="10000"
              placeholder="Add a public comment..."
              autoComplete="off"
              value={ props.text }
              onChange={ props.handleChangeText }
              onFocus={ (e) => props.handleShowButton(e, true) }
            />
          </div>
          <div className="input-row">
            <div className="button-wrapper">
              <button className="button-cancel" onClick={ (e) => props.handleShowButton(e, false) }>Cancel</button>
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
              autoComplete="off"
              value=""
              onFocus={ (e) => props.handleShowButton(e, true) }
            />
          </div>
        </div>
      )
    }
  </form>
);

CommentNew.propTypes = {
  text: PropTypes.string,
  showButton: PropTypes.boolean,
  handleChangeText: PropTypes.func.isRequired,
  handleShowButton: PropTypes.func.isRequired,
  handleSubmitComment: PropTypes.func.isRequired,
};

CommentNew.defaultProps = {
  text: '',
  showButton: false,
};

export default CommentNew;
