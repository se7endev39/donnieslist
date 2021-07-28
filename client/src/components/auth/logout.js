import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import {customLogoutUser} from '../../actions/auth';

const Logout = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  useEffect(() => {
    dispatch(customLogoutUser(history));
  }, [dispatch, history]);

  return (
    <div className="col-sm-6 mtop100 col-sm-offset-3">
      <div className="page-title text-center">Sorry to see you go!</div>
    </div>
  );
}

export default Logout;