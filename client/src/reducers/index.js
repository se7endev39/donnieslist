import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth_reducer';
import userReducer from './user_reducer';
import communicationReducer from './communication_reducer';
import customerReducer from './customer_reducer';
import expertReducer from './expert_reducer';
import pageroutereducer from './pageroutereducer';
import searchvaluereducer from './searchreducer';


const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  communication: communicationReducer,
  customer: customerReducer,
  expert: expertReducer,
  pageroute:pageroutereducer,
  searchvalue: searchvaluereducer
});

export default rootReducer;
