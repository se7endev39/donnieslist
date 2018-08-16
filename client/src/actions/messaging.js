import { reset } from 'redux-form';
import { browserHistory } from 'react-router';
import { SOCKET_CONNECTION, getData, postData, putData, deleteData } from './index';
import io from 'socket.io-client';
import { CHAT_ERROR, FETCH_CONVERSATIONS, FETCH_RECIPIENTS, START_CONVERSATION, SEND_REPLY, FETCH_SINGLE_CONVERSATION, FETCH_EXPERT_SINGLE_CONVERSATION } from './types';

// Connect to socket.io server
export const socket = SOCKET_CONNECTION;
//console.log('messaging file');
socket.on('disconnect', function () {
  socket.emit('disconnect');
});

//= ===============================
// Messaging actions
//= ===============================
export function fetchConversations() {
  const url = '/chat';
  return dispatch => getData(FETCH_CONVERSATIONS, CHAT_ERROR, true, url, dispatch);
}

export function fetchConversation(conversation) {
  const url = `/chat/${conversation}`;
  return dispatch => getData(FETCH_SINGLE_CONVERSATION, CHAT_ERROR, true, url, dispatch);
}

export function startConversation({ recipient, composedMessage }) {
  const data = { composedMessage };
  const url = `/chat/new/${recipient}`;
  return (dispatch) => {
    postData(START_CONVERSATION, CHAT_ERROR, true, url, dispatch, data);

    // Clear form after message is sent
    dispatch(reset('composeMessage'));
    browserHistory.push(`/dashboard/conversation/view/${response.data.conversationId}`);
  };
}

export function fetchRecipients() {
  const url = '/chat/recipients';
  return dispatch => getData(FETCH_RECIPIENTS, CHAT_ERROR, true, url, dispatch);
}

export function sendReply(replyTo, { composedMessage }) {
  const data = { composedMessage };
  const url = `/chat/${replyTo}`;
  return (dispatch) => {
    postData(SEND_REPLY, CHAT_ERROR, true, url, dispatch, data);

    // Clear form after message is sent
    dispatch(reset('replyMessage'));
    socket.emit('new message', replyTo);
  };
}


//= ===============================
// Expert-Session Messaging actions
//= ===============================

export function FetchExpertConversation(sessionOwnerUsername, email) {
  console.log(sessionOwnerUsername+ " &&&&&&&&&&&&&&&&&&& --- --- ---- "+email)
  const url = `/expertchat/fetchSessionChat/${sessionOwnerUsername}/${email}`;
  return dispatch => getData(FETCH_EXPERT_SINGLE_CONVERSATION, CHAT_ERROR, true, url, dispatch);
}


export function ExpertSessionUserDisconnected(sessionOwnerUsername,currentTimer) {
  const url = `/expertchat/fetchSessionChat/${sessionOwnerUsername}`;
  return dispatch => getData(FETCH_EXPERT_SINGLE_CONVERSATION, CHAT_ERROR, true, url, dispatch);
}


export function ExpertSendReply(sessionOwnerUsername, messageReceiverEmail, messageSenderEmail, composedMessage, date) {
  // console.log("CCCOOOLLL")
  const data = {sessionOwnerUsername, messageReceiverEmail, messageSenderEmail, composedMessage, date };
  // console.log("**********************************************")
  // console.log(sessionOwnerUsername)
  //   console.log(messageReceiverEmail)
  //   console.log(messageSenderEmail)
  //   console.log(composedMessage)
  //   console.log(date)
  // console.log("**********************************************")
  const url = `/expertchat/expertsessionchat`;
  return (dispatch) => {
    postData(SEND_REPLY, CHAT_ERROR, true, url, dispatch, data).then(

        (response)=>{
          console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
          // Clear form after message is sent
          dispatch(reset('replyMessage'));
          console.log('client replyMessage sessionOwnerUsername : '+sessionOwnerUsername);
          socket.emit('expert new message', sessionOwnerUsername);
        }

      )


  };
}
