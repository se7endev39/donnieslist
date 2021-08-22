/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";
import { Cookies, withCookies } from "react-cookie";
import axios from "axios";
import { instanceOf } from "prop-types";

import ExpertAudioCall from "./expert-audio-call";
import { API_URL } from "../../constants/api";
import { setPage } from "../../actions/setPage";
import { setSearch } from "../../actions/searchAction";

class HeaderTemplate extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      redirect: false,
      logged_in_user: [],
      slug: "",
      category: "",
      searchres: [],
      currentUser: this.props.cookies.get("user"),
    };
    this.searchInvoke = this.searchInvoke.bind(this);
    this.getPlaceHolder = this.getPlaceHolder.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !this.state.currentUser ||
      this.state.currentUser?.firstName !==
        nextProps.cookies.get("user")?.firstName
    ) {
      this.setState({ currentUser: nextProps.cookies.get("user") });
    }
  }

  hideSearch() {
    if (this.props.posts === "0") {
      return false;
    } else if (this.props.posts === undefined) {
      return true;
    } else {
      return true;
    }
  }

  renderLinks() {
    if (this.props.authenticated) {
      return (
        <>
          <li key={`${1}header`}>
            <Link onClick={this.handleOnClick} to="/">
              <i className="fa fa-home"></i> Home
            </Link>
          </li>
          <li key={`${2}header`}>
            {/*}<Link onClick={this.handleOnClick} to="dashboard">Dashboard( {currentUser.role} - {currentUser.slug} )</Link>{*/}
            <div className="dropdown">
              <a
                data-toggle="dropdown"
                className="dropdown-toggle"
                aria-expanded="true"
              >
                <span className="name">
                  <i className="fa fa-user"></i>
                  {this.state.currentUser.firstName}
                  {this.state.currentUser.lastName}(
                  {this.state.currentUser.role})
                </span>
                <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                <div className="log-arrow-up"></div>
                <li>
                  <Link onClick={this.handleOnClick} to="/profile">
                    <i className="fa fa-user" title="Update Profile"></i>{" "}
                    profile
                  </Link>
                </li>

                {this.state.currentUser.role === "Admin" ? (
                  <li>
                    <Link onClick={this.handleOnClick} to="/update-profile">
                      <i className="fa fa-pencil" title="Update Profile"></i>
                      update profile
                    </Link>
                  </li>
                ) : (
                  <li>
                    <a
                      onClick={() => {
                        this.updateProfile();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa fa-pencil" title="Update Profile"></i>
                      Update profile
                    </a>
                  </li>
                )}
                {/*<li><Link onClick={this.handleOnClick} to="/account-info"><i className="fa fa-suitcase" title="account information"></i> account information</Link></li>*/}

                {this.state.currentUser.role === "User" && (
                  <li>
                    <Link
                      onClick={this.handleOnClick}
                      to="/dashboard/my-reviews"
                    >
                      <i className="fa fa-commenting-o" aria-hidden="true"></i>{" "}
                      my reviews
                    </Link>
                  </li>
                )}

                {this.state.currentUser.role === "Expert" && (
                  <li>
                    <Link
                      onClick={this.handleOnClick}
                      to="/dashboard/session-reviews"
                    >
                      <i className="fa fa-commenting-o" aria-hidden="true"></i>
                      session reviews
                    </Link>
                  </li>
                )}

                {/* {this.state.currentUser.role === "Expert" && (
                  <li>
                    <Link
                      onClick={this.handleOnClick}
                      to={"/mysession/" + this.state.currentUser.slug}
                    >
                      <i className="fa fa-desktop"></i> my session
                    </Link>
                  </li>
                )} */}

                {/*

                    { currentUser.role === 'Expert' ?  <li><Link onClick={this.handleOnClick} to="/mysession-list"><i className="fa fa-history" aria-hidden="true"></i> sessions history</Link></li> : ''}
                    
                    */}

                {this.state.currentUser.role === "Expert" && (
                  <li>
                    <Link onClick={this.handleOnClick} to="/recordings">
                      <i className="fa fa-microphone"></i> recordings
                    </Link>
                  </li>
                )}

                <li>
                  <Link onClick={this.handleOnClick} to="/logout">
                    <i className="fa fa-key"></i> logout
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </>
      );
    } else {
      return (
        <>
          <ul className="nav navbar-nav navbar-right">
            <li key={1}>
              <Link onClick={this.handleOnClick} to="/">
                Home
              </Link>
            </li>
            <li key={2}>
              <Link onClick={this.handleOnClick} to="/login">
                Login
              </Link>
            </li>
            <li key={3}>
              <Link onClick={this.handleOnClick} to="/register">
                Join
              </Link>
            </li>
            <li key={4}>
              <Link onClick={this.handleOnClick} to="/map">
                Map
              </Link>
            </li>
            <li key={5}>
              <Link onClick={this.handleOnClick} to="/how-it-works">
                How it works
              </Link>
            </li>
            <li key={6}>
              <Link onClick={this.handleOnClick} to="/contact-us">
                Contact
              </Link>
            </li>
          </ul>
        </>
      );
    }
  }

  handleOnClick() {
    let linksEl = document.querySelector("#nav-collapse");
    linksEl.classList.remove("in");
  }

  displayPendingAccountAlert() {
    if (
      this.state.currentUser &&
      this.state.currentUser.role === "User" &&
      !this.state.currentUser.customerId
    ) {
      return (
        <div className="user-pending-account-alert alert alert-danger">
          You are pending with your account setup for placing session with any
          expert, please fill in your information
          <Link to="/account-info"> here </Link>
        </div>
      );
    }
  }

  updateProfile = () => {
    if (localStorage.category && localStorage.slug) {
      this.props.history.push(
        "/edit/expert/" + localStorage.category + "/" + localStorage.slug
      );

      return;
    }
    const email = this.state.currentUser.email;
    const slug = this.state.currentUser?.slug;
    const category = this.state.currentUser?.expertCategories[0];

    localStorage.setItem("slug", slug);
    localStorage.setItem("category", category);
    localStorage.setItem("editable", "true");
    if (category) {
      this.props.history.push("/edit/expert/" + category + "/" + slug);
    } else {
       axios
         .get(`${API_URL}/getExpert/${email}`)
         .then((res) => {
           this.setState({
             logged_in_user: res.data[0],
             slug: res.data[0].slug,
             category: res.data[0].expertCategories[0],
           });

           var slug = res.data[0].slug;
           var category = res.data[0].expertCategories[0];
           localStorage.setItem("slug", slug);
           localStorage.setItem("category", category);
           localStorage.setItem("editable", "true");
           if (category !== undefined && category !== "" && category !== null) {
             this.props.history.push("/edit/expert/" + category + "/" + slug);
           } else {
             this.props.history.push("/edit/expert/new_category/" + slug);
           }
         })
         .catch((err) => {
           console.error(err);
         });
    }
  };

  getPlaceHolder() {
    if (this.props.posts === "HOME" || this.props.posts === undefined) {
      return "Search";
    } else if (this.props.posts === "0") {
      return "";
    } else {
      return `Search ${this.props.posts}`;
    }
  }

  searchInvoke(e) {
    axios
      .get(`${API_URL}/getExpertsListingByKeyword/&${e.target.value}`)
      .then((res) => {
        const searchres = res.data;
        this.setState({
          searchres,
          error: null,
        });
        if (this.state.searchres.length > 0) {
          this.props.setSearch(this.state.searchres);
        } else {
          this.props.setSearch([]);
        }
      })
      .catch((err) => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          category: "",
          error: err,
        });
      });
  }

  render() {
    return (
      <div>
        {/*  {  this.displayPendingAccountAlert() }   */}
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#nav-collapse"
              >
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <div className="logo-tag">
                <NavLink className="navbar-brand" to="/">
                  donnie's list
                </NavLink>
                {/*<span className="navbar-caption">$1/min live video education, lessons and instant advice from top experts.</span>*/}
              </div>
            </div>
            <div className="collapse navbar-collapse" id="nav-collapse">
              <ul className="nav navbar-nav navbar-right">
                {this.hideSearch() && (
                  <li>
                    <div className="search">
                      <i className="fa fa-search"></i>
                      <input
                        className="test"
                        placeholder={this.getPlaceHolder()}
                        type="text"
                        onChange={(e) => this.searchInvoke(e)}
                      />
                    </div>
                  </li>
                )}
                {this.renderLinks()}
              </ul>
            </div>
          </div>
        </nav>
        <ExpertAudioCall
          email={this.state.currentUser ? this.state.currentUser.email : ""}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { setPage, setSearch })(
  withRouter(withCookies(HeaderTemplate))
);

