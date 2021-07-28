/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {Link} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import { useHistory } from 'react-router';

import { loginUser } from '../../actions/auth';

const Login = props => {
    const default_props = {
        errorMessage: '',
        message: '',
    };

    const [state, setState] = useState(default_props);
    const dispatch = useDispatch();
    const [cookies,] = useCookies();
    const {handleSubmit} = props;
    const history = useHistory();

    const handleFormSubmit = formProps => {
        if (window.$("#login_form").valid()) {
            dispatch(loginUser(formProps, history)).then(
              (response) => {
                if (
                  response.errorMessage &&
                  response.errorMessage !== null &&
                  response.errorMessage !== undefined &&
                  response.errorMessage !== ""
                ) {
                  setState({ ...state, errorMessage: response.errorMessage });
                }
              }).catch(err => {
                console.log("[ERROR]:", err);
            });
          }
    }

    useEffect(() => {
        window.$(document).ready(() => {
            window.$("#login_form").validate({
                rules: {
                    email: {required: true, email: true},
                    password: {required: true},
                },
                messages: {
                    email: {required: "Please enter this field"},
                    password: {required: "Please enter this field"},
                }
            });
        });
    }, []);

    useEffect(() => {
      if (cookies.user) {
        history.push('/');
      }
    }, [cookies, history]);

    const renderRequiredLogin_for_session = () => {
        const requiredLogin_msg = cookies.requiredLogin_for_session;
        cookies.removeCookie("requireLogin_for_session", {path: "/"});
        return(
            <div className="alert alert-warning">
                <strong>{requiredLogin_msg}</strong>
                <a className="close" data-dismiss="alert" aria-label="close" title="close">
                    x
                </a>
            </div>
        );
    };

    return(
        <div className="container">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="page-title text-center">
            <h2>Login</h2>
          </div>

          {cookies.requiredLogin_for_session
            ? renderRequiredLogin_for_session()
            : ""}

          <p className="text-center">Welcome back members.</p>
          {state.errorMessage &&
            state.errorMessage !== null &&
            state.errorMessage !== undefined &&
            state.errorMessage !== "" && (
              <div className="alert alert-danger">
                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                {state.errorMessage}
              </div>
            )}
          <form
            id="login_form"
            onSubmit={handleSubmit((e) => handleFormSubmit(e))}
          >
            <div className="form-group">
              <label>Email</label>
              <Field
                name="email"
                className="form-control"
                required
                component="input"
                type="text"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <Field
                name="password"
                className="form-control"
                required
                component="input"
                type="password"
              />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          <div className="form-group text-center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
    );
};

export default reduxForm({
    form: 'login'
})(Login);