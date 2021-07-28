import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Cookies, withCookies } from "react-cookie";
import { Panel } from "react-bootstrap";
import axios from "axios";
import { instanceOf } from "prop-types";

// import * as actions from '../actions/messaging';
import {
  startRecording,
  getArchiveSessionAndToken,
  stopRecording,
  sendRecording,
} from "../actions/expert";

import { API_URL, tokBoxApikey } from "../constants/api";
const OT = require("@opentok/client");
// const socket = actions.socket;

class AudioRecording extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      error: "",
      expertEmail: "",
      apiKey: "",
      apiSecret: "",
      apiToken: "",
      currentUser: this.props.cookies.get("user"),
      startAudioRecording: false,
      archiveSessionId: "",
      archiveStreamtoken: "",
      archiveID: "",
      connectionId: "",
      showRecordingPopup: false,
      pubOptions: { width: 150, height: 150, insertMode: "append" },
      publisher: "",
      sessionObj: "",
      totalSeconds: 0,
      refreshIntervalId: "",
      recording_audio_call_minutes: "00",
      recording_audio_call_seconds: "00",
    };
    this.setTime = this.setTime.bind(this);
    this.abortController = new AbortController();
    this._isMounted = false;
  }

  componentDidMount() {
    var slug = this.props.expertSlug;
    this._isMounted = true;
    var self = this;
    this._isMounted && axios
      .get(`${API_URL}/getExpertDetail/${slug}`, {signal: this.abortController.signal})
      .then((res) => {
        self._isMounted && this.setState({ expertEmail: res.data[0].email });
      })
      .catch((err) => {
        self._isMounted && this.setState({
          loading: false,
          error: err,
        });
      });
  }

  setTime() {
    var totalSeconds = this.state.totalSeconds;
    ++totalSeconds;
    var secondsLabel = this.pad(totalSeconds % 60);
    var minutesLabel = this.pad(parseInt(totalSeconds / 60));
    var recording_audio_call_seconds = secondsLabel;
    var recording_audio_call_minutes = minutesLabel;
    //$('#recording_audio_call_seconds').html(secondsLabel);
    //$('#recording_audio_call_minutes').html(minutesLabel);
    this.setState({
      totalSeconds,
      recording_audio_call_minutes,
      recording_audio_call_seconds,
    });
    // recording_audio_call_minutes
  }

  pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  startAudioRecording() {
    // var self = this;
    const expertEmail = this.state.expertEmail;
    const userEmail = this.state.currentUser.email;
    const archiveSessionId = this.state.archiveSessionId;

    this.props
      .startRecording({ expertEmail, userEmail, archiveSessionId })
      .then(
        (response) => {
          console.log(
            "**** startRecording success ****" + JSON.stringify(response)
          );
          this.setState({
            archiveID: response.archive.id,
            startAudioRecording: true,
          });

          var refreshIntervalId = setInterval(this.setTime, 1000);
          this.setState({
            refreshIntervalId,
          });
        },
        (err) =>
          err.response.json().then(({ errors }) => {
            console.log(
              "**** startRecording error ****" + JSON.stringify(errors)
            );
          })
      );
  }

  stopAudioRecording() {
    this.setState({
      //startAudioRecording: false
    });
    var self = this;
    const expertEmail = this.state.expertEmail;
    const userEmail = this.state.currentUser.email;
    const archiveID = this.state.archiveID;

    this.props.stopRecording({ expertEmail, userEmail, archiveID }).then(
      (response) => {
        //console.log('**** stopRecording success ****'+ JSON.stringify(response) );

        var refreshIntervalId = this.state.refreshIntervalId;
        clearInterval(refreshIntervalId);
        this.setState({
          totalSeconds: 0,
          refreshIntervalId: "",
          recording_audio_call_minutes: "00",
          recording_audio_call_seconds: "00",
          recordingResponse:
            "<div class='alert alert-success alert-success-custom text-center'>Message successfully sent!</div>",
        });

        setTimeout(function () {
          self.setState({ showRecordingPopup: false });
          self.state.sessionObj.disconnect();
        }, 2000);
      },
      (err) =>
        err.response.json().then(({ errors }) => {
          //console.log('**** stopRecording error ****'+ JSON.stringify(errors) );
        })
    );
  }

  audioRecordingPopup(mode) {
    if (!this.state.currentUser) {
      // if user is not logged in
      this.props.history.push("/login");
      this.props.cookies.set(
        "requiredLogin_for_session",
        "Please login to start recording",
        { path: "/" }
      );
      return;
    }

    const self = this;
    const expertEmail = this.state.expertEmail;
    const userEmail = this.state.currentUser.email;
    const archiveSessionId = this.state.archiveSessionId;
    var pubOptions = this.state.pubOptions;
    var publisher = this.state.publisher;
    var session = this.state.sessionObj;

    if (mode === "open") {
      this.setState({
        // loader: true,
        loader: false,
        showRecordingPopup: true,
      });
      this.props
        .getArchiveSessionAndToken({ expertEmail, userEmail, archiveSessionId })
        .then(
          (response) => {
            const archiveSessionId = response.archiveSessionId;
            const archiveStreamtoken = response.archiveStreamtoken;
            this.setState({
              archiveSessionId: archiveSessionId,
              archiveStreamtoken: archiveStreamtoken,
              //showRecordingPopup: true
            });
            session = OT.initSession(tokBoxApikey, archiveSessionId);
            this.setState({
              sessionObj: session,
            });
            session.connect(archiveStreamtoken, function (err, info) {
              if (err) {
                console.log(err.message || err);
              } else {
                publisher = OT.initPublisher(
                  "publisherRecordAudio",
                  pubOptions
                );
                session.publish(publisher);
                publisher.publishVideo(false);
                self.setState({
                  //showRecordingPopup: true,
                  loader: false,
                  publisher: publisher,
                });
              }
            });

            session.on("archiveStarted", function (event) {
              var archiveID = event.id;
              self.setState({
                archiveID: archiveID,
                startAudioRecording: true,
              });
              console.log("ARCHIVE STARTED");
            });

            session.on("archiveStopped", function (event) {
              var expertEmail = self.state.expertEmail;
              var userEmail = self.state.currentUser.email;
              var archiveID = event.id;
              setTimeout(function () {
                self.props
                  .sendRecording({ expertEmail, userEmail, archiveID })
                  .then(
                    (response) => {
                      console.log(
                        "**** sendRecording success ****" +
                          JSON.stringify(response)
                      );
                      archiveID = null;
                      self.setState({
                        archiveID: archiveID,
                      });
                    },
                    (err) =>
                      err.response.json().then(({ errors }) => {
                        console.log(
                          "**** sendRecording error ****" +
                            JSON.stringify(errors)
                        );
                      })
                  );
              }, 10000);
              self.setState({
                //archiveID: archiveID,
                startAudioRecording: false,
              });
              console.log("ARCHIVE STOPPED" + event.id);
            });
          },
          (err) => {}
        );
    } else if (mode === "close") {
      this.setState({
        showRecordingPopup: false,
      });
      this.state.sessionObj.disconnect();
    }
  }

  showRecordingPopup() {
    return (
      <div
        className={
          "record-audio-call-wrapper recoding_call_con " +
          (this.state.showRecordingPopup ? "show" : "")
        }
      >
        <Panel header={"Record a Message"} bsStyle="primary">
          <div
            style={
              this.state.loader ? { display: "block" } : { display: "none" }
            }
            className="loader-wrapper"
          >
            {this.renderLoading()}
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: this.state.recordingResponse }}
          ></div>
          <div
            style={
              !this.state.loader ? { display: "block" } : { display: "none" }
            }
            className="record-audio-wrapper"
          >
            <div
              onClick={this.audioRecordingPopup.bind(this, "close")}
              className="close"
            >
              x
            </div>
            <div id="publisherRecordAudio"></div>
            <div className="recording_dd_con">
              <div className="recording_timing">
                <label id="recording_audio_call_minutes">
                  {this.state.recording_audio_call_minutes}
                </label>
                :
                <label id="recording_audio_call_seconds">
                  {this.state.recording_audio_call_seconds}
                </label>
              </div>
              {!this.state.startAudioRecording ? (
                <Link
                  title="Start Audio Recording"
                  onClick={this.startAudioRecording.bind(this)}
                  className="start-audio-recording"
                  to="#!"
                >                
                  <span className="recording_start"></span>
                </Link>
              ) : (
                <Link
                  title="Stop Audio Recording"
                  onClick={this.stopAudioRecording.bind(this)}
                  className="stop-audio-recording"
                  to="#!"
                >             
                  <span className="recording_stop"></span>
                </Link>
              )}
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  closeRecordingPopup() {
    this.setState({
      showRecordingPopup: false,
    });
  }

  renderLoading() {
    return (
      <div className="position-relative">
        <img
          className="loader-center"
          src="/img/ajax-loader.gif"
          alt=""
        />
        <p className="text-center-init">Initiating...</p>
      </div>
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.abortController.abort();
  }

  render() {
    return (
      <div>
        <Link
          title="Record a Message"
          onClick={
            !this.state.showRecordingPopup
              ? this.audioRecordingPopup.bind(this, "open")
              : (e) => e.preventDefault()
          }
          to="#!"
          className="open-audio-recording-pop-up"
        >
          Recording
        </Link>
        {this.showRecordingPopup()}
      </div>
    );
  }
}

export default connect(null, {
  startRecording,
  getArchiveSessionAndToken,
  stopRecording,
  sendRecording,
})(withRouter(withCookies(AudioRecording)));
