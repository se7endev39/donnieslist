import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { useCookies } from 'react-cookie';
import { Field, reduxForm } from 'redux-form';
import { useHistory } from 'react-router';

// import {CLIENT_ROOT_URL} from '../../constants/api';
import { registerUser } from '../../actions/auth';

const renderField = field => {
    return (
        <div>
            {
                field.type && field.type === 'password' && (
                    <input type='password' className='form-control' {...field.input} />
                )
            }
            {
                field.type && field.type !== 'password' && (
                    <input type='text' className='form-control' {...field.input} />
                )
            }
            {
                field.touched && field.error && <div className='error'>{field.error}</div>
            }
        </div>
    );
};

const Register = props => {
    const default_props = {
        errorMessage: '',
        message: '',
    };
    const [state, setState] = useState(default_props);
    const [ cookies, setCookie ] = useCookies();
    const dispatch = useDispatch();
    const history = useHistory();
    const {handleSubmit} = props;
    
    
    useEffect(() => {
        window.$(document).ready(function () {
            window.$("#signup_form").validate({
              rules: {
                firstName: {
                  required: true,
                },
                lastName: {
                  required: true,
                },
                email: {
                  required: true,
                  email: true,
                },
                password: {
                  required: true,
                  minlength: 6,
                },
                password1: {
                  required: true,
                  equalTo: "#password",
                },
                confirm_joining: {
                  required: true,
                },
                confirm_age: {
                  required: true,
                },
              },
              messages: {
                firstName: {
                  required: "Please enter this field",
                },
                lastName: {
                  required: "Please enter this field",
                },
                username: {
                  remote:
                    "Sorry, our system has detected that an account with this username already exists!",
                },
                email: {
                  required: "Please enter this field",
                  remote:
                    "Sorry, our system has detected that an account with this email address already exists!",
                },
      
                password: {
                  required: "Please enter this field",
                },
                password1: {
                  equalTo: "Password and Confirm Password must be same!",
                },
              },
            });
          });
    }, []);

    const handleFormSubmit = (formProps) => {
      var regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
      if(!regex.test(formProps.password)){
        window.$('#password_error').css('display','block');
        const errMsg = "Password must be in rage of 8-20 characters and contain over 1 uppercase."
        setState({ ...state, errorMessage: errMsg });
        return false;
      }else{
        window.$('#password_error').css('display','none');
      }
        if (window.$("#signup_form").valid()) {
            dispatch(registerUser(formProps)).then((res) => {
              if (
                res.data.error &&
                res.data.error !== null &&
                res.data.error !== undefined &&
                res.data.error !== ""
              ) {
                setState({ ...state, errorMessage: res.data.error });
              }
              if (res.data.success && res.data.success === true) {
                setState({
                    ...state,
                  successMessage:
                    "Successfully Created Account. You Will be redirected to profile in 4 seconds.",
                });
                setTimeout(function () {
                  setCookie("token", res.data.token, { path: "/", secure: false, sameSite: "Lax" });
                  setCookie("user", res.data.user, { path: "/", secure: false, sameSite: "Lax" });
      
                  history.push('/profile');
                }, 4000);
              }
            });
          }
    };

    return (
        <div className="container">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="page-title text-center">
            <h2>Join the list</h2>
          </div>
          <p className="text-center">Sign up to start a session.</p>
          <form
            id="signup_form"
            onSubmit={handleSubmit((e) => handleFormSubmit(e))}
          >
            {state.errorMessage &&
              state.errorMessage !== null &&
              state.errorMessage !== undefined &&
              state.errorMessage !== "" && (
                <div className="alert alert-danger">
                  {state.errorMessage}
                </div>
              )}
            {state.successMessage &&
              state.successMessage !== null &&
              state.successMessage !== undefined &&
              state.successMessage !== "" && (
                <div className="alert alert-success">
                  {state.successMessage}
                </div>
              )}
            <div className="row">
              <div className="col-md-6 form-group">
                <label>First Name</label>
                <Field
                  name="firstName"
                  className="form-control"
                  required
                  component={renderField}
                  type="text"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Last Name</label>
                <Field
                  name="lastName"
                  className="form-control"
                  required
                  component={renderField}
                  type="text"
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label>Email</label>
                <Field
                  name="email"
                  className="form-control"
                  required
                  component={renderField}
                  type="text"
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                  required
                  component={renderField}
                />
              </div>
            </div>

            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default reduxForm({
    form: 'register'
})(Register);