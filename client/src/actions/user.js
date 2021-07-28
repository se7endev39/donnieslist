import axios from "axios";
import { errorHandler } from "./index";
import {
  API_URL,
  // CLIENT_ROOT_URL
} from "../constants/api";
import {
  // AUTH_USER,
  AUTH_ERROR,
  // SEND_EXPERT_EMAIL,
  // SEND_EXPERT_TEXT_MESSAGE,
  // CREATE_EXPERT,
  // PROTECTED_TEST
} from "../constants/actions";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export function getUserReviews({ userEmail }) {
  return function (dispatch) {
    return axios
      .get(`${API_URL}/user/getUserReviews/${userEmail}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: " + error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

// UpdateMyProfile
export function UpdateMyProfile(data) {
  const token = cookies.get("token");
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/update`, {
        headers: { Authorization: token },
        body: data,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: " + error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}
// UpdateAccountInfo
export function UpdateAccountInfo(data) {
  const token = cookies.get("token");
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/add-account-info`, {
        headers: { Authorization: token },
        body: data,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: " + error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}
// FetchAccountInfo
export function FetchAccountInfo(data) {
  const token = cookies.get("token");
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/fetch-account-info`, {
        headers: { Authorization: token },
        body: data,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: " + error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}
