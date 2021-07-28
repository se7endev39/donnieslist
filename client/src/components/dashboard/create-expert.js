import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import axios from "axios";
import _ from "lodash";

import SidebarMenuAdmin from "./sidebar-admin";
import { protectedTest } from "../../actions/auth";
import { createExpert } from "../../actions/expert";
import { API_URL } from "../../constants/api";
import { COUNTRY_CODES } from "../../constants/country-codes";

const form = reduxForm({
  form: "register",
});
const renderField = (field) => (
  <div>
    <input type="text" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

const renderEmailField = (field) => (
  <div>
    <input type="email" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
/*const renderTextarea = (field) => (
  <div>
    <textarea rows="3" className="form-control" {...field.input}></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderBioField = (field) => (
  <div>
    <input
      type="email"
      placeholder="Your email here"
      className="form-control"
      {...field.input}
    />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);*/
const renderFieldyearsexpertise = (field) => (
  <div>
    <select name="yearsexpertise" className="form-control" {...field.input}>
      <option value="">Select</option>
      {_.range(0, 41).map((index) => (
        <option value={index.toString()} key={`OPTION_${index}`}>
          {index}
        </option>
      ))}
    </select>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

// const renderFieldexpertCategories = field => (
//   <div>
//     <select name="expertCategories" className="form-control" {...field.input} >
//       <option value="">Select</option>
//       <option value="accounting">Accounting</option>
//       <option value="accounting-finance">Accounting-finance</option>
//       <option value="blogging">Blogging</option>
//       <option value="graphic-design">Graphic-design</option>
//       <option value="bass">bass</option>
//     </select>
//     {field.touched && field.error && <div className="error">{field.error}</div>}
//   </div>
// );

class CreateExpert extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      responseMsg: "",
      categories: [],
      musicCategories: [],
      role: "",
      profile: [],
      resume: [],
      imageselect: false,
      resumeselect: false,
      facebookLink: "",
      linkdinLink: "",
      googleLink: "",
      twitterLink: "",
      show: false,
      social_link: "",
      isMusician: false,
      select_category: "",
    };

    this.props.protectedTest();
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitLink = this.submitLink.bind(this);
  }
  UNSAFE_componentWillMount() {
    const userRole = this.props.cookies.get("user").role;
    // console.log(userRole)
    this.setState({ role: userRole });
    if (userRole !== "Admin") {
      this.setState({ errorMessage: "Sorry You Are Not Authorized" });
    }

    axios.get(`${API_URL}/getExpertsCategoryList`).then((res) => {
      this.setState({ categories: res.data });
      for (let key of res.data) {
        if (key.name === "Music Lessons") {
          this.setState({ musicCategories: key });
        }
      }
    });
  }
  componentDidMount() {
    window.$(document).ready(function () {
      window.$("#create_expert").validate({
        rules: {
          // firstName: {
          //     required: true
          // },
          // lastName: {
          //     required: true
          // },
          // email: {
          //     required: true,
          //     email:true
          // },
          // university:{
          //    required: true,
          // },
          // password: {
          //     required: true
          // },
          // profile:{
          //    required: true
          // },
          // resume:{
          //    required: true
          // },
          // userBio: {
          //     required: true
          // },
          // expertRates: {
          //     required: true
          // },
          // expertCategories: {
          //     required: true
          // },
          // expertContact: {
          //     required: true
          // },
          // expertContactCC:{
          //      required:true
          // },
          // expertRating: {
          //     required: true
          // },
          // expertFocusExpertise: {
          //     required: true
          // },
          // yearsexpertise: {
          //     required: true
          // },
          // facebook:{
          //    required: true
          // },
          // linkdin:{
          //   required: true
          // },
          // google:{
          //   required: true
          // },
          // twitter:{
          //   required: true
          // }
        },
        messages: {
          // firstName:{
          //   required: "Please enter this field"
          // },
          // lastName:{
          //   required: "Please enter this field"
          // },
          // email:{
          //   required: "Please enter this field"
          // },
          // profile:{
          //   required: "Please enter this field"
          // },
          // resume:{
          //   required: "Please enter this field"
          // },
          // userBio: {
          //   required: "Please enter this field"
          // },
          // expertContactCC:{
          //   required: "Please enter this field"
          // },
          // facebook:{
          //   required: "Please enter this field"
          // },
          // linkdin:{
          //    required: "Please enter this field"
          // },
          // google:{
          //  required: "Please enter this field"
          // },
          // twitter:{
          //    required: "Please enter this field"
          // }
        },
      });
    });
  }

  submitLink() {
    this.handleClose();
  }

  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }

  social_modal = (link) => {
    switch (link) {
      case "facebook":
        this.setState({ social_link: "Facebook" });
        this.handleShow();
        break;
      case "twitter":
        this.setState({ social_link: "Twitter" });
        this.handleShow();
        break;
      case "google":
        this.setState({ social_link: "Google" });
        this.handleShow();
        break;
      case "linkdin":
        this.setState({ social_link: "Linkdin" });
        this.handleShow();
        break;
      default:
        break;
    }
  };

  getsubcategories = (event) => {
    this.setState({ select_category: event.target.value });
    for (var i = 0; i < this.state.musicCategories.subcategory.length; i++) {
      if (
        event.target.value.match(
          new RegExp(this.state.musicCategories.subcategory[i].name, "i")
        )
      ) {
        this.setState({ isMusician: true });
        break;
      } else {
        this.setState({ isMusician: false });
      }
    }
  };

  setSocialLink = (e) => {
    switch (this.state.social_link) {
      case "Facebook":
        this.setState({ facebookLink: e.target.value });
        break;
      case "Twitter":
        this.setState({ twitterLink: e.target.value });
        break;
      case "Google":
        this.setState({ googleLink: e.target.value });
        break;
      case "Linkdin":
        this.setState({ linkdinLink: e.target.value });
        break;
      default:
        break;
    }
  };

  clearInput() {
    this.props.location.reload();
  }

  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">Create Expert</li>
      </ol>
    );
  }

  isRole(roleToCheck, toRender) {
    const userRole = this.props.cookies.get("user").role;
    if (userRole === roleToCheck) {
      return toRender;
    }
    return false;
  }

  adminMenu() {
    // return (
    //   <ul className="nav nav-sidebar" id="menu">
    //       <li>
    //           <a href="#!" data-target="#item1" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Users Management <span className="caret"></span></span></a>
    //           <ul className="nav nav-stacked collapse" id="item1">
    //               <li><Link to="#">List Users</Link></li>
    //               <li><Link to="/dashboard/create-expert">Create Expert</Link></li>
    //           </ul>
    //       </li>
    //       <li>
    //           <a href="#!" data-target="#item2" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Session Management <span className="caret"></span></span></a>
    //           <ul className="nav nav-stacked collapse" id="item2">
    //               <li><Link to="#">List Active Sessions</Link></li>
    //           </ul>
    //       </li>
    //   </ul>
    // );
    return <SidebarMenuAdmin />;
  }

  handleFormSubmit(formProps) {
    if (this.state.profile.length > 0) {
      this.setState({ imageselect: false });
    }
    if (this.state.resume.length > 0) {
      this.setState({ resumeselect: false });
    }
    if (this.state.profile.length === 0 || this.state.resume.length === 0) {
      this.setState({ imageselect: true });
    } else {
      var formdata = new FormData(formProps);
      formdata.append("email", formProps.email);
      formdata.append(
        "expertCategories",
        this.state.select_category ? this.state.select_category : ""
      );
      formdata.append("expertContact", formProps.expertContact);
      formdata.append("expertContactCC", formProps.expertContactCC);
      formdata.append(
        "expertFocusExpertise",
        formProps.expertFocusExpertise ? formProps.expertFocusExpertise : ""
      );
      formdata.append("firstName", formProps.firstName);
      formdata.append("lastName", formProps.lastName);
      formdata.append("password", formProps.password);
      formdata.append("university", formProps.university);
      formdata.append(
        "yearsexpertise",
        formProps.yearsexpertise ? formProps.yearsexpertise : ""
      );

      formdata.append(
        "profile",
        this.state.profile.length > 0 ? this.state.profile[0] : "",
        this.state.profile.length > 0 ? this.state.profile[0].name : ""
      );
      formdata.append(
        "resume",
        this.state.resume.length > 0 ? this.state.resume[0] : "",
        this.state.resume.length > 0 ? this.state.resume[0].name : ""
      );
      formdata.append(
        "facebookLink",
        formProps.facebookLink ? formProps.facebookLink : ""
      );
      formdata.append(
        "twitterLink",
        formProps.twitterLink ? formProps.twitterLink : ""
      );
      formdata.append(
        "linkedinLink",
        formProps.linkdinLink ? formProps.linkdinLink : ""
      );
      formdata.append(
        "googleLink",
        formProps.googleLink ? formProps.googleLink : ""
      );
      if (this.state.isMusician) {
        formdata.append("isMusician", true);
        formdata.append(
          "youtubeLink",
          formProps.youtubeLink ? formProps.youtubeLink : ""
        );
        formdata.append(
          "instagramLink",
          formProps.instagramLink ? formProps.instagramLink : ""
        );
        formdata.append(
          "soundcloudLink",
          formProps.soundcloudLink ? formProps.soundcloudLink : ""
        );
        console.log(formProps);
      } else {
        formdata.append("isMusician", false);
      }

      return axios
        .post(`${API_URL}/createExpert`, formdata, {
          headers: { Authorization: this.props.cookies.get("token") },
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
            //this.clearInput();
            window.$(".form-control").val("");
            window.$("form").each(function () {
              this.reset();
            });
          }
          if (response.data.success) {
            this.setState({
              responseMsg:
                "<div class='alert alert-success text-center'>" +
                response.data.message +
                "</div>",
            });

            //this.clearInput();
            //document.getElementById("create_expert").reset();
            // window.$(".form-control").val("");
            // window.$('#create_expert').each(function(){
            //     this.reset();
            // });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            responseMsg:
              "<div class='alert alert-danger text-center'>" + error + "</div>",
          });
        });
    }
  }

  onChange = (e) => {
    // const state = this.state;
    switch (e.target.name) {
      case "profile":
        this.setState({ profile: e.target.files });
        this.setState({ imageselect: false });
        break;
      case "resume":
        this.setState({ resume: e.target.files });
        this.setState({ resumeselect: false });
        break;
      default:
        break;
    }
  };

  render() {
    const renderFieldexpertCategories = (field) => (
      <div>
        <select
          name="expertCategories"
          className="form-control"
          {...field.input}
          onChange={this.getsubcategories}
        >
          <option value="">Select</option>
          {/*<option value="">Select</option>
      <option value="accounting">Accounting</option>
      <option value="accounting-finance">Accounting-finance</option>
      <option value="blogging">Blogging</option>
      <option value="graphic-design">Graphic-design</option>
      <option value="bass">bass</option>*/}
          {this.state.categories.map((cats, i) => (
            <TheCategories cats={cats} />
          ))}
        </select>
        {field.touched && field.error && (
          <div className="error">{field.error}</div>
        )}
      </div>
    );

    const { handleSubmit } = this.props;
    const renderCountryCodes = (field) => (
      <div>
        <select
          name="expertContactCC"
          className="form-control"
          {...field.input}
        >
          <option value="">Select</option>
          {COUNTRY_CODES.map((code, index) => (
            <option value={code.code} key={`COUNTRY_KEY_${index}`} >{code.country + " " + code.code}</option>
          ))}
        </select>
        {field.touched && field.error && (
          <div className="error">{field.error}</div>
        )}
      </div>
    );
    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                {this.isRole("Admin", this.adminMenu())}
                <div
                  className="column col-sm-3 col-xs-1 sidebar-offcanvas"
                  id="sidebar"
                ></div>
                <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">Create Expert</div>

                    {this.state.errorMessage &&
                      this.state.errorMessage !== null &&
                      this.state.errorMessage !== undefined &&
                      this.state.errorMessage !== "" && (
                        <div className="alert alert-danger">
                          {this.state.errorMessage}
                        </div>
                      )}
                  </div>
                  {/* form begin here */}
                  {this.state.role && this.state.role === "Admin" && (
                    <div>
                      <form
                        id="create_expert"
                        enctype="multipart/form-data"
                        onSubmit={handleSubmit(
                          this.handleFormSubmit.bind(this)
                        )}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.state.responseMsg,
                          }}
                        />
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label>First Name*</label>
                            <Field
                              name="firstName"
                              component={renderField}
                              type="text"
                            />
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Last Name*</label>
                            <Field
                              name="lastName"
                              component={renderField}
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Email*</label>
                            <Field
                              name="email"
                              component={renderEmailField}
                              type="email"
                            />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Password*</label>
                            <Field
                              name="password"
                              component={renderField}
                              type="password"
                            />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Profile Picture*</label>
                            <input
                              type="file"
                              name="profile"
                              className="form-control"
                              onChange={(e) => this.onChange(e)}
                            />
                            {this.state.imageselect && (
                              <div className="error">
                                This field is require.
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Upload Resume*</label>
                            <input
                              type="file"
                              className="form-control"
                              name="resume"
                              onChange={(e) => this.onChange(e)}
                            />
                            {this.state.resumeselect && (
                              <div className="error">
                                This field is require.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row form-group">
                          <div className="col-md-4 form-group">
                            <label>University*</label>
                            <Field
                              name="university"
                              component={renderField}
                              type="text"
                            />
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Categories*</label>
                            <Field
                              name="expertCategories"
                              component={renderFieldexpertCategories}
                              type="select"
                            />
                          </div>
                          <div className="col-md-3 form-group">
                            <label>Country Code*</label>
                            <Field
                              name="expertContactCC"
                              component={renderCountryCodes}
                              type="number"
                            />
                          </div>
                        </div>
                        <div className="row form-group">
                          {/*<div className="col-md-4 form-group">
                                                      <label>Rating</label>
                                                      <Field name="expertRating" component={renderField} type="number" min="1" max="10"/>
                                                    </div>*/}
                          <div className="col-md-4 form-group">
                            <label>Contact Number*</label>
                            <Field
                              name="expertContact"
                              component={renderField}
                              type="number"
                            />
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Focus of Expertise</label>
                            <Field
                              name="expertFocusExpertise"
                              component={renderField}
                              type="text"
                            />
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Years of Expertise</label>
                            <Field
                              name="yearsexpertise"
                              component={renderFieldyearsexpertise}
                              type="select"
                            />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-4 form-group">
                            <label>Facebook Url</label>
                            <Field
                              name="facebookLink"
                              component={renderField}
                              type="text"
                            />
                          </div>

                          <div className="col-md-4 form-group">
                            <label>Twitter Url</label>
                            <Field
                              name="twitterLink"
                              component={renderField}
                              type="text"
                            />
                          </div>

                          <div className="col-md-4 form-group">
                            <label>Linkedin Url</label>
                            <Field
                              name="linkdinLink"
                              component={renderField}
                              type="text"
                            />
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Google Url</label>
                            <Field
                              name="googleLink"
                              component={renderField}
                              type="text"
                            />
                          </div>
                          {this.state.isMusician && (
                            <div>
                              <div className="col-md-4 form-group">
                                <label>Youtube Url</label>
                                <Field
                                  name="youtubeLink"
                                  component={renderField}
                                  type="text"
                                />
                              </div>
                              <div className="col-md-4 form-group">
                                <label>Instagram Url</label>
                                <Field
                                  name="instagramLink"
                                  component={renderField}
                                  type="text"
                                />
                              </div>

                              <div className="col-md-4 form-group">
                                <label>SoundCoud Url</label>
                                <Field
                                  name="soundcloudLink"
                                  component={renderField}
                                  type="text"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/*<div className="row ">
                          <a className="btn btn-social-icon btn-facebook" onClick={(e)=>this.social_modal('facebook')}><span className="fa fa-facebook"></span></a>
                                <input name="facebook" type="hidden" value={this.state.facebookLink} />
                           <a className="btn btn-social-icon btn-linkedin" onClick={(e)=>this.social_modal('linkdin')}><span className="fa fa-linkedin"></span></a>
                               <input name="linkdin" type="hidden" value={this.state.linkdinLink} />
                           <a className="btn btn-social-icon btn-google" onClick={(e)=>this.social_modal('google')}><span className="fa fa-google"></span></a>
                               <input name="google" type="hidden" value={this.state.googleLink} />
                           <a className="btn btn-social-icon btn-twitter" onClick={(e)=>this.social_modal('twitter')}><span className="fa fa-twitter"></span></a>
                              <input name="twitter" type="hidden" value={this.state.twitterLink} />
                        </div>*/}

                        <div className="row form-group">
                          <div className="col-md-12">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>

                      <button
                        className="btn btn-default"
                        onClick={this.clearInput}
                      >
                        Reset
                      </button>
                    </div>
                  )}
                  {/* form end here */}
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
          <SubCategories key={k} subcat={subcat} />
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
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}
export default connect(mapStateToProps, { protectedTest, createExpert })(
  withCookies(form(CreateExpert))
);
