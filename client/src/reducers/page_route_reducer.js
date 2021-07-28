const initialState = {
    pagename: "",
  };
  
  export default function pageRouteReducer(state = initialState, action) {
    switch (action.type) {
      case "UPDATE": {
        return Object.assign({}, state, {
          pagename: action.data,
        });
      }
      default:
        return state;
    }
  }
  