// UsersProfileView
import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";

// import { protectedTest } from '../../../actions/auth';
import {
  getTheUserInformation,
  AdminUpdateExpert,
} from "../../../actions/admin";
import SidebarMenuAdmin from "../sidebar-admin";
import { COUNTRY_CODES } from "../../../constants/country-codes";
// import SidebarMenuExpert from '../sidebar-expert';
// import SidebarMenuUser from '../sidebar-user';

import classnames from "classnames";

import axios from "axios";
import { API_URL, Image_URL } from "../../../constants/api";

class UsersProfileView extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      successmessage: "",
      errorMessage: "",

      categories: [],

      role: "",

      firstName: "",
      lastName: "",
      email: "",
      password: "", //remove it
      userBio: "",
      profile: "",
      expertRates: "",
      expertCategories: "",
      profileImage: "",
      expertContact: "",
      expertContactCC: "",
      university: "",
      expertRating: "",
      expertFocusExpertise: "",
      yearsexpertise: "",
      errors: {},
      resume: "",
      update_resume: "",
      image_select: false,
      twitterURL: "",
      googleURL: "",
      linkedinURL: "",
      facebookURL: "",
      youtubeURL: "",
      soundcloudURL: "",
      instagramURL: "",
      isMusician: false,
      musicCategories: [],
      confirm_password: "",
      passwordMatcherror: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  UNSAFE_componentWillMount() {
    const userRole = this.props.cookies.get("user").role;
    // console.log(userRole)
    this.setState({ role: userRole });
    if (userRole === "Admin") {
      if (
        this.props &&
        this.props !== null &&
        this.props !== undefined &&
        this.props.params &&
        this.props.params !== null &&
        this.props.params !== undefined &&
        this.props.params !== ""
      ) {
        var id = this.props.params;
        this.props.getTheUserInformation(id).then(
          (response) => {
            this.setState({
              firstName: response.user.profile.firstName,
              lastName: response.user.profile.lastName,
              email: response.user.email,
            });
            this.setState({
              userBio: response.user.userBio,
              expertRates: response.user.expertRates,
              expertCategories: response.user.expertCategories,
            });
            this.setState({
              expertContact: response.user.contact,
              expertRating: response.user.expertRating,
              expertFocusExpertise: response.user.expertFocusExpertise,
            });
            this.setState({
              yearsexpertise: response.user.yearsexpertise,
              password: response.user.password,
              expertContactCC: response.user.expertContactCC,
            });
            this.setState({ profileImage: response.user.profileImage });
            this.setState({ university: response.user.university });
            this.setState({ resume: response.user.resume_path });
            this.setState({ facebookURL: response.user.facebookURL });
            this.setState({ twitterURL: response.user.twitterURL });
            this.setState({ googleURL: response.user.googleURL });
            this.setState({ linkedinURL: response.user.linkedinURL });

            this.setState({ youtubeURL: response.user.youtubeURL });
            this.setState({ instagramURL: response.user.instagramURL });
            this.setState({ soundcloudURL: response.user.linkedinURL });
            this.setState({ isMusician: response.user.isMusician });
          },
          (err) => {
            this.setState({ errorMessage: "Sorry Couldn't get Information" });
          }
        );
      }
    } else {
      this.setState({ errorMessage: "Sorry You Are Not Authorized" });
    }

    axios.get(`${API_URL}/getExpertsCategoryList`).then((res) => {
      // console.log(res.data)
      this.setState({ categories: res.data });
      for (let key of res.data) {
        if (key.name === "Music Lessons") {
          this.setState({ musicCategories: key });
        }
      }
    });
  }

  onChange = (e) => {
    switch (e.target.name) {
      case "profile":
        // var ext = $('#profile').val().split('.').pop().toLowerCase();
        // if($.inArray(ext, ['tif','png','jpeg']) == -1) {
        // 	$('#profile').val('');
        // 		alert('Invalid Extension.Image should be .png .jpeg .tiff format');
        // }
        this.setState({ profile: e.target.files });
        break;
      case "resume":
        this.setState({ update_resume: e.target.files });
        break;
      default:
        break;
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    let errors = {};
    if (
      this.state.firstName === "" ||
      this.state.firstName === undefined ||
      this.state.firstName.trim() === ""
    )
      errors.firstName = "First Name cant be empty";
    if (
      this.state.lastName === "" ||
      this.state.lastName === undefined ||
      this.state.lastName.trim() === ""
    )
      errors.lastName = "Last Name cant be empty";
    if (this.state.email === "" || this.state.email === undefined)
      errors.this.state.firstName = "Email cant be empty";
    if (
      this.state.password === "" ||
      this.state.password === undefined ||
      this.state.password.trim() === ""
    )
      errors.password = "Password cant be empty";
    //if(this.state.confirm_password==="" || this.state.confirm_password==undefined ||this.state.confirm_password.trim()==="" ) errors.confirm_password="Confirm Password cant be empty"

    //if(this.state.userBio==="" || this.state.userBio==undefined ||this.state.userBio.trim()==="") errors.userBio="User Bio cant be empty"
    //if(this.state.expertRates===""|| this.state.expertRates==undefined ) errors.expertRates="Expert Rates cant be empty"
    if (
      this.state.expertCategories === "" ||
      this.state.expertCategories === undefined
    )
      errors.expertCategories = "Categories cant be empty";
    if (
      this.state.expertContact === "" ||
      this.state.expertContact === undefined
    )
      errors.expertContact = "Contact cant be empty";
    if (
      this.state.expertContactCC === "" ||
      this.state.expertContactCC === undefined
    )
      errors.expertContactCC = "County Code cant be empty";

    // if(this.state.expertRating==="" || this.state.expertRating==undefined ) errors.expertRating="Ratings cant be empty"
    //if(this.state.expertFocusExpertise==="" || this.state.expertFocusExpertise==undefined || this.state.expertFocusExpertise.trim()==="") errors.expertFocusExpertise="Focus Expertise cant be empty"
    //if(this.state.yearsexpertise===""|| this.state.yearsexpertise==undefined || this.state.yearsexpertise.trim()==="") errors.yearsexpertise="Experience cant be empty"
    if (
      this.state.university === "" ||
      this.state.university === undefined ||
      this.state.university.trim() === ""
    )
      errors.university = "university cant be empty";
    // if(this.state.googleURL===""|| this.state.googleURL==undefined || this.state.googleURL.trim()==="") errors.university="google link cant be empty"
    // if(this.state.linkedinURL===""|| this.state.linkedinURL==undefined || this.state.linkedinURL.trim()==="") errors.linkedinURL="linkdin link  cant be empty"
    // if(this.state.facebookURL===""|| this.state.facebookURL==undefined || this.state.facebookURL.trim()==="") errors.facebookURL="facebook link cant be empty"
    // if(this.state.twitterURL===""|| this.state.twitterURL==undefined || this.state.twitterURL.trim()==="") errors.twitterURL="twitter link cant be empty"
    if (
      this.state.password.length > 0 &&
      this.state.confirm_password.length > 0
    ) {
      if (this.state.password !== this.state.confirm_password)
        errors.confirm_password = "Password not match";
    }

    this.setState({ errors });

    const isValid = Object.keys(errors).length === 0;

    if (isValid) {
      // const {email,firstName,lastName,password,confirm_password,expertCategories,expertContact,expertContactCC,expertFocusExpertise,yearsexpertise,googleURL,twitterURL,facebookURL,linkedinURL,profile,update_resume} = this.state
      var formdata = new FormData(this.state);
      formdata.append("email", this.state.email);
      formdata.append("expertCategories", this.state.expertCategories);
      formdata.append("expertContact", this.state.expertContact);
      formdata.append("expertContactCC", this.state.expertContactCC);
      formdata.append("expertFocusExpertise", this.state.expertFocusExpertise);

      if (this.state.confirm_password.length > 0) {
        formdata.append("password", this.state.password);
      }

      formdata.append("firstName", this.state.firstName);
      formdata.append("lastName", this.state.lastName);
      formdata.append("university", this.state.university);
      formdata.append("yearsexpertise", this.state.yearsexpertise);

      formdata.append(
        "profile",
        this.state.profile.length > 0 ? this.state.profile[0] : "",
        this.state.profile.length > 0 ? this.state.profile[0].name : ""
      );
      formdata.append(
        "resume",
        this.state.update_resume.length > 0 ? this.state.update_resume[0] : "",
        this.state.update_resume.length > 0
          ? this.state.update_resume[0].name
          : ""
      );

      formdata.append("facebookLink", this.state.facebookURL);
      formdata.append("twitterLink", this.state.twitterURL);
      formdata.append("linkedinLink", this.state.linkedinURL);
      formdata.append("googleLink", this.state.googleURL);
      if (this.state.isMusician) {
        formdata.append("instagramLink", this.state.instagramURL);
        formdata.append("youtubeLink", this.state.youtubeURL);
        formdata.append("soundcloudLink", this.state.soundcloudURL);
        formdata.append("isMusician", true);
      } else {
        formdata.append("isMusician", false);
      }

      // this.props.AdminUpdateExpert({email,firstName,lastName, password,userBio,expertRates,expertCategories,expertContact,expertContactCC,expertRating,expertFocusExpertise,yearsexpertise}).then(
      // 		(response)=>{
      // 			this.setState({successmessage:"Successfully Updated"})
      // 			$("html, body").animate(
      // 									{ scrollTop: $('#main').offset().top-10 }, 1000);
      // 		},
      // 		(err)=>{
      // 			console.log("Failure")
      // 		}
      // 	)

      return axios
        .post(`${API_URL}/UpdateUserInfo`, formdata, {})
        .then((response) => {
          if (response.passchange) {
            setTimeout(function () {
              this.props.history.push("/logout");
            }, 1500);
          }
          if (response.data.success) {
            this.props.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  keyPress = (e) => {
    if (e.keyCode === 8) {
      this.setState({
        password: "",
      });
    }
  };

  handleChange = (e) => {
    if (e.target.name === "expertCategories") {
      for (var i = 0; i < this.state.musicCategories.subcategory.length; i++) {
        if (
          e.target.value.match(
            new RegExp(this.state.musicCategories.subcategory[i].name, "i")
          )
        ) {
          this.setState({ isMusician: true });
          break;
        } else {
          this.setState({ isMusician: false });
        }
      }
    }

    // if(e.target.name=='confirm_password'){
    // 	if(this.state.password !=this.state.confirm_password){
    // 		this.setState({passwordMatcherror:true})
    // 	}else{
    // 		this.setState({passwordMatcherror:false})
    // 	}
    // }

    if (!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors);

      delete errors[e.target.name];
      this.setState({
        [e.target.name]: e.target.value,
        errors,
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">Update This Expert</li>
      </ol>
    );
  }

  adminMenu() {
    return <SidebarMenuAdmin />;
  }
  isRole(roleToCheck, toRender) {
    const userRole = this.props.cookies.get("user").role;
    if (userRole === roleToCheck) {
      return toRender;
    }
    return false;
  }

  render() {
    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                {this.isRole("Admin", this.adminMenu())}
                <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">Update Expert</div>
                    {this.state.successmessage &&
                      this.state.successmessage !== null &&
                      this.state.successmessage !== undefined &&
                      this.state.successmessage !== "" && (
                        <div className="alert alert-success">
                          {this.state.successmessage}
                        </div>
                      )}
                    {this.state.errorMessage &&
                      this.state.errorMessage !== null &&
                      this.state.errorMessage !== undefined &&
                      this.state.errorMessage !== "" && (
                        <div className="alert alert-danger">
                          {this.state.errorMessage}
                        </div>
                      )}
                  </div>

                  {this.state.role && this.state.role === "Admin" && (
                    <form id="create_expert" onSubmit={this.handleSubmit}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.state.responseMsg,
                        }}
                      />
                      <div className="row">
                        <div>
                          <img
                            height="120"
                            width="160"
                            alt="profile"
                            src={`${Image_URL}` + this.state.profileImage}
                          />
                        </div>
                        <span>
                          selected file {this.state.profileImage.slice(9)}
                        </span>
                        <div
                          className={classnames("col-md-6 form-group", {
                            "has-error": !!this.state.errors.profile,
                          })}
                        >
                          <label>Profile Picture</label>
                          <input
                            type="file"
                            name="profile"
                            onChange={(e) => this.onChange(e)}
                          />
                        </div>
                        <div
                          className={classnames("col-md-6 form-group", {
                            "has-error": !!this.state.errors.resume,
                          })}
                        >
                          <label>Resume</label>
                          <input
                            type="file"
                            name="resume"
                            onChange={(e) => this.onChange(e)}
                          />
                          <span>
                            selected file {this.state.resume.slice(9)}
                          </span>
                          <span className="error">
                            {this.state.errors.resume}
                          </span>
                        </div>

                        <div
                          className={classnames("col-md-6 form-group", {
                            "has-error": !!this.state.errors.semail,
                          })}
                        >
                          <label>First Name</label>
                          <input
                            name="firstName"
                            className="form-control"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                            type="text"
                          />
                          <span className="error">
                            {this.state.errors.firstName}
                          </span>
                        </div>
                        <div
                          className={classnames("col-md-6 form-group", {
                            "has-error": !!this.state.errors.semail,
                          })}
                        >
                          <label>Last Name</label>
                          <input
                            name="lastName"
                            className="form-control"
                            value={this.state.lastName}
                            onChange={this.handleChange}
                            type="text"
                          />
                          <span className="error">
                            {this.state.errors.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Email</label>
                          <input
                            name="email"
                            readOnly
                            className="form-control"
                            value={this.state.email}
                            type="email"
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Password</label>
                          <input
                            name="password"
                            className="form-control"
                            onKeyDown={this.keyPress}
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                          />
                          <span className="error">
                            {this.state.errors.password}
                          </span>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Confirm Password</label>
                          <input
                            name="confirm_password"
                            className="form-control"
                            value={this.state.confirm_password}
                            onChange={this.handleChange}
                            type="password"
                          />
                          <span className="error">
                            {this.state.errors.confirm_password}
                          </span>
                        </div>
                      </div>
                      {/*<div className="row form-group">
		                      <div className="col-md-12">
		                        <label>Bio</label>
		                         <textarea name="userBio" className="form-control" rows="5" value={this.state.userBio} onChange={this.handleChange} type="text"></textarea>
		                        <span className="error">{this.state.errors.userBio} </span>
		                      </div>
		                    </div>*/}
                      <div className="row form-group">
                        {/* <div className="col-md-3 form-group">
		                        <label>Hourly Rate</label>
		                        <input name="expertRates" className="form-control" value={this.state.expertRates} onChange={this.handleChange} type="number" min="1" max="10"/>
		                      	<span className="error">{this.state.errors.expertRates} </span>
		                      </div>*/}
                        <div className="col-md-3 form-group">
                          <label>Categories</label>
                          {/*<input name="expertCategories" className="form-control" value={this.state.expertCategories} type="select" />*/}
                          <select
                            name="expertCategories"
                            className="form-control"
                            value={this.state.expertCategories}
                            onChange={this.handleChange}
                          >
                            <option value="">Select</option>
                            <option value="accounting">Accounting</option>
                            <option value="accounting-finance">
                              Accounting-finance
                            </option>
                            <option value="blogging">Blogging</option>
                            <option value="graphic-design">
                              Graphic-design
                            </option>
                            <option value="bass">bass</option>*/
                            {this.state.categories.map((cats, i) => (
                              <TheCategories cats={cats} key={i} />
                            ))}
                          </select>
                          <span className="error">
                            {this.state.errors.expertCategories}
                          </span>
                        </div>
                        <div className="col-md-3 form-group">
                          <label>Country-Code</label>
                          <select
                            name="expertContactCC"
                            className="form-control"
                            value={this.state.expertContactCC}
                            onChange={this.handleChange}
                          >
                            {COUNTRY_CODES.map((code, key) => (
                              <option value={code.code}>
                                {code.country + " " + code.code}
                              </option>
                            ))}
                          </select>
                          <span className="error">
                            {this.state.errors.expertContactCC}
                          </span>
                        </div>
                        <div className="col-md-3 form-group">
                          <label>Contact Number</label>
                          <input
                            name="expertContact"
                            className="form-control"
                            value={this.state.expertContact}
                            onChange={this.handleChange}
                            type="number"
                          />
                          <span className="error">
                            {this.state.errors.expertContact}
                          </span>
                        </div>
                      </div>
                      <div className="row form-group">
                        {/*
			                      	<div className="col-md-4 form-group">
			                        <label>Rating</label>
			                        <input name="expertRating" className="form-control" value={this.state.expertRating} onChange={this.handleChange} type="number" min="1" max="10"/>
			                      	<span className="error">{this.state.errors.expertRating} </span>
			                      </div>
		                  		*/}
                        <div className="col-md-4 form-group">
                          <label>Focus of Expertise</label>
                          <input
                            name="expertFocusExpertise"
                            className="form-control"
                            value={this.state.expertFocusExpertise}
                            onChange={this.handleChange}
                            type="text"
                          />
                        </div>
                        <div className="col-md-4 form-group">
                          <label>Years of Expertise</label>
                          <input
                            name="yearsexpertise"
                            className="form-control"
                            value={this.state.yearsexpertise}
                            onChange={this.handleChange}
                            type="select"
                          />
                        </div>
                        <div className="col-md-4 form-group">
                          <label>University</label>
                          <input
                            name="university"
                            className="form-control"
                            value={this.state.university}
                            onChange={this.handleChange}
                            type="text"
                          />
                          <span className="error">
                            {this.state.errors.university}
                          </span>
                        </div>
                      </div>

                      <div className="row form-group">
                        <div className="col-md-4 form-group">
                          <label>Facebook Url</label>
                          <input
                            name="facebookURL"
                            className="form-control"
                            value={this.state.facebookURL}
                            onChange={this.handleChange}
                            type="text"
                          />
                        </div>

                        <div className="col-md-4 form-group">
                          <label>Twitter Url</label>
                          <input
                            name="twitterURL"
                            className="form-control"
                            value={this.state.twitterURL}
                            onChange={this.handleChange}
                            type="text"
                          />
                        </div>

                        <div className="col-md-4 form-group">
                          <label>Linkedin Url</label>
                          <input
                            name="linkedinURL"
                            className="form-control"
                            value={this.state.linkedinURL}
                            onChange={this.handleChange}
                            type="text"
                          />
                        </div>
                        <div className="col-md-4 form-group">
                          <label>Google Url</label>
                          <input
                            name="googleURL"
                            className="form-control"
                            value={this.state.googleURL}
                            onChange={this.handleChange}
                            type="text"
                          />
                        </div>

                        {this.state.isMusician && (
                          <div>
                            <div className="col-md-4 form-group">
                              <label>Youtube Url</label>
                              <input
                                name="youtubeURL"
                                className="form-control"
                                value={this.state.youtubeURL}
                                onChange={this.handleChange}
                                type="text"
                              />
                            </div>
                            <div className="col-md-4 form-group">
                              <label>SoundCloud Url</label>
                              <input
                                name="soundcloudURL"
                                className="form-control"
                                value={this.state.soundcloudURL}
                                onChange={this.handleChange}
                                type="text"
                              />
                            </div>

                            <div className="col-md-4 form-group">
                              <label>Instagram Url</label>
                              <input
                                name="instagramURL"
                                className="form-control"
                                value={this.state.instagramURL}
                                onChange={this.handleChange}
                                type="text"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/*                    <div className="row form-group">
		                        <div className="col-md-4 form-group">
		                        <label>Linkedin</label>
		                        <Field name="linkedinLink" value={renderUrlField} type="url"/>
		                      </div>

		                      <div className="col-md-4 form-group">
		                        <label>snapchat</label>
		                        <Field name="snapchatLink" value={renderUrlField} type="url"/>
		                      </div>
		                    </div>*/}

                      <div className="row form-group">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-default"
                            onClick={this.clearInput}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TheCategories extends React.Component {
  render() {
    return (
      <optgroup label={this.props.cats.name}>
        {this.props.cats.subcategory.map((subcat, k) => (
          <SubCategories subcat={subcat} key={k} />
        ))}
        {/*console.log(this.props.cats.subcategory)*/}
      </optgroup>
    );
  }
}
class SubCategories extends React.Component {
  render() {
    return (
      <option value={this.props.subcat.name}>{this.props.subcat.name} </option>
    );
  }
}

function mapStateToProps(state) {
  return { content: state.auth.content };
}

export default connect(mapStateToProps, {
  getTheUserInformation,
  AdminUpdateExpert,
})(withRouter(withCookies(UsersProfileView)));
