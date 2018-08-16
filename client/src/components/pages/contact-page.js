import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { sendContactForm } from '../../actions/index';

const form = reduxForm({
  form: 'contact-form'
});

const renderField = field => (
  <div>
    <input type="text" required placeholder="Your input here" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderEmailField = field => (
  <div>
    <input type="email" required placeholder="Your email here" className="form-control emailField" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderTextarea = field => (
  <div>
    <textarea required rows="3" placeholder="Your message here" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);


class ContactPage extends Component {

  handleFormSubmit({ firstName, lastName, emailAddress, subject, message }) {
    this.props.sendContactForm({ firstName, lastName, emailAddress, subject, message });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit} = this.props;

    return (
    <div id="how-it-works-wrapper" className="how-it-works-wrapper">
      <div className="container">
        <div className="page-title text-center"><h2>Contact Us</h2></div>
        <div className="col-xs-12 col-sm-12 col-lg-4">
          <div className="row">
              <div className="col-xs-12 col-sm-12 col-lg-12">
                <div className="box">             
                  <div className="icon">
                    <div className="info">                      
                      <div className="sec-user-info">
                        <div className="text-left"><h3 className="title-user-info">Patrick H.</h3></div>
                        <div className="text-left"><i className="fa fa-mobile fa-cs-mobile" aria-hidden="true"></i> &nbsp; +1 (209) 568-7870</div>
                        <div className="text-left"><i className="fa fa-envelope fa-cs-env" aria-hidden="true"></i> &nbsp; <a href="mailto:patrickhaledonnieslist@gmail.com">patrickhaledonnieslist@gmail.com</a></div>
                      </div>
                      <div className="sec-user-info">
                        <div className="text-left"><h3 className="title-user-info">Donny D.</h3></div>
                        <div className="text-left"><i className="fa fa-mobile fa-cs-mobile" aria-hidden="true"></i> &nbsp; +1 (423) 316-9050</div>
                        <div className="text-left"><i className="fa fa-envelope fa-cs-env" aria-hidden="true"></i> &nbsp; <a href="mailto:donnydey@gmail.com">donnydey@gmail.com</a></div>
                      </div>
                    </div>
                  </div>
                  <div className="space"></div>
                </div> 
              </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-lg-8">
          <div class="row">
            <div className="col-xs-12 col-sm-12 col-lg-12">
            <div className="box">             
              <div className="icon">
                <div className="info">
                   <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                      {this.renderMessage()}
                      <div className="row">
                        <div className="col-md-6">
                          <fieldset className="form-group">
                            <label>First Name</label>
                            <Field name="firstName"  component={renderField} type="text" />
                          </fieldset>
                        </div>

                        <div className="col-md-6">
                          <fieldset className="form-group">
                            <label>Last Name</label>
                            <Field name="lastName" component={renderField} type="text" />
                          </fieldset>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <fieldset className="form-group">
                            <label>Email Address</label>
                            <Field name="emailAddress" component={renderEmailField} type="email" />
                          </fieldset>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <fieldset className="form-group">
                            <label>Subject</label>
                            <Field name="subject" component={renderField} type="text" />
                          </fieldset>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <fieldset className="form-group">
                            <label>Message</label>
                            <Field name="message" rows="3" component={renderTextarea} type="text" />
                          </fieldset>
                        </div>
                      </div>
                      {this.renderAlert()}
                      <button action="submit" className="btn btn-primary">Send</button>
                    </form>
                </div>
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
  return { errorMessage: state.communication.error,
    message: state.communication.message,
    authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, { sendContactForm})(form(ContactPage));