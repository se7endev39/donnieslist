
const initialState = {
    pagename: "",
  }


const pageroutereducer = (state=initialState, action)=>{
    switch (action.type) {
      case 'UPDATE':
      {
        return Object.assign({}, state, {
          pagename: action.data
        });
      }
      default:
        return state
    
}
}

export default pageroutereducer;