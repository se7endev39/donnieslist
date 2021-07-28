import axios from "axios";
import {
  API_URL,
  // CLIENT_ROOT_URL
} from "../constants/api";
import { errorHandler } from "./index";
import {
  AUTH_ERROR,
} from "../constants/actions";

// save video sessin info
export function saveVideoSessionInfo({
  expertEmail,
  userEmail,
  sessionCreationDate,
}) {
  return function (dispatch) {
    return axios
      .post(`${API_URL}/videosession/save-video-session-info`, {
        expertEmail,
        userEmail,
        sessionCreationDate,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  };
}

export function getExpertReviews({ expertSlug }) {
  return function (dispatch) {
    return axios
      .get(`${API_URL}/getExpertReviews/${expertSlug}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: " + error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}
