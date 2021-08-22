/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Field, reduxForm } from "redux-form";
import Carousel from "react-image-carousel";
import { Cookies, withCookies } from "react-cookie";
import { Modal, Button } from "react-bootstrap";
import { instanceOf } from "prop-types";
// import StripeCheckout from 'react-stripe-checkout';

import ExpertReviews from "./ExpertReviews";
import AudioRecording from "./AudioRecording";
import CommentBox from "../components/comment/CommentBox";
import LazyImage from '../components/common/LazyImage';
import NotificationModal from "./notification-modal";
// import LoginModal from './login-modal';

import * as actions from "../actions/messaging";
import {
  sendEmail,
  sendTextMessage,
  checkBeforeSessionStart,
  createAudioSession,
  startRecording,
  stopRecording,
  rechargeVideoSession,
  getVideoSession,
} from "../actions/expert";
import {
  API_URL,
  CLIENT_ROOT_URL,
  Image_URL,
  tokBoxApikey,
} from "../constants/api";

const socket = actions.socket;
const OT = require("@opentok/client");

const form = reduxForm({
  form: "email-form",
});
const renderField = (field) => (
  <div>
    <input
      type="email"
      required
      placeholder="Your email here"
      className="form-control emailField"
      {...field.input}
    />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderFieldHidden = (field) => (
  <div>
    <input type="hidden" {...field.input} />
  </div>
);
const renderTextarea = (field) => (
  <div>
    <textarea
      required
      rows="3"
      placeholder="Your message here"
      className="form-control"
      {...field.input}
    ></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

class ViewExpert extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  /*** Class constructor. */
  constructor(props, context) {
    super(props, context);
    this.state = {
      category: "",
      showEndCallOptions: false,
      expert: "",
      firstName: "",
      lastName: "",
      resume_path: "",
      expertEmail: "",
      sessionBtnText: "",
      loading: false,
      error: null,
      sessionId: "",
      apiKey: "",
      apiSecret: "",
      apiToken: "",
      expertUsername: this.props.match.params.slug,
      expertAudioCallSokcetname:
        "expert-audio-session-" + this.props.match.params.slug,
      userAudioCallSokcetname: this.props.cookies.get("user")
        ? "user-audio-session-" + this.props.cookies.get("user").slug
        : "",
      currentUser: this.props.cookies.get("user"),
      showModal: false,
      //modalMessageNotification : "Alas, You have no donny's list wallet money in your account. Please recharge your account to start session.",
      //modalMessageNotification : "Please select time slot from the dropdown you want to spend with expert",
      modalMessageNotification: "",
      modalMessageNotAuthorized:
        "Dear Expert, You are not authorized to publish your session on someone's channel. Please publish on your channel.",
      startAudioRecording: false,
      archiveSessionId: "",
      archiveStreamtoken: "",
      archiveID: "",
      connectionId: "",
      pubOptions: { width: 100, height: 75, insertMode: "append" },
      publisherObj: "",
      sessionObj: "",
      openCallConnecting: false,
      audioCalling: false,
      newConAudioId: "",
      userConnectionId: "",
      university: "",
      totalSeconds: 0,
      refreshIntervalId: "",
      profileImage: "",
      endorsements: [],
      selectMins: 0,
      showCallLink: true,
      is_user_logged_in: "",
      categories: [],

      updated_name: "",
      updated_university: "",
      updated_area_of_experties1: "",
      updated_area_of_experties2: "",
      updated_years_of_experties: "",
      updated_focus_of_experties: "",
      first_name: "",
      last_name: "",
      profile_image: "",
      editable: true,
      file: "",
      resumeFile: "",
      base64_image: "",
      base64_file: "",
      submit_disabled: "",
      comments: [],
      instagramURL: "",
      linkedinURL: "",
      facebookURL: "",
      youtubeURL: "",
      websiteURL: "",
      twitterURL: "",
    };

    this.onChangeFile = this.onChangeFile.bind(this);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.selectMins = this.selectMins.bind(this);
    this.onToken = this.onToken.bind(this);
    this.setTime = this.setTime.bind(this);
    // handleFormSubmit
    this.handleTextMessageFormSubmit =
      this.handleTextMessageFormSubmit.bind(this);
    this.selectVideoSessionMinutes = this.selectVideoSessionMinutes.bind(this);

    var user = this.props.cookies.get("user");
    if (user) {
      // user cookie is set
      const userRole = user.role;
      if (userRole === "User") {
        //console.log('**** username ****'+user.slug);
        const username = user.slug;
        var userAudioCallSokcetname = "user-audio-session-" + username;
        socket.emit("expert audio call session", userAudioCallSokcetname);
        console.log(
          "*** expert audio call session : from user ***" +
            this.state.userAudioCallSokcetname
        );
      }
    }
  }
  selectMins(e) {
    this.setState({
      selectMins: parseInt(e.target.value),
    });
  }
  onToken(stripeToken) {
    try {
      const amount = this.state.selectMins; //default initial time is 30 minutes
      const userEmail = this.state.currentUser.email;
      const expertSlug = this.props.match.params.slug;
      //console.log('*** stripeToken *** '+stripeToken);
      //console.log('*** amount *** '+amount);
      this.props
        .rechargeVideoSession({ stripeToken, expertSlug, userEmail, amount })
        .then(
          (response) => {
            console.log("response: " + JSON.stringify(response));
          },
          (err) =>
            err.response.json().then(({ errors }) => {
              console.log("err: " + JSON.stringify(err));
            })
        );
    } catch (e) {
      console.log("catch error " + e.message);
    }
  }
  disconnectAudioCall() {
    this.state.sessionObj.disconnect();
  }
  open() {
    this.setState({ showModal: true });
  }
  close() {
    this.setState({ showModal: false });
  }
  /*email form submittion*/

  handleFormSubmit(formProps) {
    try {
      this.props.sendEmail(formProps).then(
        (response) => {
          this.setState({
            responseEmailMsg:
              "<div class='alert alert-success text-center'>" +
              response.message +
              "</div>",
          });
          setTimeout(function () {
            window.$(".alert").text("");
            window.$(".alert").removeClass("alert alert-success text-center");
            window.$("input[name='email").val("");
            window.$("textarea[name='message").val("");
          }, 2500);
        },
        (err) =>
          err.response.json().then(({ errors }) => {
            this.setState({
              responseEmailMsg:
                "<div class='alert alert-danger text-center'>" +
                errors +
                "</div>",
            });
            setTimeout(function () {
              window.$(".alert").text("");
              window.$(".alert").removeClass("alert alert-success text-center");
              window.$("input[name='email").val("");
              window.$("textarea[name='message").val("");
            }, 2500);
          })
      );
    } catch (e) {}
  }

  getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var temp = "";
    reader.onload = function () {
      temp = reader.result;
      window.$(".image_view").attr("src", reader.result);
    };
    setTimeout(
      () => this.setState({ base64_image: temp, submit_disabled: false }),
      1500
    );
  };

    getBase64Second = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var temp = "";
    reader.onload = function () {
      temp = reader.result;
    };
    setTimeout(
      () => this.setState({ base64_file: temp }),
      1500
    );
  };

  handleInputChange = (event) => {
    let newState = { ...this.state };
    newState[event.target.name] = event.target.value;
    console.log(newState)
    this.setState(newState);
  };

  triggerFileUpload = () => {
    console.log(this.state)
    if (this.state.editable === true) {
      this.fileInput.click();
    }
    // this.fileInput.click();
  };

  onChangeFile(e) {
    const name = e.target.name;
    if (name === "file") {
      this.getBase64(e.target.files[0]);
    } else {
      this.getBase64Second(e.target.files[0]);
    }
    this.setState({ [e.target.name]: e.target.files[0] });
  }

  upload = () => {
    var req_array = {
      base64_image: this.state.base64_image,
    };

    return axios
      .post(`${API_URL}/upload`, req_array)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*text message form submittion*/
  handleTextMessageFormSubmit(formProps) {
    try {
      formProps["text_expert_email"] = this.state.expertEmail;
      // console.log('formProps view-expert: '+JSON.stringify(formProps));
      this.props.sendTextMessage(formProps).then(
        (response) => {
          this.setState({
            responseTextMsg:
              "<div class='alert alert-success text-center'>" +
              response.message +
              "</div>",
          });
          setTimeout(function () {
            window.$(".alert").text("");
            window.$(".alert").removeClass("alert alert-success text-center");
            window.$("input[name='text_email").val("");
            window.$("textarea[name='text_message").val("");
            window.$(".emailField")[1].value = "";
          }, 2500);
        },
        (err) =>
          err.response.json().then(({ errors }) => {
            this.setState({
              responseTextMsg:
                "<div class='alert alert-danger text-center'>" +
                errors +
                "</div>",
            });
            setTimeout(function () {
              window.$(".alert").text("");
              window.$(".alert").removeClass("alert alert-success text-center");
              window.$("input[name='text_email").val("");
              window.$("textarea[name='text_message").val("");
            }, 2500);
          })
      );
    } catch (e) {}
  }

  audioCallNowButtonClick(e) {
    e.preventDefault();
    this.setState({
      openCallConnecting: true,
    });
    const self = this;
    const expertAudioCallSokcetname = this.state.expertAudioCallSokcetname;
    const audioCallFrom =
      this.state.currentUser.firstName + " " + this.state.currentUser.lastName;
    const expertEmail = this.state.expertEmail;
    const currentUser = this.props.cookies.get("user");
    const userEmail = currentUser.email;
    const username = currentUser.slug;

    console.log(
      "case 1 expertEmail: " + expertEmail + " userEmail: " + userEmail
    );

    this.props.createAudioSession({ expertEmail, userEmail, username }).then(
      (response) => {
        console.log(
          "**** createAudioSession this.state.sessionId ****" +
            JSON.stringify(response)
        );
        this.setState({ sessionId: response.sessionId });
        this.setState({ apiToken: response.token });
        var session = OT.initSession(tokBoxApikey, this.state.sessionId);

        this.setState({
          sessionObj: session,
          newConAudioId: response.newConAudioId,
        });

        var pubOptions = {
          videoSource: null,
          width: 100,
          height: 75,
          insertMode: "append",
        };
        var publisher = "";

        session.on("streamCreated", function (event) {
          console.log("streamCreated");
          publisher = OT.initPublisher("userPublisherAudio", pubOptions);
          session.publish(publisher);
          self.setState({
            publisherObj: publisher,
          });
          var options = { width: 100, height: 75, insertMode: "append" };
          // var subscriber =
          session.subscribe(event.stream, "expertSubscriberAudio", options);
          window.$("#user-audio-call-interface-wrapper").fadeIn();
          self.setState({
            openCallConnecting: false,
          });
          var refreshIntervalId = setInterval(self.setTime, 1000);
          self.setState({
            refreshIntervalId,
          });
        });
        session.on("connectionCreated", function (event) {
          console.log("connectionCreated");
        });
        session.on("connectionDestroyed", function (event) {
          console.log("connectionDestroyed");
          session.disconnect();
          window.$("#user-audio-call-interface-wrapper").fadeOut();
          var refreshIntervalId = self.state.refreshIntervalId;
          clearInterval(refreshIntervalId);
          self.setState({
            totalSeconds: 0,
            refreshIntervalId: "",
          });
        });
        session.on("sessionDisconnected", function (event) {
          console.log("sessionDisconnected");
          window.$("#user-audio-call-interface-wrapper").fadeOut();
          var refreshIntervalId = self.state.refreshIntervalId;
          clearInterval(refreshIntervalId);
          self.setState({
            totalSeconds: 0,
            refreshIntervalId: "",
          });
        });
        session.on("streamDestroyed", function (event) {
          console.log("streamDestroyed");
        });
        session.connect(this.state.apiToken, function (error) {
          if (error) {
            console.log("session connection error");
          } else {
            var data = {
              expertAudioCallSokcetname: expertAudioCallSokcetname,
              audioCallFrom: audioCallFrom,
              newConAudioId: self.state.newConAudioId,
              userAudioCallSokcetname: self.state.userAudioCallSokcetname,
              userConnectionId: session.connection.connectionId,
            };
            socket.emit("audio call to expert", data);
            //console.log('*** audio call to expert on session connect ***'+self.state.userAudioCallSokcetname);
            self.setState({
              userConnectionId: session.connection.connectionId,
            });
          }
        });
      },
      (err) =>
        err.response.json().then(({ errors }) => {
          console.log(
            "**** createAudioSession error ****" + JSON.stringify(errors)
          );
        })
    );
  }

  // i have added

  getsubcategories = (event) => {
    console.log("sub category-----");
    console.log(event.target.value);
    this.setState({
      updated_area_of_experties1: event.target.value,
    });
    axios
      .get(`${API_URL}/getExpertsSubCategoryList/` + event.target.value)
      .then((res) => {
        this.setState({ subcategories: res.data["0"].subcategory });
      });
  };

  deleteAccount = () => {
    if( global.confirm('Do you really want to delete your account?') ){

    }
  }

  saveChanges = () => {

    if (this.state.submit_disabled === true) {
      console.log("submit is disabled");
      return false;
    } else {
      console.log("submit enabled");
    }

    const {
      updated_name,
      updated_university,
      updated_area_of_experties2,
      updated_years_of_experties,
      updated_focus_of_experties,
      profileImage,
      // file,
    } = this.state;

    if (!updated_name.trim()) {
      alert("Please enter Full name");
      return false;
    }

    if (!updated_area_of_experties2) {
      alert("Please select area of experties");
      return false;
    }

    const request_array = {
      user_email: this.state.currentUser.email,
      updated_name: updated_name,
      updated_university: updated_university,
      updated_area_of_experties2: updated_area_of_experties2,
      updated_years_of_experties: updated_years_of_experties,
      updated_focus_of_experties: updated_focus_of_experties,
      profileImage: profileImage,
      file: this.state.base64_image,
      resume: this.state.base64_file,
      files: {
        profile: this.state.file,
        resume: this.state.resumeFile,
      },
      instagramURL: this.state.instagramURL,
      linkedinURL: this.state.linkedinURL,
      twitterURL: this.state.twitterURL,
      facebookURL: this.state.facebookURL,
      websiteURL: this.state.websiteURL,
      youtubeURL: this.state.youtubeURL,
    };


    return axios
      .post(`${API_URL}/userExpertUpdate`, request_array, {
        ///headers: { Authorization: cookie.load('token') },
      })
      .then((response) => {
        console.log(response);
        if (!response.data.success) {
          this.setState({
            responseMsg:
              "<div class='alert alert-danger text-center'>" +
              response.data.error +
              "</div>",
          });

          window.$(".form-control").val("");
          window.$("form").each(function () {
            this.reset();
          });
        }

        if (response.data.success) {
          console.log("----here in success ---");
          console.log(response.data);
          console.log("----here in success 2---");
          this.props.history.push("/profile")
          this.setState({
            updated_name:
              response.data.first_name + " " + response.data.last_name,

            profile_image: response.data.profile_image,
            profileImage: response.data.profile_image,

            // profile_image: response.data.user_data.profileImage,
            // profileImage: response.data.user_data.profileImage,

            updated_university: response.data.user_data.university,
            updated_area_of_experties2:
              response.data.user_data.expertCategories[0],
            updated_years_of_experties: response.data.user_data.yearsexpertise,
            updated_focus_of_experties:
              response.data.user_data.expertFocusExpertise,
            editable: "",
          });

          localStorage.setItem("editable", "");

          var path = window.location.pathname;
          var url = window.location.href;
          var final_url = url.split(path);

          final_url = final_url[0];

          final_url =
            final_url +
            "/expert/" +
            response.data.category +
            "/" +
            response.data.slug;

          console.log("-----------reached here-----------");


          this.setState({
            responseMsg:
              "<div class='alert alert-success text-center'>" +
              response.data.message +
              "</div>",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          responseMsg:
            "<div class='alert alert-danger text-center'>" + error + "</div>",
        });
      });
  };

  // for image upload

  // for image upload

  // my function

  componentDidMount() {
    window.$(document).on("click", ".change_image", function () {
      window.$("#upload_image").trigger("click");
    });
    window.scrollTo(0, 0);
    var slug = this.props.match.params.slug;
    axios.get(`${API_URL}/getExpertDetail/${slug}`).then((res) => {
      // const expert = res.data[0];
      if (this.state.currentUser?.email === res.data[0].email) {
        this.setState({
          is_user_logged_in: true,
        });
      } else {
        this.setState({
          is_user_logged_in: "",
        });
      }
    });

    // for get comments duplicate
    // axios.get(`${API_URL}/getComments_changed/${slug}`).then((res) => {
    //   if (!res.data.success) {
    //     this.setState({ error: res.data.error });
    //   } else {
    //     // this.setState({ data: res.data.data });
    //     this.setState({ comments: res.data.data });

    //     console.log("------------testing--------------");
    //     for(let item of res.data.data) {
    //       console.log(item.author)
    //     }
    //   }
    // });
    // for get comments duplicate

    if (this.props.match.params.category === "new_category") {
      this.setState({
        editable: true,
      });
    } else {
      // if (localStorage.getItem("editable") === "true") {
        this.setState({
          editable: true,
        });
        // localStorage.setItem("editable", "");
      // } else {
      //   this.setState({
      //     editable: "",
      //   });
      // }
    }
  }
  // i have added

  componentWillMount() {
    axios.get(`${API_URL}/getExpertsCategoryList`).then((res) => {
      this.setState({ categories: res.data });
      for (let key of res.data) {
        if (key.name === "Music Lessons") {
          this.setState({ musicCategories: key });
        }
      }
    });

    var slug = this.props.match.params.slug;
    axios
      .get(`${API_URL}/getExpertDetail/${slug}`)
      .then((res) => {
        const expert = res.data[0];
        // console.log("componentDidMount")

        console.log(res.data[0]);
        this.setState({ firstName: res.data[0].profile.firstName });
        this.setState({ lastName: res.data[0].profile.lastName });
        // this.setState({ profileImage : res.data[0].profile.profileImage });
        // this.setState({ profileImage : res.data[0].profileImage });
        this.setState({ expertEmail: res.data[0].email });
        this.setState({ onlineStatus: res.data[0].onlineStatus });
        this.setState({ profileImage: res.data[0].profileImage });
        this.setState({ instagramURL: res.data[0].instagramURL });
        this.setState({ linkedinURL: res.data[0].linkedinURL });
        this.setState({ facebookURL: res.data[0].facebookURL });
        this.setState({ twitterURL: res.data[0].twitterURL });
        this.setState({ youtubeURL: res.data[0].youtubeURL });
        this.setState({ websiteURL: res.data[0].websiteURL });
        this.setState({ resume_path: res.data[0].resume_path });
        this.setState({ university: res.data[0].university });
        this.setState({ expert, loading: true, error: null });

        this.setState({
          first_name:
            this.state.expert.profile.firstName !== "undefined"
              ? this.state.expert.profile.firstName
              : " ",
        });
        if (
          this.state.expert.profile.lastName !== "undefined" &&
          this.state.expert.profile.lastName !== "" &&
          this.state.expert.profile.lastName !== null
        ) {
          this.setState({
            last_name:
              this.state.expert.profile.lastName !== "undefined"
                ? this.state.expert.profile.lastName
                : " ",
          });
        }

        this.setState({
          updated_name: this.state.first_name + " " + this.state.last_name,
          profile_image: this.state.first_name + " " + this.state.profile_image,
          updated_area_of_experties2: this.state.expert.expertCategories[0],
          updated_years_of_experties: this.state.expert.yearsexpertise,
          updated_focus_of_experties: this.state.expert.expertFocusExpertise,
          updated_university: this.state.expert.university,
        });

        const logged_user_email = this.state.currentUser
          ? this.state.currentUser.email
          : "";
        const scheduleData = {
          userEmail: logged_user_email,
          expertEmail: expert.email,
        };
        this.props.getVideoSession(scheduleData).then((response) => {
          // console.log('----------55555555-----------');
          // console.log(response)
          if (response?.success) {
            this.setState({
              showCallLink: false,
            });
          }
        });

        const data = res.data[0].endorsements;
        axios
          .post(`${API_URL}/getEndorsements/`, { slug: data })
          .then((res) => {
            this.setState({
              endorsements: res.data,
              loading: false,
              error: null,
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              error: err,
            });
          });
      })
      .catch((err) => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err,
        });
      });

    window.$(document).ready(function () {
      window.$("#send_email_form").validate({
        rules: {
          email: { required: true, email: true },
          message: { required: true },
        },
        messages: {
          email: { required: "Please enter this field" },
          message: { required: "Please enter this field" },
        },
      });
      window.$("#send_text_form").validate({
        rules: {
          email: { required: true, email: true },
          message: { required: true },
        },
        messages: {
          email: { required: "Please enter this field" },
          message: { required: "Please enter this field" },
        },
      });
    });
    var self = this;
    socket.on("disconnect incoming audio call to user", function (data) {
      console.log(
        "*** disconnect incoming audio call to user ***" +
          data.userAudioCallSokcetname
      );
      self.state.sessionObj.disconnect();
      self.setState({ openCallConnecting: false });
    });
    //console.log('*** customerId : '+ this.state.currentUser.customerId);
  }
  setTime() {
    var totalSeconds = this.state.totalSeconds;
    ++totalSeconds;
    this.setState({ totalSeconds: totalSeconds });
    var secondsLabel = this.pad(totalSeconds % 60);
    var minutesLabel = this.pad(parseInt(totalSeconds / 60));
    window.$("#user_audio_call_seconds").html(secondsLabel);
    window.$("#user_audio_call_minutes").html(minutesLabel);
  }
  pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
  renderLoading() {
    /*return <img className="loader-center" src="/img/ajax-loader.gif"/>;*/
    return "";
  }
  renderError() {
    if (this.state.expert === undefined) {
      return (
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="breadcrumb-item active">
                    {this.props.match.params.category}
                  </li>
                </ol>
                <div id="center">
                  <div id="pageTitle">
                    <div className="title">
                      {this.props.match.params.category}
                    </div>
                    <div className="alert-danger alert">
                      Alas, No expert found in this category!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="breadcrumb-item active">
                    {this.props.match.params.category}
                  </li>
                </ol>
                <div id="center">
                  <div id="pageTitle">
                    <div className="title">
                      {this.props.match.params.category}
                    </div>
                    <div className="alert-danger alert">
                      Uh oh: {this.state.error.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  getOnlineStatus(onlineStatus) {
    return onlineStatus === "ONLINE" ? true : false;
  }
  getOnlineStatusTitle(onlineStatus) {
    if (onlineStatus === "ONLINE") {
      return "Online";
    } else {
      return "Offline";
    }
  }
  selectVideoSessionMinutes(e) {
    e.preventDefault();
    window.$(".notification-modal").trigger("click");
  }
  /*Function called before redirecting user to session page to check valid user access*/
  startSessionCheck() {
    const currentUser = this.props.cookies.get("user");
    const expertEmail = this.state.expertEmail;
    const expertSlug = this.props.match.params.slug;
    const userEmail = currentUser.email;
    const userRole = currentUser.role;
    const userSlug = currentUser.slug;
    /*case 1: when logged in user is not expert and role is equal to User */
    if (userEmail !== expertEmail && userRole !== "Expert") {
      this.props
        .checkBeforeSessionStart({
          expertEmail: expertEmail,
          userEmail: userEmail,
        })
        .then(
          (response) => {
            // console.log('-----------1111---------');
            // console.log(JSON.stringify(response));
            if (response.session !== null) {
              //if(response.session.stripePaymentStatus === "succeeded") {
              if (response.status === 1) {
                window.location.href =
                  `${CLIENT_ROOT_URL}/mysession/` +
                  this.props.match.params.slug;
              } else {
                this.setState({
                  modalMessageNotification:
                    "Something went wrong, please contact website admin.",
                });
              }
            } else {
              window.$(".notification-modal").trigger("click");
            }
          },
          (err) =>
            err.response.json().then(({ errors }) => {
              console.log("errors: " + JSON.stringify(errors));
            })
        );
    } else if (
      userEmail === expertEmail &&
      userRole === "Expert" &&
      expertSlug === userSlug
    ) {
      /*case 2: when logged in user is expert and role is equal to Expert, then no need for payment process */
      window.location.href =
        `${CLIENT_ROOT_URL}/mysession/` + this.props.match.params.slug;
    } else {
      this.setState({ showModal: true });
    }
  }
  redirectToLogin(e) {
    e.preventDefault();
    this.props.history.push("/login");
    this.props.cookies.set(
      "requiredLogin_for_session",
      "Please login to start video session",
      { path: "/" }
    );
  }

  toggleCallLinks(v) {
    this.setState({
      showCallLink: v,
    });
  }

  renderPosts() {
    const currentUser = this.props.cookies.get("user");

    // my constants
    const renderFieldexpertCategories = (field) => {
      return (
        <div>
          <select
            name="expertCategories"
            className="form-control"
            {...field.input}
            onChange={this.getsubcategories}
            value={this.state.updated_area_of_experties1}
          >
            <option>Select</option>

            {this.state.categories.map((cats, i) => (
              <option value={cats._id} key={`OPTION_${i}`}>
                {cats.name}
              </option>
            ))}
          </select>
          {field.touched && field.error && (
            <div className="error">{field.error}</div>
          )}
        </div>
      );
    };

    const renderFieldexpertSubCategories = (field) => {
      // console.log(this.state.subcategories);
      return (
        <div>
          {this.state.subcategories ? (
            <select
              name="expertSubCategories"
              className="form-control"
              {...field.input}
            >
              <option value="">Select</option>
              {this.state.subcategories.map((cats, i) => (
                <option value={cats.slug} key={`OPT_${i}`}>
                  {cats.name}
                </option>
              ))}
            </select>
          ) : (
            <select name="expertSubCategories" className="form-control">
              <option
                value={
                  this.state.updated_area_of_experties2 !== "undefined"
                    ? this.state.updated_area_of_experties2
                    : ""
                }
              >
                {this.state.updated_area_of_experties2 !== "undefined"
                  ? this.state.updated_area_of_experties2
                  : ""}
              </option>
            </select>
          )}

          {field.touched && field.error && (
            <div className="error">{field.error}</div>
          )}
        </div>
      );
    };

    // my constants

    /*if(currentUser.role === "Expert") {
      this.setState({ sessionBtnText : "Start Session" });
    }else if(currentUser.role === "User") {
      this.setState({ sessionBtnText : "Join Session" });
    } else {
      this.setState({ sessionBtnText : "Join Session" });
    }
    console.log('sessionBtnText: '+this.state.sessionBtnText);
    */
    const endorsements_render = this.state.endorsements.map(
      (endorsement, index) => {
        // const url = `${Image_URL}`+endorsement.profileImage;
        const url = Image_URL + endorsement.profileImage;
        const default_url = "/img/profile.png";
        return (
          <img
            key={`IMG_${index}`}
            className="endorsement-image"
            height="50"
            width="50"
            src={
              endorsement.profileImage &&
              endorsement.profileImage !== null &&
              endorsement.profileImage !== undefined &&
              endorsement.profileImage !== ""
                ? url
                : default_url
            }
            alt=""
          />
        );
      }
    );

    if (this.state.error) {
      return this.renderError();
    }
    let images = [
      "https://grace951.github.io/react-image-carousel/img/landing1.jpg",
      "https://grace951.github.io/react-image-carousel/img/landing3.jpg",
      "https://grace951.github.io/react-image-carousel/img/landing5.jpg",
    ];
    const { handleSubmit } = this.props;
    const { showCallLink } = this.state;
    return (
      <div id="view-experts" className="view-experts">
        {/* modal to show notifications to unauthorized user */}
        <Modal
          className="modal-container"
          show={this.state.showModal}
          onHide={this.close}
          animation={true}
          bsSize="large"
        >
          <Modal.Header closeButton>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalMessageNotAuthorized}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
        {/* modal to show notifications to unauthorized user */}
        <div className="container">
          <div className="row">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="breadcrumb-item">
                <NavLink to={`/list/${this.props.match.params.category}`}>
                  {this.props.match.params.category}
                </NavLink>
              </li>
              <li className="breadcrumb-item active">
                {this.props.match.params.slug}
              </li>
            </ol>
          </div>
        </div>
        <div className="expert-list-wrap">
          <div className="container">
            <div className="row">
              <div className="expert-list-inner-wrap">
                <div className="col-sm-12">
                  <div className="expert-detail-wrap">
                    <div className="row">
                      <div className="col-md-3 col-sm-4">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={(fileInput) => (this.fileInput = fileInput)}
                          name="file"
                          className="form-control"
                          onChange={this.onChangeFile}
                        />
                        <button
                          style={{ display: "none" }}
                          onClick={() => {
                            this.upload();
                          }}
                        >
                          Upload
                        </button>

                        <div
                          className="expert-img change_image"
                          onClick={() => {
                            // this.triggerFileUpload();
                          }}
                        >
                          {
                            this.state.editable &&
                            <img 
                              style={{position:"absolute", left: 40, bottom: 10, width: 30, height: 30, opacity: '80%', background: 'grey', borderRadius: '4px', padding: '1px 3px'}} 
                              src="/img/camera-icon.png"
                              onClick={this.triggerFileUpload}
                            />
                          }
                          {this.state.profileImage &&
                          this.state.profileImage !== null &&
                          this.state.profileImage !== undefined &&
                          this.state.profileImage !== "" ? (
                            <LazyImage
                              className="image_view"
                              height=""
                              width=""
                              src={Image_URL + this.state.profileImage}
                              placeholder="/img/profile.png"
                              alt=""
                            />
                          ) : (
                            ""
                          )}
                          {this.state.profileImage === null ||
                          this.state.profileImage === undefined ||
                          this.state.profileImage === "" ? (
                            <img
                              className="image_view"
                              src="/img/profile.png"
                              alt=""
                            />
                          ) : (
                            ""
                          )}
                          {this.getOnlineStatus(this.state.onlineStatus) && (
                            <i
                              data-toggle="title"
                              title="Online"
                              className={"user-online-o fa fa-circle"}
                              aria-hidden="true"
                            ></i>
                          )}
                        </div>
                        <ul className="Action_icon">
                          {showCallLink && (
                            <li>
                              {currentUser ? (
                                <a
                                  data-toggle="modal"
                                  title="Start Video Session"
                                  data-target="#notificationModal"
                                  onClick={
                                    /*this.startSessionCheck.bind(this)*/
                                    this.selectVideoSessionMinutes
                                  }
                                  className="Start-Session"
                                >
                                  {" "}
                                </a>
                              ) : (
                                <div>
                                  <a
                                    title="Start Video Session"
                                    onClick={this.redirectToLogin.bind(this)}
                                    className="Start-Session"
                                  >
                                    {" "}
                                  </a>
                                </div>
                              )}
                            </li>
                          )}
                          <li>
                            <a
                              title="Send E-Mail"
                              data-toggle="modal"
                              data-target="#myModalEmail"
                              className="Send_E-Mail"
                            >
                              Send E-Mail
                            </a>
                          </li>
                          <li>
                            <a
                              title="Send Text Message"
                              data-toggle="modal"
                              data-target="#myModalTextMessage"
                              className="Send-Text-Message"
                            >
                              Send Text Message
                            </a>
                          </li>
                          <li>
                            <a
                              href={`${Image_URL}` + this.state.resume_path}
                              title="Download Resume"
                              download
                              className="Download-Resume"
                            >
                              Download Resume
                            </a>
                          </li>
                          {showCallLink && (
                            <li>
                              {currentUser ? (
                                <a
                                  title="Audio Call"
                                  onClick={this.audioCallNowButtonClick.bind(
                                    this
                                  )}
                                  className="Audio-Call"
                                >
                                  Audio Call
                                </a>
                              ) : (
                                <a
                                  title="Audio Call"
                                  data-toggle="modal"
                                  data-target="#myModalAudio"
                                  className="Audio-Call"
                                >
                                  Audio Call
                                </a>
                              )}
                            </li>
                          )}
                          <li>
                            <AudioRecording
                              expertSlug={this.props.match.params.slug}
                            />
                          </li>
                        </ul>
                        <div>
                          {/*<Link title="Start Session" to="javascript:void(0)" data-toggle="modal" className="notification-modal" data-target="#notificationModal"></Link>*/}
                          {currentUser ? (
                            <NotificationModal
                              userEmail={currentUser.email}
                              expertSlug={this.props.match.params.slug}
                              expert={this.state.expert}
                              modalId="notificationModal"
                              modalMessage={this.state.modalMessageNotification}
                              toggleCallLinks={this.toggleCallLinks.bind(this)}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        {/* <div className="">
                          <div className="form-group">
                            <label>Select mins : </label>
                            <select className="form-control" onChange={ this.selectMins }>
                              <option value="0">Select Mins</option>
                              <option value="15">15 mins</option>
                              <option value="30">30 mins</option>
                              <option value="45">45 mins</option>
                              <option value="60">1 hr</option>
                            </select>
                          </div>
                          <StripeCheckout token={ this.onToken} stripeKey={ stripeKey } panelLabel="Pay Now!" name="Donny's List Wallet Money"> <button type="button"  className="btn btn-primary">Add Money to Wallet</button></StripeCheckout>
                      </div> */}
                      </div>
                      {/*  Audio Calling : START  */}
                      <div
                        id="user-audio-call-interface-wrapper"
                        className={
                          "expert-audio-call-interface-wrapper conn3 audio-call-interface-wrapper"
                        }
                      >
                        <div className="panel panel-primary">
                          <div className="panel-heading">Audio Calling...</div>
                          <div className="panel-body audio_call_body">
                            <div className="audio_user_call_img">
                              <img src="/img/Client-img.png" alt="" />
                            </div>
                            <div className="audio_userrgt_content">
                              <div id="userPublisherAudio"></div>
                              <div id="expertSubscriberAudio"></div>
                              <h3>
                                {this.state.firstName +
                                  " " +
                                  this.state.lastName}
                              </h3>
                              <h5>
                                <label id="user_audio_call_minutes">00</label>:
                                <label id="user_audio_call_seconds">00</label>
                              </h5>
                            </div>
                            <button
                              onClick={this.disconnectAudioCall.bind(this)}
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
                      {/* Audio Calling : END */}
                      <div
                        className={
                          "expert-audio-call-interface-wrapper conn3 call_connecting " +
                          (this.state.openCallConnecting ? "open" : "close")
                        }
                      >
                        <div className="panel panel-primary">
                          <div className="panel-heading">Connecting...</div>
                          <div className="panel-body audio_call_body">
                            <div className="connecting_call_con">
                              <div className="audio_user_call_img">
                                <img src="/img/Client-img.png" alt="" />
                              </div>
                              <div className="connect_loading">
                                <div className="spinner">
                                  <div className="bounce1"></div>
                                  <div className="bounce2"></div>
                                  <div className="bounce3"></div>
                                </div>
                              </div>
                              <div className="audio_user_call_img flt_rgt">
                                <img src="/img/Client-img.png" alt="" />
                              </div>
                            </div>
                            <button className="btn btn-danger">
                              <img
                                className="incoming_call disconnect_call"
                                src="/img/call_cancel.png"
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-9 col-sm-8">
                        {true ? (
                          <div className="profile-detail">
                            <div className="name">
                              <dl className="dl-horizontal">
                                <div className="profile-bor-detail">
                                  <dt>Name</dt>
                                  <dd>
                                    {/*<div className="text-left-detail">{ this.state.expert.profile.firstName } { this.state.expert.profile.lastName }</div>*/}
                                    <div className="text-left-detail">
                                      <input
                                        className="form-control"
                                        onChange={(e) => {
                                          this.setState({
                                            updated_name: e.target.value,
                                          });
                                        }}
                                        defaultValue={this.state.updated_name}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        float: "right",
                                        textTransform: "capitalize",
                                      }}
                                      className="text-right label label-primary"
                                    >
                                      <i
                                        className="fa fa-bars"
                                        aria-hidden="true"
                                      ></i>
                                      {this.props.match.params.category}
                                    </div>
                                  </dd>
                                </div>
                                <div className="profile-bor-detail">
                                  <dt>University</dt>
                                  {/*<dd>{ this.state.expert.university }</dd>*/}
                                  <dd>
                                    <input
                                      className="form-control"
                                      onChange={(e) => {
                                        this.setState({
                                          updated_university: e.target.value,
                                        });
                                      }}
                                      defaultValue={
                                        this.state.expert.university
                                      }
                                    />
                                  </dd>
                                </div>
                                <div className="profile-bor-detail">
                                  <dt>Area of expertise</dt>
                                  {/*<dd>{ this.state.expert.expertCategories }</dd>*/}
                                  <dd>
                                    <div className="inputs">
                                      <Field
                                        name="categories"
                                        className="form-control"
                                        onChange={(e) => {
                                          this.setState({
                                            updated_area_of_experties1:
                                              e.target.value,
                                          });
                                        }}
                                        component={renderFieldexpertCategories}
                                        type="select"
                                        required
                                      />
                                      <Field
                                        name="expertise"
                                        className="form-control"
                                        onChange={(e) => {
                                          this.setState({
                                            updated_area_of_experties2:
                                              e.target.value,
                                          });
                                        }}
                                        component={
                                          renderFieldexpertSubCategories
                                        }
                                        type="select"
                                        required
                                      />
                                    </div>
                                  </dd>
                                </div>
                                <div className="profile-bor-detail">
                                  <dt>Years of expertise</dt>
                                  {/*<dd>{ this.state.expert.yearsexpertise }</dd>*/}
                                  <dd>
                                    <input
                                      className="form-control"
                                      onChange={(e) => {
                                        this.setState({
                                          updated_years_of_experties:
                                            e.target.value,
                                        });
                                      }}
                                      defaultValue={
                                        this.state.updated_years_of_experties
                                      }
                                    />
                                  </dd>
                                </div>
                                <div className="profile-bor-detail">
                                  <dt>Focus of expertise</dt>
                                  {/*<dd>{ this.state.expert.expertFocusExpertise }</dd>*/}
                                  <dd>
                                    <input
                                      className="form-control"
                                      onChange={(e) => {
                                        this.setState({
                                          updated_focus_of_experties:
                                            e.target.value,
                                        });
                                      }}
                                      defaultValue={
                                        this.state.updated_focus_of_experties
                                      }
                                    />
                                  </dd>
                                </div>
                                {/*}<div className="profile-bor-detail">
                                <dt>Rates</dt>
                                <dd>{ this.state.expert.expertRates }</dd>
                            </div>{*/}
                                <div className="profile-bor-detail">
                                  <dt>Rating</dt>
                                  <dd>
                                    {this.state.expert.expertRating &&
                                    this.state.expert.expertRating !== null &&
                                    this.state.expert.expertRating !==
                                      undefined &&
                                    this.state.expert.expertRating !== ""
                                      ? this.state.expert.expertRating
                                      : "No Ratings Available"}
                                    {this.state.expert.expertRating &&
                                      this.state.expert.expertRating !== null &&
                                      this.state.expert.expertRating !==
                                        undefined &&
                                      this.state.expert.expertRating !== "" && (
                                        <i
                                          className="fa fa-star"
                                          aria-hidden="true"
                                        ></i>
                                      )}
                                  </dd>
                                </div>
                                {/*<div className="profile-bor-detail">
                              <dt>About Expert </dt>
                              <dd>{ this.state.expert.userBio && this.state.expert.userBio!=null && this.state.expert.userBio!=undefined && this.state.expert.userBio!="" ? this.state.expert.userBio : "-"}</dd>
                            </div>
                            <div className="profile-bor-detail">
                              <dt>Country </dt>
                              <dd>{ this.state.expert.locationCountry && this.state.expert.locationCountry!=null && this.state.expert.locationCountry!=undefined && this.state.expert.locationCountry!="" ? this.state.expert.locationCountry :"-"}</dd>
                            </div>
                            <div className="profile-bor-detail">
                              <dt>State </dt>
                              <dd>{ this.state.expert.locationState && this.state.expert.locationState!=null && this.state.expert.locationState!=undefined && this.state.expert.locationState!="" ? this.state.expert.locationState : "-"}</dd>
                            </div>
                            <div className="profile-bor-detail">
                              <dt>City </dt>
                              <dd>{ this.state.expert.locationCity && this.state.expert.locationCity!=null && this.state.expert.locationCity!=undefined && this.state.expert.locationCity!="" ? this.state.expert.locationCity : "-"}</dd>
                            </div>*/}
                                <div className="profile-bor-detail expert-social-links">
                                  <dt>Social link </dt>
                                  <dd>
                                    {this.state.expert.facebookURL &&
                                    this.state.expert.facebookURL !== null &&
                                    this.state.expert.facebookURL !==
                                      undefined &&
                                    this.state.expert.facebookURL !== "" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          this.state.expert.facebookURL
                                            ? this.state.expert.facebookURL
                                            : "#"
                                        }
                                        title="facebook"
                                        rel="noreferrer"
                                      >
                                        <i
                                          className="fa fa-facebook-official"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    ) : (
                                      <div className="input-holder">
                                        <input
                                          onChange={this.handleInputChange}
                                          name="facebookURL"
                                          placeholder="facebook"
                                          className="form-control mt-10"
                                        />
                                      </div>
                                    )}
                                    {this.state.expert.twitterURL &&
                                    this.state.expert.twitterURL !== null &&
                                    this.state.expert.twitterURL !==
                                      undefined &&
                                    this.state.expert.twitterURL !== "" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          this.state.expert.twitterURL
                                            ? this.state.expert.twitterURL
                                            : "#"
                                        }
                                        title="twitter"
                                        rel="noreferrer"
                                      >
                                        <i
                                          className="fa fa-twitter"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    ) : (
                                      <div className="input-holder">
                                        <input
                                          onChange={this.handleInputChange}
                                          name="twitterURL"
                                          placeholder="twitter"
                                          className="form-control mt-10"
                                        />
                                      </div>
                                    )}
                                    {this.state.expert.linkedinURL &&
                                    this.state.expert.linkedinURL !== null &&
                                    this.state.expert.linkedinURL !==
                                      undefined &&
                                    this.state.expert.linkedinURL !== "" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          this.state.expert.linkedinURL
                                            ? this.state.expert.linkedinURL
                                            : "#"
                                        }
                                        title="linkedin"
                                        rel="noreferrer"
                                      >
                                        <i
                                          className="fa fa-linkedin"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    ) : (
                                      <div className="input-holder">
                                        <input
                                          onChange={this.handleInputChange}
                                          name="linkedinURL"
                                          placeholder="linkedin"
                                          className="form-control mt-10"
                                        />
                                      </div>
                                    )}
                                    {this.state.expert.instagramURL &&
                                    this.state.expert.instagramURL !== null &&
                                    this.state.expert.instagramURL !==
                                      undefined &&
                                    this.state.expert.instagramURL !== "" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          this.state.expert.instagramURL
                                            ? this.state.expert.instagramURL
                                            : "#"
                                        }
                                        title="instagram"
                                        rel="noreferrer"
                                      >
                                        <i
                                          className="fa fa-instagram"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    ) : (
                                      <div className="input-holder">
                                        <input
                                          onChange={this.handleInputChange}
                                          name="instagramURL"
                                          placeholder="instagram"
                                          className="form-control mt-10"
                                        />
                                      </div>
                                    )}
                                    {this.state.expert.snapchatURL &&
                                      this.state.expert.snapchatURL !== null &&
                                      this.state.expert.snapchatURL !==
                                        undefined &&
                                      this.state.expert.snapchatURL !== "" && (
                                        <a
                                          target="_blank"
                                          href={
                                            this.state.expert.snapchatURL
                                              ? this.state.expert.snapchatURL
                                              : "#"
                                          }
                                          title="snapchat"
                                          rel="noreferrer"
                                        >
                                          <i
                                            className="fa fa-snapchat"
                                            aria-hidden="true"
                                          ></i>
                                        </a>
                                      )}
                                    {this.state.expert.websiteURL &&
                                    this.state.expert.websiteURL !== null &&
                                    this.state.expert.websiteURL !==
                                      undefined &&
                                    this.state.expert.websiteURL !== "" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          this.state.expert.websiteURL
                                            ? this.state.expert.websiteURL
                                            : "#"
                                        }
                                        title="website"
                                        rel="noreferrer"
                                      >
                                        <i
                                          className="fa fa-anchor"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    ) : (
                                      <div className="input-holder">
                                        <input
                                          onChange={this.handleInputChange}
                                          name="websiteURL"
                                          placeholder="website"
                                          className="form-control mt-10"
                                        />
                                      </div>
                                    )}
                                    {this.state.expert.googleURL &&
                                      this.state.expert.googleURL !== null &&
                                      this.state.expert.googleURL !==
                                        undefined &&
                                      this.state.expert.googleURL !== "" && (
                                        <a
                                          target="_blank"
                                          href={
                                            this.state.expert.googleURL
                                              ? this.state.expert.googleURL
                                              : "#"
                                          }
                                          title="google"
                                          rel="noreferrer"
                                        >
                                          <i
                                            className="fa fa-google"
                                            aria-hidden="true"
                                          ></i>
                                        </a>
                                      )}
                                    {this.state.expert.youtubeURL &&
                                    this.state.expert.youtubeURL !== null &&
                                    this.state.expert.youtubeURL !==
                                      undefined &&
                                    this.state.expert.youtubeURL !== "" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          this.state.expert.youtubeURL
                                            ? this.state.expert.youtubeURL
                                            : "#"
                                        }
                                        title="youtube"
                                        rel="noreferrer"
                                      >
                                        <i
                                          className="fa fa-youtube"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    ) : (
                                      <div className="input-holder">
                                        <input
                                          onChange={this.handleInputChange}
                                          name="youtubeURL"
                                          placeholder="youtube"
                                          className="form-control mt-10"
                                        />
                                      </div>
                                    )}
                                    {this.state.expert.soundcloudURL &&
                                      this.state.expert.soundcloudURL !==
                                        null &&
                                      this.state.expert.soundcloudURL !==
                                        undefined &&
                                      this.state.expert.soundcloudURL !==
                                        "" && (
                                        <a
                                          target="_blank"
                                          href={
                                            this.state.expert.soundcloudURL
                                              ? this.state.expert.soundcloudURL
                                              : "#"
                                          }
                                          title="soundcloud"
                                          rel="noreferrer"
                                        >
                                          <i
                                            className="fa fa-soundcloud"
                                            aria-hidden="true"
                                          ></i>
                                        </a>
                                      )}
                                    {this.state.expert.facebookURL === "" &&
                                      this.state.expert.twitterURL === "" &&
                                      this.state.expert.linkedinURL === "" &&
                                      this.state.expert.instagramURL === "" &&
                                      this.state.expert.snapchatURL === "" &&
                                      this.state.expert.websiteURL === "" &&
                                      this.state.expert.googleURL === "" &&
                                      "No Social Links Available Yet"}
                                  </dd>
                                </div>
                                <div className="profile-bor-detail expert-endorsements">
                                  <dt>Endorsements </dt>
                                  <dd>{endorsements_render}</dd>
                                </div>
                                <div className="profile-bor-detail expert-endorsements">
                                  <dt>Upload Resume </dt>
                                  <dd>
                                    <input
                                      type="file"
                                      name="resumeFile"
                                      className="form-control"
                                      onChange={this.onChangeFile}
                                    />
                                  </dd>
                                </div>
                              </dl>
                              <button
                                className="btn btn-primary"
                                onClick={this.saveChanges}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="profile-detail">
                            <div className="name">
                              <dl className="dl-horizontal">
                                {this.state.firstName !== "undefined" &&
                                this.state.firstName !== "" &&
                                this.state.firstName !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Name</dt>
                                    <dd>
                                      <div className="text-left-detail">
                                        {this.state.firstName}
                                        {this.state.lastName}
                                      </div>
                                      <div
                                        style={{
                                          float: "right",
                                          textTransform: "capitalize",
                                        }}
                                        className="text-right label label-primary"
                                      >
                                        <i
                                          className="fa fa-bars"
                                          aria-hidden="true"
                                        ></i>
                                        {this.props.match.params.category}
                                      </div>
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>Name</dt>
                                    <dd>
                                      <div className="text-left-detail">
                                        {this.state.firstName}
                                        {this.state.lastName}
                                      </div>
                                      <div
                                        style={{
                                          float: "right",
                                          textTransform: "capitalize",
                                        }}
                                        className="text-right label label-primary"
                                      >
                                        <i
                                          className="fa fa-bars"
                                          aria-hidden="true"
                                        ></i>
                                        {this.props.match.params.category}
                                      </div>
                                    </dd>
                                  </div>
                                )}

                                {this.state.expert.university !== "undefined" &&
                                this.state.expert.university !== "" &&
                                this.state.expert.university !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>University</dt>
                                    <dd>{this.state.expert.university}</dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>University</dt>
                                    <dd>{this.state.expert.university}</dd>
                                  </div>
                                )}

                                {this.state.expert.expertCategories !==
                                  "undefined" &&
                                this.state.expert.expertCategories !== "" &&
                                this.state.expert.expertCategories !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Area of expertise</dt>
                                    <dd>
                                      {this.state.expert.expertCategories}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>Area of expertise</dt>
                                    <dd>
                                      {this.state.expert.expertCategories}
                                    </dd>
                                  </div>
                                )}

                                {this.state.expert.yearsexpertise !==
                                  "undefined" &&
                                this.state.expert.yearsexpertise !== "" &&
                                this.state.expert.yearsexpertise !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Years of expertise</dt>
                                    <dd>{this.state.expert.yearsexpertise}</dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>Years of expertise</dt>
                                    <dd>{this.state.expert.yearsexpertise}</dd>
                                  </div>
                                )}

                                {this.state.expert.expertFocusExpertise !==
                                  "undefined" &&
                                this.state.expert.expertFocusExpertise !== "" &&
                                this.state.expert.expertFocusExpertise !=
                                  null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Focus of expertise</dt>
                                    <dd>
                                      {this.state.expert.expertFocusExpertise}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>Focus of expertise</dt>
                                    <dd>
                                      {this.state.expert.expertFocusExpertise}
                                    </dd>
                                  </div>
                                )}

                                {/*}<div className="profile-bor-detail">
                                <dt>Rates</dt>
                                <dd>{ this.state.expert.expertRates }</dd>
                            </div>{*/}

                                {this.state.expert.expertRating !==
                                  "undefined" &&
                                this.state.expert.expertRating !== "" &&
                                this.state.expert.expertRating !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Rating</dt>
                                    <dd>
                                      {this.state.expert.expertRating &&
                                      this.state.expert.expertRating !== null &&
                                      this.state.expert.expertRating !==
                                        undefined &&
                                      this.state.expert.expertRating !== ""
                                        ? this.state.expert.expertRating
                                        : "No Ratings Available"}
                                      {this.state.expert.expertRating &&
                                        this.state.expert.expertRating !==
                                          null &&
                                        this.state.expert.expertRating !==
                                          undefined &&
                                        this.state.expert.expertRating !==
                                          "" && (
                                          <i
                                            className="fa fa-star"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>Rating</dt>
                                    <dd>
                                      {this.state.expert.expertRating &&
                                      this.state.expert.expertRating !== null &&
                                      this.state.expert.expertRating !==
                                        undefined &&
                                      this.state.expert.expertRating !== ""
                                        ? this.state.expert.expertRating
                                        : "No Ratings Available"}
                                      {this.state.expert.expertRating &&
                                        this.state.expert.expertRating !=
                                          null &&
                                        this.state.expert.expertRating !==
                                          undefined &&
                                        this.state.expert.expertRating !==
                                          "" && (
                                          <i
                                            className="fa fa-star"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                    </dd>
                                  </div>
                                )}

                                {/*<div className="profile-bor-detail">
                              <dt>About Expert </dt>
                              <dd>{ this.state.expert.userBio && this.state.expert.userBio!=null && this.state.expert.userBio!=undefined && this.state.expert.userBio!="" ? this.state.expert.userBio : "-"}</dd>
                            </div>
                            <div className="profile-bor-detail">
                              <dt>Country </dt>
                              <dd>{ this.state.expert.locationCountry && this.state.expert.locationCountry!=null && this.state.expert.locationCountry!=undefined && this.state.expert.locationCountry!="" ? this.state.expert.locationCountry :"-"}</dd>
                            </div>
                            <div className="profile-bor-detail">
                              <dt>State </dt>
                              <dd>{ this.state.expert.locationState && this.state.expert.locationState!=null && this.state.expert.locationState!=undefined && this.state.expert.locationState!="" ? this.state.expert.locationState : "-"}</dd>
                            </div>
                            <div className="profile-bor-detail">
                              <dt>City </dt>
                              <dd>{ this.state.expert.locationCity && this.state.expert.locationCity!=null && this.state.expert.locationCity!=undefined && this.state.expert.locationCity!="" ? this.state.expert.locationCity : "-"}</dd>
                            </div>*/}

                                {(this.state.expert.facebookURL ===
                                  "undefined" &&
                                  this.state.expert.facebookURL === "" &&
                                  this.state.expert.facebookURL === null) ||
                                (this.state.expert.twitterURL === "undefined" &&
                                  this.state.expert.twitterURL === "" &&
                                  this.state.expert.twitterURL === null) ||
                                (this.state.expert.linkedinURL ===
                                  "undefined" &&
                                  this.state.expert.linkedinURL === "" &&
                                  this.state.expert.linkedinURL === null) ||
                                (this.state.expert.instagramURL ===
                                  "undefined" &&
                                  this.state.expert.instagramURL === "" &&
                                  this.state.expert.instagramURL === null) ||
                                (this.state.expert.snapchatURL ===
                                  "undefined" &&
                                  this.state.expert.snapchatURL === "" &&
                                  this.state.expert.snapchatURL === null) ||
                                (this.state.expert.websiteURL === "undefined" &&
                                  this.state.expert.websiteURL === "" &&
                                  this.state.expert.websiteURL === null) ||
                                (this.state.expert.googleURL === "undefined" &&
                                  this.state.expert.googleURL === "" &&
                                  this.state.expert.googleURL === null) ||
                                (this.state.expert.youtubeURL === "undefined" &&
                                  this.state.expert.youtubeURL === "" &&
                                  this.state.expert.youtubeURL === null) ||
                                (this.state.expert.soundcloudURL ===
                                  "undefined" &&
                                  this.state.expert.soundcloudURL === "" &&
                                  this.state.expert.soundcloudURL === null) ||
                                (this.state.expert.facebookURL ===
                                  "undefined" &&
                                  this.state.expert.facebookURL === "" &&
                                  this.state.expert.facebookURL === null) ? (
                                  <div className="profile-bor-detail expert-social-links">
                                    <dt>Social link </dt>
                                    <dd>
                                      {this.state.expert.facebookURL &&
                                        this.state.expert.facebookURL !==
                                          null &&
                                        this.state.expert.facebookURL !==
                                          undefined &&
                                        this.state.expert.facebookURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.facebookURL
                                                ? this.state.expert.facebookURL
                                                : "#"
                                            }
                                            title="facebook"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-facebook-official"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.twitterURL &&
                                        this.state.expert.twitterURL !== null &&
                                        this.state.expert.twitterURL !==
                                          undefined &&
                                        this.state.expert.twitterURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.twitterURL
                                                ? this.state.expert.twitterURL
                                                : "#"
                                            }
                                            title="twitter"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-twitter"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.linkedinURL &&
                                        this.state.expert.linkedinURL !==
                                          null &&
                                        this.state.expert.linkedinURL !==
                                          undefined &&
                                        this.state.expert.linkedinURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.linkedinURL
                                                ? this.state.expert.linkedinURL
                                                : "#"
                                            }
                                            title="linkedin"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-linkedin"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.instagramURL &&
                                        this.state.expert.instagramURL !=
                                          null &&
                                        this.state.expert.instagramURL !==
                                          undefined &&
                                        this.state.expert.instagramURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.instagramURL
                                                ? this.state.expert.instagramURL
                                                : "#"
                                            }
                                            title="instagram"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-instagram"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.snapchatURL &&
                                        this.state.expert.snapchatURL !==
                                          null &&
                                        this.state.expert.snapchatURL !==
                                          undefined &&
                                        this.state.expert.snapchatURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.snapchatURL
                                                ? this.state.expert.snapchatURL
                                                : "#"
                                            }
                                            title="snapchat"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-snapchat"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.websiteURL &&
                                        this.state.expert.websiteURL !== null &&
                                        this.state.expert.websiteURL !==
                                          undefined &&
                                        this.state.expert.websiteURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.websiteURL
                                                ? this.state.expert.websiteURL
                                                : "#"
                                            }
                                            title="website"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-anchor"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.googleURL &&
                                        this.state.expert.googleURL !== null &&
                                        this.state.expert.googleURL !==
                                          undefined &&
                                        this.state.expert.googleURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.googleURL
                                                ? this.state.expert.googleURL
                                                : "#"
                                            }
                                            title="google"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-google"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.youtubeURL &&
                                        this.state.expert.youtubeURL !== null &&
                                        this.state.expert.youtubeURL !==
                                          undefined &&
                                        this.state.expert.youtubeURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.youtubeURL
                                                ? this.state.expert.youtubeURL
                                                : "#"
                                            }
                                            title="youtube"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-youtube"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.soundcloudURL &&
                                        this.state.expert.soundcloudURL !=
                                          null &&
                                        this.state.expert.soundcloudURL !==
                                          undefined &&
                                        this.state.expert.soundcloudURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.soundcloudURL
                                                ? this.state.expert
                                                    .soundcloudURL
                                                : "#"
                                            }
                                            title="soundcloud"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-soundcloud"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.facebookURL === "" &&
                                        this.state.expert.twitterURL === "" &&
                                        this.state.expert.linkedinURL === "" &&
                                        this.state.expert.instagramURL === "" &&
                                        this.state.expert.snapchatURL === "" &&
                                        this.state.expert.websiteURL === "" &&
                                        this.state.expert.googleURL === "" &&
                                        "No Social Links Available Yet"}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail expert-social-links inactive_div">
                                    <dt>Social link </dt>
                                    <dd>
                                      {this.state.expert.facebookURL &&
                                        this.state.expert.facebookURL !==
                                          null &&
                                        this.state.expert.facebookURL !==
                                          undefined &&
                                        this.state.expert.facebookURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.facebookURL
                                                ? this.state.expert.facebookURL
                                                : "#"
                                            }
                                            title="facebook"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-facebook-official"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.twitterURL &&
                                        this.state.expert.twitterURL !== null &&
                                        this.state.expert.twitterURL !==
                                          undefined &&
                                        this.state.expert.twitterURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.twitterURL
                                                ? this.state.expert.twitterURL
                                                : "#"
                                            }
                                            title="twitter"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-twitter"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.linkedinURL &&
                                        this.state.expert.linkedinURL !==
                                          null &&
                                        this.state.expert.linkedinURL !==
                                          undefined &&
                                        this.state.expert.linkedinURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.linkedinURL
                                                ? this.state.expert.linkedinURL
                                                : "#"
                                            }
                                            title="linkedin"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-linkedin"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.instagramURL &&
                                        this.state.expert.instagramURL !=
                                          null &&
                                        this.state.expert.instagramURL !==
                                          undefined &&
                                        this.state.expert.instagramURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.instagramURL
                                                ? this.state.expert.instagramURL
                                                : "#"
                                            }
                                            title="instagram"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-instagram"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.snapchatURL &&
                                        this.state.expert.snapchatURL !==
                                          null &&
                                        this.state.expert.snapchatURL !==
                                          undefined &&
                                        this.state.expert.snapchatURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.snapchatURL
                                                ? this.state.expert.snapchatURL
                                                : "#"
                                            }
                                            title="snapchat"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-snapchat"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.websiteURL &&
                                        this.state.expert.websiteURL !== null &&
                                        this.state.expert.websiteURL !==
                                          undefined &&
                                        this.state.expert.websiteURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.websiteURL
                                                ? this.state.expert.websiteURL
                                                : "#"
                                            }
                                            title="website"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-anchor"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.googleURL &&
                                        this.state.expert.googleURL !== null &&
                                        this.state.expert.googleURL !==
                                          undefined &&
                                        this.state.expert.googleURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.googleURL
                                                ? this.state.expert.googleURL
                                                : "#"
                                            }
                                            title="google"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-google"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.youtubeURL &&
                                        this.state.expert.youtubeURL !== null &&
                                        this.state.expert.youtubeURL !==
                                          undefined &&
                                        this.state.expert.youtubeURL !== "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.youtubeURL
                                                ? this.state.expert.youtubeURL
                                                : "#"
                                            }
                                            title="youtube"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-youtube"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.soundcloudURL &&
                                        this.state.expert.soundcloudURL !=
                                          null &&
                                        this.state.expert.soundcloudURL !==
                                          undefined &&
                                        this.state.expert.soundcloudURL !==
                                          "" && (
                                          <a
                                            target="_blank"
                                            href={
                                              this.state.expert.soundcloudURL
                                                ? this.state.expert
                                                    .soundcloudURL
                                                : "#"
                                            }
                                            title="soundcloud"
                                            rel="noreferrer"
                                          >
                                            <i
                                              className="fa fa-soundcloud"
                                              aria-hidden="true"
                                            ></i>
                                          </a>
                                        )}
                                      {this.state.expert.facebookURL === "" &&
                                        this.state.expert.twitterURL === "" &&
                                        this.state.expert.linkedinURL === "" &&
                                        this.state.expert.instagramURL === "" &&
                                        this.state.expert.snapchatURL === "" &&
                                        this.state.expert.websiteURL === "" &&
                                        this.state.expert.googleURL === "" &&
                                        "No Social Links Available Yet"}
                                    </dd>
                                  </div>
                                )}

                                {endorsements_render !== "undefined" &&
                                endorsements_render !== "" &&
                                endorsements_render !== null ? (
                                  <div className="profile-bor-detail expert-endorsements">
                                    <dt>Endorsements </dt>
                                    <dd>{endorsements_render}</dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail expert-endorsements inactive_div">
                                    <dt>Endorsements </dt>
                                    <dd>{endorsements_render}</dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-3">
                    <ExpertReviews expertSlug={this.props.match.params.slug} />
                  </div>

                  <div className="col-md-8">
                    <Carousel
                      images={images}
                      thumb={true}
                      loop={true}
                      autoplay={0 /* 5000 */}
                    />
                    <div className="comment">
                      <CommentBox
                        expert={this.props.match.params.slug}
                        userEmail={this.state.currentUser?.email}
                        expertEmail={this.state.expertEmail}
                      />
                    </div>

                    {/* comments */}
                    <div className="comment list">
                      {this.state.comments.map((item, index) => (
                        <div key={index}>
                          <LazyImage
                            src={
                              "/expertCategorieses/" +
                              item.users[0].profileImage
                            }
                            placeholder="/img/person.jpg"
                            height="50px"
                            width="50px"
                            alt=""
                          />
                          <a
                            href={
                              "/expert/" +
                              item.users[0].expertCategories[0] +
                              "/" +
                              item.users[0].slug
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {item.users[0].profile.firstName +
                              " " +
                              item.users[0].profile.lastName}
                          </a>
                          <p>{item.text}</p>
                        </div>
                      ))}
                    </div>
                    {/* comments */}
                    <div style={{paddingTop: '10px', display: 'flex'}}>
                      <button
                        className="btn btn-danger"
                        style={{width: '25vw', margin: 'auto', padding: "10px 20px"}}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* expert-list-wrap end */}
        {/* modal for audio call start here */}
        <div
          id="myModalAudio"
          className="modal fade continueshoppingmodal"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
                <h4 className="modal-title">Message</h4>
              </div>
              <div className="modal-body text-center">
                <div className="alert alert-danger">
                  Please login to place audio call
                </div>
              </div>
              <div className="modal-footer text-center">
                <div className="bootstrap-dialog-footer">
                  <div className="bootstrap-dialog-footer-buttons text-center">
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-dismiss="modal"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal for audio call end here */}
        {/* myModalEmail for email start here */}
        <div
          id="myModalEmail"
          className="modal fade continueshoppingmodal"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
                <h4 className="modal-title">Send Email</h4>
              </div>
              <form
                id="send_email_form"
                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
              >
                <div className="modal-body">
                  <p className="text-center"> Shoot email message to expert </p>
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: this.state.responseEmailMsg,
                            }}
                          ></div>
                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Your Email</label>
                              <Field
                                name="email"
                                component={renderField}
                                type="email"
                              />
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Your Message</label>
                              <Field
                                name="message"
                                rows="3"
                                component={renderTextarea}
                                type="text"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/*end of table*/}
                </div>
                {/*end of modal body*/}
                <div className="modal-footer">
                  <div className="bootstrap-dialog-footer">
                    <div className="bootstrap-dialog-footer-buttons text-center">
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                          Send Email
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-default"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* myModalEmail for email end here */}
        {/* myModalTextMessage for email start here */}
        <div
          id="myModalTextMessage"
          className="modal fade continueshoppingmodal"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
                <h4 className="modal-title">Send Text Message</h4>
              </div>
              <form
                id="send_text_form"
                onSubmit={handleSubmit(
                  this.handleTextMessageFormSubmit.bind(this)
                )}
              >
                <div className="modal-body">
                  <p className="text-center"> Shoot text message to expert </p>
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <td>
                          {/* text message form start */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: this.state.responseTextMsg,
                            }}
                          />
                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Your Email</label>
                              <Field
                                name="text_email"
                                component={renderField}
                                type="email"
                              />
                              <Field
                                name="text_expert_email"
                                value={this.state.expertEmail}
                                type="hidden"
                                component={renderFieldHidden}
                              />
                              <input
                                name="text_expert_email"
                                hidden
                                value={this.state.expertEmail}
                                type="hidden"
                              />
                              {/*console.log(this.state.expertEmail)*/}
                              {/*}<input type="email" name="text_expert_email" type="hidden" value={ this.state.expertEmail}/>{*/}
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Your Message</label>
                              <Field
                                name="text_message"
                                rows="3"
                                component={renderTextarea}
                                type="text"
                              />
                            </div>
                          </div>
                          {/* text message form end */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/*end of table*/}
                </div>
                {/*end of modal body*/}
                <div className="modal-footer">
                  <div className="bootstrap-dialog-footer">
                    <div className="bootstrap-dialog-footer-buttons text-center">
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                          Send Text Message
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-default"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* myModalTextMessage end here */}
      </div>
    );
  }
  /*** Render the component. */
  render() {
    return <div>{this.renderPosts()}</div>;
  }
}
function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
  };
}

export default connect(mapStateToProps, {
  sendEmail,
  sendTextMessage,
  checkBeforeSessionStart,
  createAudioSession,
  startRecording,
  stopRecording,
  rechargeVideoSession,
  getVideoSession,
})(withRouter(withCookies(form(ViewExpert))));
