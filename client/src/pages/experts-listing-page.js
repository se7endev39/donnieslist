import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";

import { API_URL, Image_URL } from "../constants/api";
import { sendEmail, isLoggedIn } from "../actions/expert";
import NotificationModal from "./notification-modal";
import { setPage } from "../actions/setPage";
import LazyImage from '../components/common/LazyImage'

class ExpertsListingPage extends Component {
  /**
   * Class constructor.
   */
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props, context) {
    super(props, context);

    this.state = {
      category: "",
      responseMsg: "",
      isUserLoggedIn: "",
      posts: [],
      topRated: [],
      myFavorite: [],
      error: null,
      selectedExpertSlug: "",
    };

    window.$(document).ready(function () {
      window.$(document).on("click", ".show_message_form", function () {
        window.$("#msg-form").toggleClass("displayNone");
      });
    });
  }

  handleFormSubmit(formProps) {
    this.props.sendEmail(formProps).then(
      (response) => {
        this.setState({ responseMsg: response.message });
      },
      (err) =>
        err.response.json().then(({ errors }) => {
          this.setState({ responseMsg: errors });
        })
    );
  }

  addEndorsements = (slug) => {
    const currentUser = this.props.cookies.get("user");
    if (currentUser) {
      const fromSlug = currentUser.slug;
      const myFavorite = currentUser.myFavorite;
      myFavorite.push(slug);
      this.props.cookies.set("user", currentUser, { path: "/" });
      const data = { toSlug: slug, fromSlug: fromSlug };
      axios
        .post(`${API_URL}/addEndorsements/`, data)
        .then((res) => {
          this.props.history.push(
            "/expert/" + this.props.match.params.category + "/" + slug
          );
        })
        .catch((err) => {
          this.props.history.push(
            "/expert/" + this.props.match.params.category + "/" + slug
          );
        });
    } else {
      this.props.history.push('/login');
    }
  };

  componentDidMount() {
    this.props.setPage("0");
    var category = this.props.match.params.category;
    axios
      .get(`${API_URL}/getExpertsListing/${category}`)
      .then((res) => {
        const posts = res.data;
        const category = res.data.name;
        this.setState({
          posts,
          category,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({
          category: "",
          error: err,
        });
      });

    axios
      .get(`${API_URL}/getExpertsListing/topRated/${category}`)
      .then((res) => {
        const topRated = res.data;
        this.setState({
          topRated,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({
          category: "",
          error: err,
        });
      });

    const currentUser = this.props.cookies.get("user");
    if (currentUser) {
      const myFavorite = currentUser.myFavorite;
      axios
        .post(`${API_URL}/getMyExpertsListing/`, {
          slug: myFavorite,
          category: category,
        })
        .then((res) => {
          this.setState({
            myFavorite: res.data,
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
    }
  }

  renderImage() {
    return <img className="loader-center" src="/img/ajax-loader.gif" alt="" />;
  }

  renderError() {
    if (this.state.posts === undefined) {
      return (
        <div className="alert-danger alert">
          Alas, No expert found in this category!
        </div>
      );
    } else {
      return (
        <div className="alert-danger alert">
          Uh oh: {this.state.error.message}
        </div>
      );
    }
  }

  getStars(rating) {
    var size = Math.max(0, Math.min(5, rating)) * 16;
    return Object.assign({ width: size });
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

  selectVideoSessionMinutes(item, e) {
    this.setState({ selectedExpertSlug: item.slug });
    window.$(".notification-modal").trigger("click");
  }

  redirectToLogin(e) {
    e.preventDefault();
    this.props.history.push("/login");
    this.props.cookies.set(
      "requiredLogin_for_session",
      "Please login to start video session",
      { path: "/", secure: false, sameSite: "Lax" }
    );
  }

  render() {
    const currentUser = this.props.cookies.get("user");
    // const { handleSubmit } = this.props;

    if (this.state.error) {
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
                    {this.renderError()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    let imageStyle = {
      background: "#ffffff",
      padding: 15,
    };

    return (
      <div id="experts-list" className="experts-list">
        <div className="expertise-tab-wrap">
          <div className="expertise-inner">
            <div className="container">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink to="/">Home</NavLink>
                </li>
                <li className="breadcrumb-item active">
                  {this.props.match.params.category}
                </li>
              </ol>
              <div id="pageTitle">
                <div className="title">{this.props.match.params.category}</div>
                <div className="small">
                  Select any one of the experts below to view their profile
                </div>
              </div>
              <br></br>
              <ul className="nav nav-tabs" role="tablist">
                <li role="presentation" className="active">
                  <a
                    href="#home"
                    aria-controls="home"
                    role="tab"
                    data-toggle="tab"
                  >
                    Latest
                  </a>
                </li>
                <li role="presentation">
                  <a
                    href="#profile"
                    aria-controls="profile"
                    role="tab"
                    data-toggle="tab"
                  >
                    Top Rated
                  </a>
                </li>
                <li role="presentation">
                  <a
                    href="#my_favorite"
                    aria-controls="settings"
                    role="tab"
                    data-toggle="tab"
                  >
                    My Favorites
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="home">
                  <div className="expertise-all-detail-wrap">
                    {console.log(this.state.posts)}
                    {this.state.posts.map((post, index) => (
                      <div
                        className="expertise-detail-only"
                        key={`POST_INDEX_${index}`}
                      >
                        <div className="row">
                          <div className="col-sm-8">
                            <div className="row">
                              <div className="col-sm-2" style={imageStyle}>
                                <div className="img-exper">
                                  {/*post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100" height="64" src={"http://localhost:3000"+post.profileImage} />:<img src="/img/profile.png"/>*/}
                                  {post.profileImage &&
                                  post.profileImage !== null &&
                                  post.profileImage !== undefined &&
                                  post.profileImage !== "" ? (
                                    <LazyImage
                                      width="100"
                                      alt=""
                                      src={`${Image_URL}` + post.profileImage}
                                      placeholder="/img/profile.png"
                                    />
                                  ) : (
                                    <img width="100" src="/img/profile.png" alt="" />
                                  )}
                                  {post.onlineStatus === "ONLINE" && (
                                    <i
                                      data-toggle="title"
                                      title="Online"
                                      className={"user-online-o fa fa-circle"}
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-10">
                                <div className="person-per-info">
                                  <Link
                                    to={`/expert/${this.props.match.params.category}/${post.slug}`}
                                  >
                                    <h2>
                                      {post.profile.firstName}
                                      {post.profile.lastName}
                                      {/*}<i title={this.getOnlineStatusTitle(post.onlineStatus)} className={this.getOnlineStatus(post.onlineStatus)} aria-hidden="true"></i>{*/}
                                    </h2>
                                  </Link>
                                  {/*  <p>About Expert: {post.userBio && post.userBio!=null && post.userBio!=undefined && post.userBio!="" ? post.userBio : '-'}</p>*/}
                                  <p>University: {post.university}</p>
                                  <p>
                                    Area of Expertise: {post.expertCategories}
                                  </p>
                                  {/*  <p>Country: {post.locationCountry && post.locationCountry!="" && post.locationCountry!=null && post.locationCountry!=undefined?post.locationCountry:"-"}</p>
                                    <p>State: {post.locationState && post.locationState!="" && post.locationState!=null && post.locationState!=undefined ?post.locationState:"-"}</p>
                                    <p>City: {post.locationCity && post.locationCity!="" && post.locationCity!=null && post.locationCity!=undefined ? post.locationCity : "-"}</p>*/}
                                  <p>
                                    Focus of Expertise:
                                    {post.expertFocusExpertise}
                                  </p>
                                  <p>
                                    Years of Expertise: {post.yearsexpertise}
                                  </p>
                                  <p>
                                    Rating:
                                    {post.expertRating &&
                                    post.expertRating != null &&
                                    post.expertRating !== undefined &&
                                    post.expertRating !== ""
                                      ? post.expertRating
                                      : "No Ratings Available Yet"}
                                    {post.expertRating &&
                                      post.expertRating !== "" && (
                                        <i
                                          className="fa fa-star"
                                          aria-hidden="true"
                                        ></i>
                                      )}
                                  </p>
                                  {/*}<p>Rates: {post.expertRates} <span>★</span></p>{*/}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="stars-review">
                              <span className="stars right">
                                <span
                                  style={this.getStars(post.expertRating)}
                                ></span>
                              </span>
                            </div>
                            <div className="btn-expertise">
                              {/*}<Link to={`/expert/${this.props.match.params.category}/${post.slug}`} className="btn-strt-session btn btn-primary pull-right">Start Video Session</Link>{*/}
                              {
                                <div
                                  className="Start-Session btn-strt-session btn btn-primary pull-right"
                                  onClick={(e) =>
                                    this.addEndorsements(post.slug)
                                  }
                                >
                                  Add Expert
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {this.state.posts &&
                      this.state.posts != null &&
                      this.state.posts !== undefined &&
                      this.state.posts.length === 0 && (
                        <div role="tabpanel" className="tab-pane" id="settings">
                          <div className="expertise-all-detail-wrap">
                            <div className="alert">
                              No expert found in this section!
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  {currentUser ? (
                    <NotificationModal
                      userEmail={currentUser.email}
                      expertSlug={this.state.selectedExpertSlug}
                      modalId="notificationModal"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div role="tabpanel" className="tab-pane" id="profile">
                  <div className="expertise-all-detail-wrap">
                    {this.state.topRated.map((post, index) => (
                      <div
                        className="expertise-detail-only"
                        key={`TAB_ITEM_${index}`}
                      >
                        <div className="row">
                          <div className="col-sm-8">
                            <div className="row">
                              <div className="col-sm-2" style={imageStyle}>
                                <div className="img-exper">
                                  {/*post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100" height="64" src={"http://localhost:3000"+post.profileImage} />:<img src="/img/profile.png"/>*/}
                                  {post.profileImage &&
                                  post.profileImage != null &&
                                  post.profileImage !== undefined &&
                                  post.profileImage !== "" ? (
                                    <img
                                      width="100"
                                      src={`${Image_URL}` + post.profileImage}
                                      alt=""
                                    />
                                  ) : (
                                    <img width="100" src="/img/profile.png" alt="" />
                                  )}
                                  {this.getOnlineStatus(post.onlineStatus) && (
                                    <i
                                      data-toggle="title"
                                      title="Online"
                                      className={"user-online-o fa fa-circle"}
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-10">
                                <div className="person-per-info">
                                  <Link
                                    to={`/expert/${this.props.match.params.category}/${post.slug}`}
                                  >
                                    <h2>
                                      {post.profile.firstName}
                                      {post.profile.lastName}
                                      {/*<i title={this.getOnlineStatusTitle(post.onlineStatus)} className={this.getOnlineStatus(post.onlineStatus)} aria-hidden="true"></i>*/}
                                    </h2>
                                  </Link>
                                  <p>About Expert: {post.userBio}</p>
                                  <p>
                                    Area of Expertise: {post.expertCategories}
                                  </p>
                                  <p>
                                    Country:
                                    {post.locationCountry &&
                                    post.locationCountry !== "" &&
                                    post.locationCountry !== null &&
                                    post.locationCountry !== undefined
                                      ? post.locationCountry
                                      : "-"}
                                  </p>
                                  <p>
                                    State:
                                    {post.locationState &&
                                    post.locationState !== "" &&
                                    post.locationState !== null &&
                                    post.locationState !== undefined
                                      ? post.locationState
                                      : "-"}
                                  </p>
                                  <p>
                                    City:
                                    {post.locationCity &&
                                    post.locationCity !== "" &&
                                    post.locationCity !== null &&
                                    post.locationCity !== undefined
                                      ? post.locationCity
                                      : "-"}
                                  </p>
                                  <p>
                                    Focus of Expertise:
                                    {post.expertFocusExpertise}
                                  </p>
                                  <p>
                                    Years of Expertise: {post.yearsexpertise}
                                  </p>
                                  <p>
                                    Rating: {post.expertRating}
                                    {post.expertRating &&
                                      post.expertRating !== "" && (
                                        <i
                                          className="fa fa-star"
                                          aria-hidden="true"
                                        ></i>
                                      )}
                                  </p>
                                  {/*}<p>Rates: {post.expertRates} <span>★</span></p>{*/}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="stars-review">
                              <span className="stars right">
                                <span
                                  style={this.getStars(post.expertRating)}
                                ></span>
                              </span>
                            </div>
                            <div className="btn-expertise">
                              <button
                                className="btn-strt-session btn btn-primary pull-right"
                                onClick={(e) => this.addEndorsements(post.slug)}
                              >
                                Connect
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {this.state.topRated &&
                      this.state.topRated !== null &&
                      this.state.topRated !== undefined &&
                      this.state.topRated.length === 0 && (
                        <div role="tabpanel" className="tab-pane" id="settings">
                          <div className="expertise-all-detail-wrap">
                            <div className="alert alert-danger">
                              No expert found in this section!
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div role="tabpanel" className="tab-pane" id="messages">
                  <div className="expertise-all-detail-wrap">
                    <div className="alert alert-danger">
                      No expert found in this section!
                    </div>
                  </div>
                </div>
                <div role="tabpanel" className="tab-pane" id="my_favorite">
                  <div className="expertise-all-detail-wrap">
                    {this.state.myFavorite.map((post, index) => (
                      <div
                        className="expertise-detail-only"
                        key={`FAVORITE_${index}`}
                      >
                        <div className="row">
                          <div className="col-sm-8">
                            <div className="row">
                              <div className="col-sm-2" style={imageStyle}>
                                <div className="img-exper">
                                  {/*post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100" height="64" src={"http://localhost:3000"+post.profileImage} />:<img src="/img/profile.png"/>*/}
                                  {post.profileImage &&
                                  post.profileImage !== null &&
                                  post.profileImage !== undefined &&
                                  post.profileImage !== "" ? (
                                    <img
                                      width="100"
                                      src={`${Image_URL}` + post.profileImage}
                                      alt=""
                                    />
                                  ) : (
                                    <img width="100" src="/img/profile.png" alt="" />
                                  )}
                                  {this.getOnlineStatus(post.onlineStatus) && (
                                    <i
                                      data-toggle="title"
                                      title="Online"
                                      className={"user-online-o fa fa-circle"}
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-10">
                                <div className="person-per-info">
                                  <Link
                                    to={`/expert/${this.props.match.params.category}/${post.slug}`}
                                  >
                                    <h2>
                                      {post.profile.firstName}
                                      {post.profile.lastName}
                                      {/*}<i title={this.getOnlineStatusTitle(post.onlineStatus)} className={this.getOnlineStatus(post.onlineStatus)} aria-hidden="true"></i>{*/}
                                    </h2>
                                  </Link>
                                  {/*  <p>About Expert: {post.userBio && post.userBio!=null && post.userBio!=undefined && post.userBio!="" ? post.userBio : '-'}</p>*/}
                                  <p>University: {post.university}</p>
                                  <p>
                                    Area of Expertise: {post.expertCategories}
                                  </p>
                                  {/*  <p>Country: {post.locationCountry && post.locationCountry!="" && post.locationCountry!=null && post.locationCountry!=undefined?post.locationCountry:"-"}</p>
                                    <p>State: {post.locationState && post.locationState!="" && post.locationState!=null && post.locationState!=undefined ?post.locationState:"-"}</p>
                                    <p>City: {post.locationCity && post.locationCity!="" && post.locationCity!=null && post.locationCity!=undefined ? post.locationCity : "-"}</p>*/}
                                  <p>
                                    Focus of Expertise:
                                    {post.expertFocusExpertise}
                                  </p>
                                  <p>
                                    Years of Expertise: {post.yearsexpertise}
                                  </p>
                                  <p>
                                    Rating:
                                    {post.expertRating &&
                                    post.expertRating != null &&
                                    post.expertRating !== undefined &&
                                    post.expertRating !== ""
                                      ? post.expertRating
                                      : "No Ratings Available Yet"}
                                    {post.expertRating &&
                                      post.expertRating !== "" && (
                                        <i
                                          className="fa fa-star"
                                          aria-hidden="true"
                                        ></i>
                                      )}
                                  </p>
                                  {/*}<p>Rates: {post.expertRates} <span>★</span></p>{*/}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="stars-review">
                              <span className="stars right">
                                <span
                                  style={this.getStars(post.expertRating)}
                                ></span>
                              </span>
                            </div>
                            <div className="btn-expertise">
                              {/*}<Link to={`/expert/${this.props.match.params.category}/${post.slug}`} className="btn-strt-session btn btn-primary pull-right">Start Video Session</Link>{*/}
                              {currentUser ? (
                                <Link
                                  to="/#"
                                  data-toggle="modal"
                                  title="Start Video Session"
                                  data-target="#notificationModal"
                                  onClick={this.selectVideoSessionMinutes.bind(
                                    this,
                                    post
                                  )}
                                  data-slug={post.slug}
                                  className="Start-Session btn-strt-session btn btn-primary pull-right"
                                >
                                  Connect
                                </Link>
                              ) : (
                                <div
                                  onClick={this.redirectToLogin.bind(this)}
                                  className="Start-Session btn-strt-session btn btn-primary pull-right"
                                >
                                  Connect
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {this.state.myFavorite &&
                      this.state.myFavorite != null &&
                      this.state.myFavorite !== undefined &&
                      this.state.myFavorite.length === 0 && (
                        <div role="tabpanel" className="tab-pane" id="settings">
                          <div className="expertise-all-detail-wrap">
                            <div className="alert alert-danger">
                              No expert found in this section!
                            </div>
                          </div>
                        </div>
                      )}
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

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { sendEmail, isLoggedIn, setPage })(
  withRouter(withCookies(ExpertsListingPage))
);

