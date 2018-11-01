// CommentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const CommentForm = props => (
  <form onSubmit={ props.handleSubmitComment }>
    {
      props.formType == 'form_reply' ? (
        <div className="input-column">
          <div className="image-wrapper">
            <img className="reply-user" src="/src/public/img/person.jpg"/>
          </div>
        </div>
      ) : null
    }
    <div className="input-column full-width">
      <div className="input-row">
        <textarea
          name="text"
          maxLength="10000"
          autoComplete="off"
          value={ props.text }
          rows={ props.text ? props.text.split('\n').length : 1 }
          placeholder={ props.placeholder }
          onChange={ (e) => props.handleChangeText(e) }
        />
      </div>
      <div className="input-row">
        <div className="button-wrapper">
          <button className="button-cancel button-reply" onClick={ (e) => props.handleShowForm(e, false) }>Cancel</button>
          <button className="button-reply" type="submit">{ props.buttonName }</button>
        </div>
      </div>
    </div>
  </form>
);

CommentForm.propTypes = {
  text: PropTypes.string,
  formType: PropTypes.string,
  buttonName: PropTypes.string,
  placeholder: PropTypes.string,
  handleSubmitComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  handleShowForm: PropTypes.func.isRequired,
};

CommentForm.defaultProps = {
  text: '',
  buttonName: 'Save',
};

export default CommentForm;
