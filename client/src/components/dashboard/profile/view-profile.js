import React, { Component } from "react";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import { connect } from "react-redux";
import { API_URL, Image_URL } from "../../../constants/api";
import {fetchUser} from "../../../actions/index";
import { NavLink } from "react-router-dom";

import { uploadImage } from "../../../actions/index";

// import UserInfo from './user-info';

// var Dropzone = require('react-dropzone');

class ViewProfile extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      expertEmail: "",
      onlineStatus: "",
      expert: "",
      loading: false,
      university: "",
      RelatedImages1: [],
      successMessage: "",
      errorMessage: "",
      role: "",
      resume_path: "",
      Image_other_UrlContain: false,
      currentUser: this.props.cookies.get("user"),
    };
    this.onDrop = this.onDrop.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this._isMounted = false;
  }
  componentDidMount() {
    // const userId = this.props.cookies.get("user");
    this._isMounted = true;
    var role = this.state.currentUser.role;
    this._isMounted && this.props.fetchUser(this.state.currentUser._id).then(
      (response) => {
        const pattern = new RegExp(
          "^(https?://)?" +
            "((([a-zd]([a-zd-]*[a-zd])*).)+[a-z]{2,}|" +
            "((d{1,3}.){3}d{1,3}))"
        );

        if (pattern.test(response.data.user.profileImage)) {
          this.setState({ Image_other_UrlContain: true });
        }
        const expert = response.data.user;
        this.setState({ firstName: response.data.user.firstName });
        this.setState({ lastName: response.data.user.lastName });
        this.setState({ expertEmail: response.data.user.email });
        this.setState({ onlineStatus: response.data.user.onlineStatus });
        this.setState({ profileImage: response.data.user.profileImage });
        this.setState({ role: role });
        this.setState({ university: response.data.user.university });
        this.setState({ resume_path: response.data.user.resume_path });
        this.setState({
          expert,
          loading: false,
          error: null,
        });
      },
      (error) => {}
    );
  }
  // UNSAFE_componentWillMount() {
  //   // Fetch user data prior to component mounting
  //   const userId = this.props.cookies.get("user");
  //   var role = userId.role;
  //   console.log(userId._id);
  //   this.props.fetchUser(userId._id).then(
  //     (response) => {
  //       const pattern = new RegExp(
  //         "^(https?://)?" +
  //           "((([a-zd]([a-zd-]*[a-zd])*).)+[a-z]{2,}|" +
  //           "((d{1,3}.){3}d{1,3}))"
  //       );

  //       if (pattern.test(response.data.user.profileImage)) {
  //         this.setState({ Image_other_UrlContain: true });
  //       }
  //       const expert = response.data.user;
  //       this.setState({ firstName: response.data.user.firstName });
  //       this.setState({ lastName: response.data.user.lastName });
  //       this.setState({ expertEmail: response.data.user.email });
  //       this.setState({ onlineStatus: response.data.user.onlineStatus });
  //       this.setState({ profileImage: response.data.user.profileImage });
  //       this.setState({ role: role });
  //       this.setState({ university: response.data.user.university });
  //       this.setState({ resume_path: response.data.user.resume_path });
  //       this.setState({
  //         expert,
  //         loading: false,
  //         error: null,
  //       });
  //     },
  //     (error) => {}
  //   );
  // }

  onDrop(acceptedFiles) {
    this.setState({
      RelatedImages1: acceptedFiles,
    });
  }

  uploadImage() {
    // const {expertEmail, RelatedImages1} = this.state

    var formData = new FormData();
    var data = this.state;
    Object.keys(data).forEach((key) => {
      if (key === "RelatedImages1") {
        formData.append(key, data[key][0]);
      } else {
        if (key === "expertEmail") {
          formData.append(key, data[key]);
        }
      }
    });

    return fetch(`${API_URL}/user/update/profile`, {
      method: "POST",
      body: formData,
    })
      .then(
        (response) => {
          var j = response.json();
          return j;
        },
        (err) => {
          console.log("ERR");
        }
      )
      .then((res) => {
        if (
          res &&
          res != null &&
          res !== undefined &&
          res.SuccessMessage &&
          res.SuccessMessage != null &&
          res.SuccessMessage !== undefined &&
          res.SuccessMessage !== ""
        ) {
          this.setState({
            successMessage: res.SuccessMessage,
            RelatedImages1: "",
          });

          this.props.fetchUser(this.state.currentUser._id).then(
            (response) => {
              //  const expert = response.data.user;
              this.setState({ profileImage: response.data.user.profileImage });
            },
            (error) => {}
          );
        } else if (
          res &&
          res != null &&
          res !== undefined &&
          res.errorMessage
        ) {
          this.setState({ errorMessage: res.errorMessage });
        }
      });
    // this.props.uploadImage({email:this.state.expertEmail, RelatedImages1:this.state.RelatedImages1})
  }
  componentWillUnmount () {
    this._isMounted = false;
  }

  render() {
    const renderLoading = (
      <img
        className="loader-center"
        src="/img/ajax-loader.gif"
        alt="loader gif"
      />
    );

    const renderPosts = (
      <div id="view-experts" className="view-experts">
        <div className="container">
          <div className="row">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="breadcrumb-item">Profile</li>
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
                        {this.state.Image_other_UrlContain &&
                        this.state.profileImage &&
                        this.state.profileImage != null &&
                        this.state.profileImage !== undefined &&
                        this.state.profileImage !== "" ? (
                          <div className="expert-img">
                            <img src={this.state.profileImage} alt="" />
                            <i
                              data-toggle="title"
                              title="Online"
                              className="user-online fa fa-circle"
                              aria-hidden="true"
                            ></i>
                          </div>
                        ) : (
                          ""
                        )}

                        {!this.state.Image_other_UrlContain &&
                        this.state.profileImage &&
                        this.state.profileImage != null &&
                        this.state.profileImage !== undefined &&
                        this.state.profileImage !== "" ? (
                          <div className="expert-img">
                            <img
                              src={`${Image_URL}/` + this.state.profileImage}
                              alt=""
                            />
                            <i
                              data-toggle="title"
                              title="Online"
                              className="user-online fa fa-circle"
                              aria-hidden="true"
                            ></i>
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.profileImage == null ||
                        this.state.profileImage === undefined ||
                        this.state.profileImage === "" ? (
                          <div className="expert-img">
                            <img src="/img/profile.png" alt="" />
                            <i
                              data-toggle="title"
                              title="Online"
                              className="user-online fa fa-circle"
                              aria-hidden="true"
                            ></i>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="col-md-9 col-sm-8">
                        <div className="profile-detail">
                          <div className="name">
                            <dl className="dl-horizontal">
                              {this.state.successMessage &&
                                this.state.successMessage !== "" && (
                                  <div className="alert alert-success">
                                    {this.state.successMessage}
                                  </div>
                                )}
                              {this.state.errorMessage &&
                                this.state.errorMessage !== "" && (
                                  <div className="alert alert-danger">
                                    {this.state.errorMessage}
                                  </div>
                                )}
                              <div className="profile-bor-detail">
                                <dt>Name</dt>
                                <dd>
                                  <div className="text-left-detail">
                                    {this.state.firstName} {this.state.lastName}
                                  </div>
                                  {this.state.role &&
                                    this.state.role === "Expert" && (
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
                                        {this.state.expert.expertCategories}
                                      </div>
                                    )}
                                </dd>
                              </div>
                              {this.state.role && this.state.role === "Expert" && (
                                <div className="profile-bor-detail">
                                  <dt>Area of expertise</dt>
                                  <dd>{this.state.expert.expertCategories}</dd>
                                </div>
                              )}

                              {this.state.role && this.state.role === "Expert" && (
                                <div className="profile-bor-detail">
                                  <dt>Years of expertise</dt>
                                  <dd>{this.state.expert.yearsexpertise}</dd>
                                </div>
                              )}

                              {this.state.role && this.state.role === "Expert" && (
                                <div className="profile-bor-detail">
                                  <dt>Focus of expertise</dt>
                                  <dd>
                                    {this.state.expert.expertFocusExpertise}
                                  </dd>
                                </div>
                              )}

                              {/*this.state.role && this.state.role=="Expert" &&
                                          <div className="profile-bor-detail">
                                             <dt>Rates</dt>
                                             <dd>{this.state.expert.expertRates}</dd>
                                          </div>
                                        */}

                              {this.state.role && this.state.role === "Expert" && (
                                <div className="profile-bor-detail">
                                  <dt>Rating</dt>
                                  <dd>
                                    {this.state.expert.expertRating}
                                    <i
                                      className="fa fa-star"
                                      aria-hidden="true"
                                    ></i>
                                  </dd>
                                </div>
                              )}
                              {this.state.role &&
                                (this.state.role === "Admin" ||
                                  this.state.role === "User") && (
                                  <div>
                                    <div className="profile-bor-detail">
                                      <dt>About</dt>
                                      <dd>
                                        {this.state.expert.userBio &&
                                        this.state.expert.userBio != null &&
                                        this.state.expert.userBio !==
                                          undefined &&
                                        this.state.expert.userBio !== ""
                                          ? this.state.expert.userBio
                                          : "-"}
                                      </dd>
                                    </div>
                                    <div className="profile-bor-detail">
                                      <dt>Country </dt>
                                      <dd>
                                        {this.state.expert.locationCountry &&
                                        this.state.expert.locationCountry !=
                                          null &&
                                        this.state.expert.locationCountry !==
                                          undefined &&
                                        this.state.expert.locationCountry !== ""
                                          ? this.state.expert.locationCountry
                                          : "-"}
                                      </dd>
                                    </div>
                                    <div className="profile-bor-detail">
                                      <dt>State </dt>
                                      <dd>
                                        {this.state.expert.locationState &&
                                        this.state.expert.locationState !=
                                          null &&
                                        this.state.expert.locationState !==
                                          undefined &&
                                        this.state.expert.locationState !== ""
                                          ? this.state.expert.locationState
                                          : "-"}
                                      </dd>
                                    </div>
                                    <div className="profile-bor-detail">
                                      <dt>City </dt>
                                      <dd>
                                        {this.state.expert.locationCity &&
                                        this.state.expert.locationCity !=
                                          null &&
                                        this.state.expert.locationCity !==
                                          undefined &&
                                        this.state.expert.locationCity !== ""
                                          ? this.state.expert.locationCity
                                          : "-"}
                                      </dd>
                                    </div>
                                  </div>
                                )}

                              {this.state.role === "Expert" && (
                                <div className="profile-bor-detail expert-social-links">
                                  <dt>Social link </dt>
                                  <dd>
                                    {this.state.expert.facebookURL &&
                                      this.state.expert.facebookURL != null &&
                                      this.state.expert.facebookURL !==
                                        undefined &&
                                      this.state.expert.facebookURL !== "" && (
                                        <a
                                          target="_blank"
                                          rel="noreferrer"
                                          href={
                                            this.state.expert.facebookURL
                                              ? this.state.expert.facebookURL
                                              : "#"
                                          }
                                          title="facebook"
                                        >
                                          <i
                                            className="fa fa-facebook-official"
                                            aria-hidden="true"
                                          ></i>
                                        </a>
                                      )}
                                    {this.state.expert.twitterURL &&
                                      this.state.expert.twitterURL != null &&
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
                                      this.state.expert.linkedinURL != null &&
                                      this.state.expert.linkedinURL !==
                                        undefined &&
                                      this.state.expert.linkedinURL !== "" && (
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
                                      this.state.expert.instagramURL != null &&
                                      this.state.expert.instagramURL !==
                                        undefined &&
                                      this.state.expert.instagramURL !== "" && (
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
                                      this.state.expert.snapchatURL != null &&
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
                                      this.state.expert.websiteURL != null &&
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
                                      this.state.expert.googleURL != null &&
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
                                    {this.state.expert.soundcloudURL &&
                                      this.state.expert.soundcloudURL != null &&
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
                                    {this.state.expert.youtubeURL &&
                                      this.state.expert.youtubeURL != null &&
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
                                    {this.state.expert.facebookURL === "" &&
                                      this.state.expert.twitterURL === "" &&
                                      this.state.expert.linkedinURL === "" &&
                                      this.state.expert.instagramURL === "" &&
                                      this.state.expert.snapchatURL === "" &&
                                      this.state.expert.websiteURL === "" &&
                                      this.state.expert.googleUrl === "" &&
                                      "No Links Added yet"}
                                  </dd>
                                </div>
                              )}
                              {this.state.role && this.state.role === "Expert" && (
                                <div className="profile-bor-detail">
                                  <dt>University</dt>
                                  <dd>{this.state.university}</dd>
                                </div>
                              )}
                              {this.state.role && this.state.role === "Expert" && (
                                <div className="profile-bor-detail">
                                  <dt>Download Resume</dt>
                                  <dd>
                                    <a
                                      href={
                                        `${Image_URL}` + this.state.resume_path
                                      }
                                      title="Download"
                                      download
                                      className="fa fa-file-pdf-o"
                                    ></a>
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {/* <UserInfo profile={this.props.profile?.email} /> */}
        <div>{this.state.loading ? renderLoading : renderPosts}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.user.profile,
  };
}

export default connect(mapStateToProps, { fetchUser, uploadImage })(
  withCookies(ViewProfile)
);

