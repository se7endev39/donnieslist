import axios from 'axios';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from './index';
import { AUTH_USER, AUTH_ERROR, SEND_EXPERT_EMAIL,SEND_EXPERT_TEXT_MESSAGE, CREATE_EXPERT, GET_EXPERT_EMAIL_TOKEN, PROTECTED_TEST } from './types';
//= ===============================
// sendEmail actions
//= ===============================
export function sendEmail({ email, message, expertemail}) {
  return function (dispatch) {
    var expertemail = "mohit@rvtechnologies.co.in";
    if(message !== undefined && email !== undefined){
      return axios.post(`${API_URL}/sendEmailMessageToExpert`, { email, message , expertemail})
      .then((response) => {
        return response.data;
        dispatch({
          type: SEND_EXPERT_EMAIL,
          payload: response.data
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
    }
  };
}

//= ===============================
// sendTextMessage actions
//= ===============================
export function sendTextMessage({ text_email, text_message, text_expert_email}) {
  return function (dispatch) {
    // var text_expert_email = text_expert_email;
    if(text_email !== undefined && text_message !== undefined && text_expert_email !== undefined){
      return axios.post(`${API_URL}/sendTextMessageToExpert`, { text_email, text_message , text_expert_email})
      .then((response) => {
        return response.data;
        dispatch({
          type: SEND_EXPERT_TEXT_MESSAGE,
          payload: response.data
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
    }
    else{
      console.log("^^^^^^^ NO EMAIL")
    }
  };
}

//= ===============================
// create Expert actions
//= ===============================
export function createExpert({ firstName, lastName, email, password, userBio, expertContact,expertContactCC, expertRates, expertCategories, expertRating, expertFocusExpertise, yearsexpertise, facebookLink, twitterLink, instagramLink, linkedinLink, snapchatLink,expertUniversity }) {
  return function (dispatch) {
    return axios.post(`${API_URL}/createExpert`, { firstName, lastName, email, password, expertContact,expertContactCC ,userBio, expertRates, expertCategories, expertRating, expertFocusExpertise, yearsexpertise, facebookLink, twitterLink, instagramLink, linkedinLink, snapchatLink,expertUniversity })
    .then((response) => {
      return response.data;
      dispatch({
        type: CREATE_EXPERT,
        payload: response.data
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

//= ===============================
// get expert email from token actions
//= ===============================
export function getExpertEmailFromToken({ token }) {
  console.log('token: ',token);
  return function (dispatch) {
      return axios.get(`${API_URL}/getExpertEmailFromToken/${ token }` )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        //console.log('error: '+error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

//= ===============================
// check Before Session Start actions
//= ===============================
export function checkBeforeSessionStart({ expertEmail, userEmail }) {
  return function (dispatch) {
    return axios.post(`${API_URL}/videosession/check-before-session-start`, { expertEmail, userEmail })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

//= ===============================
// check Before Session Start actions
//= ===============================
// export function createAudioSession({ expertEmail, userEmail }) {
//   return function (dispatch) {
//       //console.log('expertEmail: '+expertEmail + ' userEmail: '+userEmail);
//       if(expertEmail !== undefined && userEmail !== undefined){
//         return axios.post(`${API_URL}/createAudioSession`, { expertEmail, userEmail })
//             .then(response => {
//                 //console.log(response.data);
//                 return response.data;
//             })
//             .catch(err => {
//                 errorHandler(dispatch, error.response, AUTH_ERROR);
//             });
//     }
//   };
// }

export function createAudioSession(payload) {
  return function (dispatch) {
      //console.log('expertEmail: '+expertEmail + ' userEmail: '+userEmail);
      console.log(payload)
      if(payload.expertEmail !== undefined && payload.userEmail !== undefined){
        return axios.post(`${API_URL}/createVideoSession`, payload)
            .then(response => {
                //console.log(response.data);
                return response.data;
            })
            .catch(err => {
                errorHandler(dispatch, err.message, AUTH_ERROR);
            });
    }
  };
}

export function getVideoSession(payload) {
  return function (dispatch) {
      //console.log('expertEmail: '+expertEmail + ' userEmail: '+userEmail);
      console.log(payload)
      if(payload.expertEmail !== undefined && payload.userEmail !== undefined){
        return axios.get(`${API_URL}/getVideoSession/${payload.expertEmail}/${payload.userEmail}`)
            .then(response => {
                //console.log(response.data);
                return response.data;
            })
            .catch(err => {
                errorHandler(dispatch, err.message, AUTH_ERROR);
            });
    }
  };
}

//= ===============================
// recharge user session before starting session actions
//= ===============================
export function rechargeVideoSession({stripeToken, expertSlug, userEmail, amount}) {
  return function (dispatch) {
    return axios.post(`${API_URL}/videosession/recharge-video-session`, {stripeToken, userEmail, amount})
		  .then(response => {
        //console.log('response: '+JSON.stringify(response));
        if(response.data.response.stripePaymentStatus === "succeeded"){
          //console.log('in if '+expertSlug);
          window.location.href = `${CLIENT_ROOT_URL}/mysession/`+expertSlug;
        }else{
          //console.log('in else '+expertSlug);
        }
		  })
		  .catch(err => {
        //console.log('err: '+err);
  	});
  };
}

// add money to wallet
export function addMoneyToWallet({customer_id, expertSlug, userEmail, amount}) {
  return function (dispatch) {
    return axios.post(`${API_URL}/videosession/add-money-to-wallet`, {customer_id, userEmail, amount})
		  .then(response => {

                      return response.data;
//        console.log('action expert response: '+JSON.stringify(response));
//        if(response.data.response.stripePaymentStatus === "succeeded"){
//          console.log('in if '+expertSlug);
//          window.location.href = `${CLIENT_ROOT_URL}/mysession/`+expertSlug;
//        }else{
//          console.log('in else '+expertSlug);
//        }
		  })
		  .catch(err => {
        //console.log('err: '+err);
  	});
  };
}


//= ===============================
// check authentication actions
//= ===============================
export function isLoggedIn() {
  return function (dispatch) {
    axios.get(`${API_URL}/protected`, {
      headers: { Authorization: cookie.load('token') },
    })
    .then((response) => {
      //console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

export function audioCallTokenRequest({ email, newConAudioId }) {
  return function (dispatch) {
    return axios.post(`${API_URL}/requestForToken`, { email, newConAudioId })
    .then((response) => {
      return response.data;
        //return {email};
    })
    .catch((error) => {
     // console.log('error: '+error);
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}




export function startRecording({ expertEmail, userEmail, archiveSessionId }){
    return function (dispatch) {
        return axios.post(`${API_URL}/start_recording`, { expertEmail, userEmail, archiveSessionId })
        .then((response) => {
          return response.data;
            //return {email};
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
  };
}

export function stopRecording({expertEmail, userEmail, archiveID}){
    return function (dispatch) {
        return axios.get(`${API_URL}/stop_recording/${expertEmail}/${userEmail}/${archiveID}`)
        .then((response) => {
          return response.data;
            //return {email};
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
  };
}

export function sendRecording({ expertEmail, userEmail, archiveID }){
    return function (dispatch) {
        return axios.post(`${API_URL}/send_recording`, { expertEmail, userEmail, archiveID })
        .then((response) => {
          return response.data;
            //return {email};
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
  };
}

export function getArchiveSessionAndToken({ expertEmail, userEmail, archiveSessionId }){
    return function (dispatch) {
        return axios.post(`${API_URL}/getArchiveSessionAndToken`, { expertEmail, userEmail, archiveSessionId })
        .then((response) => {
          return response.data;
            //return {email};
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}

export function getExpertRecordings({ expertEmail }){
    return function (dispatch) {
        return axios.post(`${API_URL}/getExpertRecordings`, { expertEmail })
        .then((response) => {
          return response.data;
            //return {email};
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}

export function playRecordedAudio({ archiveId }){
    return function (dispatch) {
        return axios.post(`${API_URL}/playRecordedAudio`, { archiveId })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}

export function deleteRecordedAudio({ archiveId, id }){
    return function (dispatch) {
        return axios.post(`${API_URL}/deleteRecordedAudio`, { archiveId, id })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}

export function saveUserReview({ rating, review, title, expertEmail, expertFullName, userEmail, userFullName, expertSlug, reviewBy }){
    return function (dispatch) {
        return axios.post(`${API_URL}/saveUserReview`, { rating, review, title, expertEmail, expertFullName, userEmail, userFullName, expertSlug, reviewBy })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}

export function getExpertReviews( { expertSlug } ){
    return function (dispatch) {
        return axios.get(`${API_URL}/getExpertReviews/${ expertSlug }` )
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          //console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}
