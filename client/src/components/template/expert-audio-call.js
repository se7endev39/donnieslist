import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Button } from "react-bootstrap";
import * as actions from "../../actions/messaging";

import { audioCallTokenRequest } from "../../actions/expert";
import { tokBoxApikey } from "../../constants/api";
const OT = require("@opentok/client");


const ExpertAudioCall = (props) => {
  const default_props = {
    showModal: false,
    audioCallFrom: "",
    email: props.email,
    sessionId: "",
    apiToken: "",
    pubOptions: { width: 100, height: 75, insertMode: "append" },
    publisherObj: "",
    sessionObj: "",
    newConAudioId: "",
    userAudioCallSokcetname: "",
    totalSeconds: 0,
    refreshIntervalId: "",
  };
  const [state, setState] = useState(default_props);
  const dispatch = useDispatch();
  const [ cookies, ] = useCookies();
  // const { content } = useSelector((state) => state.auth.content);
  // const { messages } = useSelector((state) => state.communication.messages);
  // const currentUser = cookies.user;
  const socket = actions.socket;

  useEffect(() => {
    const user = cookies.user;
    if (user) {
      // user cookie is set
      const userRole = user.role;
      if (userRole === "Expert") {
        //console.log('**** username ****'+user.slug);
        const expertUsername = user.slug;
        socket.emit(
          "expert audio call session",
          "expert-audio-session-" + expertUsername
        );
      }
    }
  }, [cookies.user, socket]);

  useEffect(() => {
    socket.on("audio call to expert", function (data) {
      setState({
        ...state,
        audioCallFrom: data.audioCallFrom,
        newConAudioId: data.newConAudioId,
        userAudioCallSokcetname: data.userAudioCallSokcetname,
        userConnectionId: data.userConnectionId,
      });
      setState({ ...state, showModal: true });
      window.$(".incomingAudioCall_main").css("right", 0);
      console.log(
        "*** socket on audio call to expert ***" + state.userAudioCallSokcetname
      );
    });
  }, [state, socket]);

  const setTime = () => {
    var totalSeconds = state.totalSeconds;
    ++totalSeconds;
    setState({
      ...state,
      totalSeconds: totalSeconds,
    });

    var secondsLabel = pad(totalSeconds % 60);
    var minutesLabel = pad(parseInt(totalSeconds / 60));

    window.$("#expert_audio_call_seconds").html(secondsLabel);
    window.$("#expert_audio_call_minutes").html(minutesLabel);
  };

  const pad = (val) => {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  };

  const disconnectAudioCall = () => {
    state.sessionObj.disconnect();
  };

  const disconnectCall = () => {
    console.log("*** disconnect call ****");
    setState({ ...state, showModal: false, audioCalling: false });
    window.$(".incomingAudioCall_main").css("right", "-300px");
    var data = { userAudioCallSokcetname: state.userAudioCallSokcetname };
    socket.emit("disconnect incoming audio call to user", data);
  };

  const connectCall = () => {
    setState({ ...state, showModal: false });
    window.$(".incomingAudioCall_main").css("right", "-300px");

    const email = state.email;
    const newConAudioId = state.newConAudioId;

    dispatch(
      audioCallTokenRequest({ email, newConAudioId }).then(
        (response) => {
          var session = OT.initSession(tokBoxApikey, response.sessionId);

          setState({
            sessionObj: session,
            userAudioCallSokcetname: "user-audio-session-" + response.username,
            sessionId: response.sessionId,
            apiToken: response.token,
          });

          var publisher;

          session.on("streamCreated", function (event) {
            console.log("streamCreated");
            var options = { width: 100, height: 75, insertMode: "append" };
            var subscriber = session.subscribe(
              event.stream,
              "userSubscriberAudio",
              options
            );
            console.log(subscriber);
            window.$("#expert-audio-call-interface-wrapper").fadeIn();
            var refreshIntervalId = setInterval(setTime, 1000);
            setState({
              ...state,
              refreshIntervalId,
            });
          });

          session.on("connectionCreated", function (event) {
            console.log("connectionCreated");
          });

          session.on("connectionDestroyed", function (event) {
            console.log("connectionDestroyed");
            session.disconnect();
            window.$("#expert-audio-call-interface-wrapper").fadeOut();
            var refreshIntervalId = state.refreshIntervalId;
            clearInterval(refreshIntervalId);
            setState({
              ...state,
              totalSeconds: 0,
              refreshIntervalId: "",
            });
          });

          session.on("sessionDisconnected", function (event) {
            console.log("sessionDisconnected");
            window.$("#expert-audio-call-interface-wrapper").fadeOut();
            var refreshIntervalId = state.refreshIntervalId;
            clearInterval(refreshIntervalId);
            setState({
              ...state,
              totalSeconds: 0,
              refreshIntervalId: "",
            });
          });

          session.on("streamDestroyed", function (event) {
            console.log("streamDestroyed");
            window.$("#expert-audio-call-interface-wrapper").fadeOut();
          });

          session.connect(state.apiToken, function (error) {
            if (error) {
              console.log("session connection error");
            } else {
              var pubOptions = {
                videoSource: null,
                width: 100,
                height: 75,
                insertMode: "append",
              };
              publisher = OT.initPublisher("expertPublisherAudio", pubOptions);
              session.publish(publisher);
            }
          });
        },
        (err) =>
          err.response.json().then(({ errors }) => {
            //alert('error');
          })
      )
    );
  };

  return (
    <div>
      {/* Incoming Audio Call : START  */}
      <div className="incomingAudioCall_main">
        <div className="incomingAudioCall_popup">
          <div className="modal-header">
            <h4 className="modal-title"> Incoming Call... </h4>
          </div>

          <div className="modal-body">
            <div className="userDetail">
              <div className="user_img">
                <img src="/img/Client-img.png" alt="" />
              </div>
              <h3> {state.audioCallFrom} </h3>
            </div>
          </div>

          <div className="modal-footer">
            <Button
              bsStyle="danger"
              onClick={() => {
                disconnectCall();
              }}
            >
              
              <img
                className="incoming_call disconnect_call"
                src="/img/call_cancel.png"
                alt=""
              />
            </Button>
            <Button
              bsStyle="success"
              onClick={() => {
                connectCall();
              }}
            >
              
              <img
                className="incoming_call receive_call"
                src="/img/call_pick_up.png"
                alt=""
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Incoming Audio Call : END  */}

      {/* Expert Audio Calling Wrapper : START  */}

      <div
        id="expert-audio-call-interface-wrapper"
        className={
          "expert-audio-call-interface-wrapper conn3 audio-call-interface-wrapper "
        }
      >
        <div className="panel panel-primary">
          <div className="panel-heading">Audio Calling...</div>
          <div className="panel-body audio_call_body">
            <div className="audio_user_call_img">
              <img src="/img/Client-img.png" alt="" />
            </div>
            <div className="audio_userrgt_content">
              <div id="expertPublisherAudio"></div>
              <div id="userSubscriberAudio"></div>
              <h3>{state.audioCallFrom}</h3>
              <h5>
                <label id="expert_audio_call_minutes">00</label>:
                <label id="expert_audio_call_seconds">00</label>
              </h5>
            </div>
            <button
              onClick={() => {
                disconnectAudioCall();
              }}
              className="btn btn-danger"
            >
              
              <img
                className="incoming_call disconnect_call"
                src="/img/call_cancel.png"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expert Audio Calling Wrapper : END  */}

      {/*  Expert Audio Calling interface : START */}
      {/*  <div id="expert-audio-call-interface-wrapper" className="expert-audio-call-interface-wrapper">
              <Panel header="Audio Calling..."  bsStyle="primary" >
                <div id="expertPublisherAudio"></div>
                <div id="userSubscriberAudio"></div>
                
                <button  onClick={ () => {disconnectAudioCall()} } className="btn btn-danger" type="button">Disconnect</button>
                
              </Panel>
            </div> */}
      {/*  Expert Audio Calling interface : END */}
    </div>
  );
};

export default ExpertAudioCall;
