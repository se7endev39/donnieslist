import {
    FETCH_USER,
    // ERROR_RESPONSE
  } from "../constants/actions";
  
  const INITIAL_STATE = {
    profile: {},
    message: "",
    error: "",
  };
  
  export default function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case FETCH_USER:
        return {
          ...state,
          profile: action.payload.user,
        };
      // case ERROR_RESPONSE:
      //     return {
      //         ...state,
      //         error: action.payload
      //     };
      default:
        return state;
    }
  }
  