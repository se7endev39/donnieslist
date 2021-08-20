import axios from "axios";
import {
  API_URL,
  CLIENT_ROOT_URL,
  MESSAGE_INCORRECT_USERNAME_PASSWORD,
} from "../constants/api";
import { errorHandler } from "./index";
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FORGOT_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST,
  PROTECTED_TEST,
  EXPERT_SIGNUP_LINK_REQUEST,
} from "../constants/actions";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

//= ===============================
// Authentication actions
//= ===============================

//login using native auth
export function loginUser({ email, password }, browserHistory) {
  return function (dispatch) {
    if (email !== undefined && password !== undefined) {
      return axios.post(`${API_URL}/auth/login`, { email, password }).then(
        (response) => {
          if ( response.status >= 400 ) {
            return response.data;
          } else {
            cookies.set("token", response.data.token, { path: "/", secure: false, sameSite: "Lax" });
            cookies.set("user", response.data.user, { path: "/", secure: false, sameSite: "Lax" });
            axios
            .get(`${API_URL}/getExpert/${email}`)
            .then((res) => {
              var slug = res.data[0].slug;
              var category = res.data[0].expertCategories[0];
              localStorage.setItem("slug", slug)
              localStorage.setItem("category", category)
            })
            .catch((err) => {
              console.error(err);
            });
            dispatch({ type: AUTH_USER });
            browserHistory.push('/profile');
            return response;
          }
        }
      ).catch(error => {
        return { errorMessage: MESSAGE_INCORRECT_USERNAME_PASSWORD };
      });
    } else {
      return "empty_parameters";
    }
  };
}

export function facebookLoginUser(response) {
  return function (dispatch) {
    return axios
      .post(`${API_URL}/auth/login-facebook-user`, { response })
      .then((response) => {
        cookies.set("token", response.data.token, { path: "/", secure: false, sameSite: "Lax" });
        cookies.set("user", response.data.user, { path: "/", secure: false, sameSite: "Lax" });
        window.location.href = `${CLIENT_ROOT_URL}/profile`;
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function registerUser({ email, firstName, lastName, password }) {
  return function (dispatch) {
    return axios
      .post(`${API_URL}/auth/register`, {
        email,
        firstName,
        lastName,
        password,
      })
      .then(
        (response) => {
          if (response.data.success === true) {
            cookies.set("token", response.data.token, { path: "/", secure: false, sameSite: "Lax" });
            cookies.set("user", response.data.user, { path: "/", secure: false, sameSite: "Lax" });
          }
          return response;
        },
        (err) => {
          console.log(err);
        }
      ).catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function logoutUser(error) {
  return function (dispatch) {
    const userId = cookies.get("user");
    var user_id = userId._id;
    axios.get(`${API_URL}/auth/logout/${user_id}`);
    dispatch({ type: UNAUTH_USER, payload: error || "" });
    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
    cookies.remove("token", { path: "/" });
    window.location.href = `${CLIENT_ROOT_URL}/login`;
  };
}
export function customLogoutUser(browserHistory) {
  return function (dispatch) {
    const userId = cookies.get("user");
    var user_id = userId._id;
    axios.post(`${API_URL}/auth/logout/${user_id}`);
    dispatch({ type: UNAUTH_USER, payload: "" });
    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
    cookies.remove("token", { path: "/" });
    browserHistory.push('/');
  };
}

export function getForgotPasswordToken({ email }) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/auth/forgot-password`, { email })
      .then((response) => {
        dispatch({
          type: FORGOT_PASSWORD_REQUEST,
          payload: response.data.message,
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function resetPassword(token, { password }) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/auth/reset-password/${token}`, { password })
      .then((response) => {
        dispatch({
          type: RESET_PASSWORD_REQUEST,
          payload: response.data.message,
        });
        // Redirect to login page on successful password reset
        console.log('reset');
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error);
        // errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function protectedTest() {
  return function (dispatch) {
    axios
      .get(`${API_URL}/protected`, {
        headers: { Authorization: cookies.get("token") },
      })
      .then((response) => {
        dispatch({
          type: PROTECTED_TEST,
          payload: response.data.content,
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

//= ===============================
// signupExpertSendSignupLink actions
//= ===============================
export function signupExpertSendSignupLink({ email }) {
  return function (dispatch) {
    var expertEmail = "ermohit400@yahoo.com";
    if (email !== undefined) {
      return axios
        .post(`${API_URL}/auth/signupExpertSendSignupLink`, {
          email,
          expertEmail,
        })
        .then((response) => {
          dispatch({
            type: EXPERT_SIGNUP_LINK_REQUEST,
            payload: response.data,
          });
          return response.data;
        })
        .catch((error) => {
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    }
  };
}
