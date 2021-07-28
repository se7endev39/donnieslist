import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Field, reduxForm } from "redux-form";
import { fetchRecipients, startConversation } from "../../../actions/messaging";

const form = reduxForm({
  form: "composeMessage",
  validate,
});

function validate(formProps) {
  const errors = {};

  if (!formProps.composedMessage) {
    errors.password = "Please enter a message";
  }
  return errors;
}

const renderTextarea = (field) => (
  <div>
    <textarea
      required
      rows="3"
      placeholder="Your message here"
      className="form-control"
      {...field.input}
    ></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

class ComposeMessage extends Component {
  constructor(props) {
    super(props);

    this.props.fetchRecipients();
  }

  handleFormSubmit(formProps) {
    this.props.startConversation(formProps);
  }

  renderRecipients() {
    if (this.props.recipients) {
      return this.props.recipients.map((data) => (
        <option key={data._id} value={data._id}>
          {data.profile.firstName} {data.profile.lastName}
        </option>
      ));
    }
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    } else if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      );
    }
  }

  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">Inbox</li>
      </ol>
    );
  }

  userMenu() {
    return (
      <ul className="nav nav-sidebar" id="menu">
        <li>
          <Link to="/profile/edit">
            <i className="glyphicon glyphicon-list-alt"></i>
            <span className="collapse in hidden-xs"> Edit Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/inbox">
            <i className="glyphicon glyphicon-list-alt"></i>
            <span className="collapse in hidden-xs"> Inbox</span>
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                <div
                  className="column col-sm-3 col-xs-1 sidebar-offcanvas"
                  id="sidebar"
                >
                  {this.userMenu()}
                </div>
                <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">Start New Conversation</div>
                  </div>
                  <div className="compose-msg-form">
                    <form
                      onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                    >
                      <div className="form-group">
                        <label>Choose Recipent</label>
                        <Field
                          className="form-control"
                          required
                          name="recipient"
                          component="select"
                        >
                          <option />
                          {this.renderRecipients()}
                        </Field>
                      </div>
                      <div className="form-group">
                        <label>Enter your message below</label>
                        {this.renderAlert()}
                        <Field
                          name="composedMessage"
                          required
                          rows="3"
                          component={renderTextarea}
                          type="text"
                          placeholder="Type here to chat..."
                        />
                      </div>
                      <div className="form-group">
                        <button action="submit" className="btn btn-primary">
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipients: state.communication.recipients,
    errorMessage: state.communication.error,
  };
}

export default connect(mapStateToProps, { fetchRecipients, startConversation })(
  form(ComposeMessage)
);
