const initialState = {
    searchval: [],
  };
  
  export default function searchValueReducer(state = initialState, action) {
    switch (action.type) {
      case "UPDATE": {
        return Object.assign({}, state, {
          searchval: action.payload,
        });
      }
      default:
        return state;
    }
  }
  