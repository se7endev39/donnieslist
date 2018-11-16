import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { getForgotPasswordToken } from '../../actions/auth';
var Recaptcha = require('react-recaptcha');

const form = reduxForm({
  form: 'forgotPassword',
});

// specifying your onload callback function
var callback = function () {
  console.log('Done!!!!');
};

class ForgotPassword extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
        recaptcha_value: '',
    };

  }

  static contextTypes = {
    router: PropTypes.object,
  }

  // specifying verify callback function
  verifyCallback = function (response) {
    console.log('verifyCallback '+response);
    $('#hiddenRecaptcha').val(response);
    var recaptcha_value = response;
    this.setState({
        recaptcha_value,
        responseEmailMsg
    });
  };

  componentDidMount(){
    $(document).ready(function(){
      jQuery("#forgot_form").validate({
        rules: {
             email: { required: true,email: true },
             hiddenRecaptcha: { required: true }
        },
        messages: {
             email: { required: "Please enter this field" },
             hiddenRecaptcha:{ required: "Please enter this field" }
        },
        //submitHandler: function(form) { form.submit(); }
      });
    });
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.context.router.push('/dashboard');
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.authenticated) {
      this.context.router.push('/dashboard');
    }
  }

  handleFormSubmit(formProps) {
    if($('#forgot_form').valid()){
     //this.props.getForgotPasswordToken(formProps);


     try{
       this.props.getForgotPasswordToken(formProps).then(
       	(response)=>{
            console.log('response: '+response);
           this.setState({responseEmailMsg : "<div class='alert alert-success text-center'>"+response.message+"</div>"});
       	},
       	(err) => err.response.json().then(({errors})=> {
        		this.setState({responseEmailMsg : "<div class='alert alert-danger text-center'>"+errors+"</div>"});
        	})
       )
     }catch(e){}
    }
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
          <span><strong>Error!</strong> {this.props.errorMessage}</span>
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="container">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="page-title text-center"><h2>Forget Password</h2></div>
          <p className="text-center">Please enter your email to get new password.</p>
          <div dangerouslySetInnerHTML={{__html: this.state.responseEmailMsg}}></div>
          <form id="forgot_form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <div className="form-group">
              {this.renderAlert()}
              <label>Email</label>
              <Field name="email" className="form-control" component="input" type="text" />
            </div>
            <div className="form-group text-center">
              <Recaptcha sitekey="6LeMERsUAAAAACSYqxDZEOOicHM8pG023iDHZiH5"  render="explicit" onloadCallback={callback} verifyCallback={this.verifyCallback.bind(this)} />
              <div><input type="text" class="form-control g-recaptcha" id="hiddenRecaptcha" name="hiddenRecaptcha"  value={this.state.recaptcha_value} /></div>
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { getForgotPasswordToken })(form(ForgotPassword));
