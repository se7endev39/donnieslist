import axios from "axios";
import { logoutUser } from "./auth";
import {
  STATIC_ERROR,
  FETCH_USER,
  SEND_CONTACT_FORM,
} from "../constants/actions";
import {
  API_URL,
  // CLIENT_ROOT_URL,
  // tokBoxApikey
} from "../constants/api";

import { Cookies } from "react-cookie";
const cookies = new Cookies();
//= ===============================
// Utility actions
//= ===============================

export function fetchUser(uid) {
  const token = cookies.get("token");
  return function (dispatch) {
    return axios
      .get(`${API_URL}/user/${uid}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
        return response;
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function fetchMyProfile(uid) {
  const token = cookies.get("token");
  return function (dispatch) {
    return axios
      .get(`${API_URL}/myuserprofile/${uid}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        return response;
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}
// uploadImage
export function uploadImage(data) {
  const token = cookies.get("token");
  console.log(data);
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/update/profile`, {
        headers: { Authorization: token },
        data: data,
      })
      .then((response) => {
        console.log(response);

        return response;
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function errorHandler(dispatch, error, type) {
  console.log("Error type: ", type);
  console.log(error);

  let errorMessage = error.response ? error.response.data : error;

  // NOT AUTHENTICATED ERROR
  if (error.status === 401 || error.response.status === 401) {
    errorMessage = "You are not authorized to do this.";
    return dispatch(logoutUser(errorMessage));
  }

  dispatch({
    type,
    payload: errorMessage,
  });
}

// Post Request
export function postData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  const token = cookies.get("token");
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: token } };
  }

  axios
    .post(requestUrl, data, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Get Request
export function getData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  const token = cookies.get("token");
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: token } };
  }

  axios
    .get(requestUrl, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Put Request
export function putData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  const token = cookies.get("token");
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: token } };
  }

  axios
    .put(requestUrl, data, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Delete Request
export function deleteData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  const token = cookies.get("token");
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: token } };
  }

  axios
    .delete(requestUrl, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

//= ===============================
// Static Page actions
//= ===============================
export function sendContactForm({ name, emailAddress, message }) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/communication/contact`, { name, emailAddress, message })
      .then((response) => {
        dispatch({
          type: SEND_CONTACT_FORM,
          payload: response.data.message,
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, STATIC_ERROR);
      });
  };
}
