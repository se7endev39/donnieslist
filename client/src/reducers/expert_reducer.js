import { SEND_EXPERT_EMAIL, PROTECTED_TEST, CREATE_EXPERT} from '../actions/types';

const INITIAL_STATE = { message: '', error: '', customer: {} };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEND_EXPERT_EMAIL:
      console.log('in reducer SEND_EXPERT_EMAIL '+JSON.stringify(action));
      return { ...state, message: action.payload.message };
    case CREATE_EXPERT:
      console.log('in reducer CREATE_EXPERT '+JSON.stringify(action));
      return { ...state, message: action.payload.message };
    case PROTECTED_TEST:
      return { ...state, error: action.payload.message  };
  }

  return state;
}
