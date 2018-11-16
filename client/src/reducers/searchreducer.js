
const initialState = {
  searchval: '',
};


const searchvaluereducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE':
      {
        return Object.assign({}, state, {
          searchval: action.data,
        });
      }
    default:
      return state;

  }
};

export default searchvaluereducer;
