export function setSearch(dat){
  return function(dispatch) {
    dispatch({
      type: 'UPDATE',
      payload: dat
    })
  };
} 