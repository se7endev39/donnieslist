import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Cookies, withCookies } from "react-cookie";
import axios from "axios";
import _ from "lodash";
import { instanceOf } from "prop-types";
import { withRouter } from "react-router-dom";

import { createExpert, getExpertEmailFromToken } from "../../actions/expert";
import { API_URL, CLIENT_ROOT_URL } from "../../constants/api";
import { COUNTRY_CODES } from "../../constants/country-codes";


const form = reduxForm({
  form: "expertSignup",
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
      {_.range(1, 41).map((index) => (
        <option value={index.toString()} key={`OPTION_ITEM_${index}`}>
          {index}
        </option>
      ))}
    </select>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
// specifying your onload callback function
/* var callback = function () {
  console.log("Done!!!!");
}; */

class ExpertSignup extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      show_form: false,
      recaptcha_value: "",
      responseMsg: "",
      categories: [],
      musicCategories: [],
      role: "",
      showClickButton: false,
      profileImage: "",
      RelatedImages1: [],
      profile: [],
      resume: [],
      imageselect: false,
      facebookLink: "",
      linkdinLink: "",
      googleLink: "",
      twitterLink: "",
      show: false,
      social_link: "",
      isMusician: false,
      select_category: "",
    };

    //console.log('props: ',this.props);
    console.log("props token: ", this.props.match.params.token);
    if (this.props.route.path === "expert-signup/:token") {
      console.log("disable popup");
    }
    // const currentUser = cookie.load("user");

    /*if(this.props.match.params.token){
      //var formProps['token'] = this.props.match.params.token;
      this.props.getExpertEmailFromToken(this.props.match.params.token).then(
        (response)=>{
        },
        (err) => err.response.json().then(({errors})=> {
          //this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+errors+"</div>"});
        })
      )
    }else{
      console.log('in else');
      this.setState({show_form : false});
    }*/

    this.onDrop = this.onDrop.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitLink = this.submitLink.bind(this);
  }

  onDropResume(acceptedFiles) {
    console.log("acceptedFiles: ", acceptedFiles);
    this.setState({
      RelatedImages1: acceptedFiles,
      showClickButton: true,
    });
  }

  onDrop(acceptedFiles) {
    console.log("acceptedFiles: ", acceptedFiles);
    this.setState({
      RelatedImages1: acceptedFiles,
      showClickButton: true,
    });
  }

  uploadImage() {
    // const { email, RelatedImages1 } = this.state;
    var formData = new FormData();
    // var data = this.state;

    //console.log('data:',data);

    /*Object.keys(data).forEach(( key ) => {
        if(key === 'RelatedImages1'){
          formData.append(key, data[key][0]);
        }else{
          if(key ==='email' ){
            formData.append("expertEmail", 'donnydey@gmail.com');
          }
        }
      });*/

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
          res !== null &&
          res !== undefined &&
          res.SuccessMessage &&
          res.SuccessMessage !== null &&
          res.SuccessMessage !== undefined &&
          res.SuccessMessage !== ""
        ) {
          this.setState({
            successMessage: "Successfully Uploaded Profile Image",
            RelatedImages1: "",
            showClickButton: false,
          });

          const currentUser = this.props.cookies.get("user");
          if (
            currentUser &&
            currentUser !== null &&
            currentUser !== undefined &&
            currentUser !== ""
          ) {
            var id = currentUser._id;
            this.props.fetchMyProfile(id).then(
              (response) => {
                this.setState({
                  profileImage: response.data.user.profileImage,
                });
              },
              (err) => {
                this.setState({
                  errorMessage: "Sorry Couldn't get Information",
                });
              }
            );
          }
        } else if (
          res &&
          res != null &&
          res !== undefined &&
          res.errorMessage
        ) {
          this.setState({ errorMessage: res.errorMessage });
        }
      });
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  // specifying verify callback function
  verifyCallback = function (response) {
    console.log("verifyCallback " + response);
    window.$("#hiddenRecaptcha").val(response);
    var recaptcha_value = response;
    this.setState({
      recaptcha_value,
      //   responseEmailMsg,
    });
  };

  componentDidMount() {
    window.$(document).ready(function () {
      window.$("#expert_signup_form").validate({
        rules: {
          firstName: {
            required: true,
          },
          lastName: {
            required: true,
          },
          email: {
            required: true,
            email: true,
          },
          university: {
            required: true,
          },
          password: {
            required: true,
          },
          profile: {
            required: true,
          },
          resume: {
            required: true,
          },
          // userBio: {
          //     required: true
          // },
          // expertRates: {
          //     required: true
          // },

          // expertCategories: {
          //     required: true
          // },
          expertContact: {
            required: true,
            number: true,
          },
          expertContactCC: {
            required: true,
          },
          expertRating: {
            required: true,
          },
          expertFocusExpertise: {
            required: true,
          },
          yearsexpertise: {
            required: true,
          },
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
          firstName: {
            required: "Please enter this field",
          },
          lastName: {
            required: "Please enter this field",
          },
          email: {
            required: "Please enter this field",
          },
          profile: {
            required: "Please enter this field",
          },
          resume: {
            required: "Please enter this field",
          },
          university: {
            required: "Please enter this field",
          },
          userBio: {
            required: "Please enter this field",
          },
          expertContactCC: {
            required: "Please enter this field",
          },
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

  UNSAFE_componentWillMount() {
    if (this.props.authenticated) {
      this.context.router.push("/dashboard");
    }
    //fetch all expert categories for dropdown
    axios.get(`${API_URL}/getExpertsCategoryList`).then((res) => {
      this.setState({ categories: res.data });
      for (let key of res.data) {
        if (key.name === "Music Lessons") {
          this.setState({ musicCategories: key });
        }
      }
    });
  }

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

  onChange = (e) => {
    // const state = this.state;
    switch (e.target.name) {
      case "profile":
        var ext = window.$("#profile").val().split(".").pop().toLowerCase();
        if (window.$.inArray(ext, ["tif", "png", "jpeg"]) === -1) {
          window.$("#profile").val("");
          alert("Invalid Extension.Image should be .png .jpeg .tiff format");
        }
        this.setState({ profile: e.target.files });
        break;
      case "resume":
        this.setState({ resume: e.target.files });
        break;
      default:
        break;
    }
  };

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.authenticated) {
      this.context.router.push("/dashboard");
    }
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

  handleFormSubmit(formProps) {
    console.log(formProps);
    if (this.state.profile.length === 0 || this.state.resume.length === 0) {
      this.setState({ imageselect: true });
    } else {
      const { params } = this.props;
      var formdata = new FormData(formProps);
      formdata.append("email", formProps.email);
      formdata.append(
        "expertCategories",
        this.state.select_category ? this.state.select_category : ""
      );
      formdata.append("expertContact", formProps.expertContact);
      formdata.append("expertContactCC", formProps.expertContactCC);
      formdata.append("expertFocusExpertise", formProps.expertFocusExpertise);
      formdata.append("firstName", formProps.firstName);
      formdata.append("lastName", formProps.lastName);
      formdata.append("password", formProps.password);
      formdata.append("university", formProps.university);
      formdata.append("yearsexpertise", formProps.yearsexpertise);
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
        formProps.facebook ? formProps.facebook : ""
      );
      formdata.append(
        "twitterLink",
        formProps.twitter ? formProps.twitter : ""
      );
      formdata.append(
        "linkedinLink",
        formProps.linkdin ? formProps.linkdin : ""
      );
      formdata.append("googleLink", formProps.google ? formProps.google : "");

      if (this.state.isMusician) {
        formdata.append("isMusician", true);
        formdata.append(
          "instagramLink",
          formProps.instagramLink ? formProps.instagramLink : ""
        );
        formdata.append(
          "youtubeLink",
          formProps.youtubeLink ? formProps.youtubeLink : ""
        );
        formdata.append(
          "soundcloudLink",
          formProps.soundcloudLink ? formProps.soundcloudLink : ""
        );
      } else {
        formdata.append("isMusician", false);
      }

      if (params.token) {
        formdata.append("token", params.token);
      }

      return axios
        .post(`${API_URL}/createExpert`, formdata)
        .then((response) => {
          if (response.error) {
            this.setState({
              responseMsg:
                "<div class='alert alert-danger text-center'>" +
                response.error +
                "</div>",
            });
          }
          if (response.data.success) {
            this.setState({
              responseMsg:
                "<div class='alert alert-success text-center'>" +
                response.data.message +
                ". Sit tight, you will be redirected to secure area of site.</div>",
            });

            window.$(".form-control").val("");
            window.$("form").each(function () {
              this.reset();
            });
            this.props.cookies.set("token", response.data.token, { path: "/", secure: false, sameSite: "Lax" });
            this.props.cookies.set("user", response.data.user, { path: "/", secure: false, sameSite: "Lax" });
            window.location.href = `${CLIENT_ROOT_URL}`;
            setTimeout(function () {
              //   close();
            }, 1500);
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            responseMsg:
              "<div class='alert alert-danger text-center'>" + error + "</div>",
          });
        });

      // this.props.createExpert(formProps).then(
      //   (response)=>{
      //
      //     if(response.error){
      //
      //         this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+response.error+"</div>"});
      //
      //         window.$(".form-control").val("");
      //         window.$( 'form' ).each(function(){
      //             this.reset();
      //         });
      //     }else{
      //
      //       this.setState({responseMsg : "<div class='alert alert-success text-center'>"+response.message+". Sit tight, you will be redirected to secure area of site.</div>"});
      //
      //       window.$(".form-control").val("");
      //       window.$( 'form' ).each(function(){
      //           this.reset();
      //       });
      //       cookie.save('token', response.token, { path: '/' });
      //       cookie.save('user', response.user, { path: '/' });
      //       window.location.href = `${CLIENT_ROOT_URL}`;
      //       setTimeout(function(){
      //         close();
      //       },1500);
      //     }
      //   },
      //   (err) => err.response.json().then(({errors})=> {
      //     this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+errors+"</div>"});
      //   })
      // )
    }
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
          <span>
            <strong>Error!</strong> {this.props.errorMessage}
          </span>
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    const renderFieldexpertCategories = (field) => (
      <div>
        <select
          name="expertCategories"
          className="form-control"
          {...field.input}
          onChange={this.getsubcategories}
        >
          <option value="">Select Categories</option>
          {this.state.categories.map((cats, i) => (
            <TheCategories cats={cats} key={`CAT_${i}`}/>
          ))}
        </select>
        {field.touched && this.state.select_category.length === 0 && (
          <div className="error">Categoy should not be empty</div>
        )}
      </div>
    );

    const renderCountryCodes = (field) => (
      <div>
        <select
          name="expertContactCC"
          className="form-control"
          {...field.input}
        >
          {/*console.log(this.state.codes)*/}
          {COUNTRY_CODES.map((code, index) => (
            <option value={code.code} key={`COUNTRY_KEY_${index}`}>{code.country + " " + code.code}</option>
          ))}
        </select>
        {field.touched && field.error && (
          <div className="error">{field.error}</div>
        )}
      </div>
    );

    return (
      <div className="container">
        <div className="col-sm-8 col-sm-offset-2" show={this.state.show_form}>
          <div className="page-title text-center">
            <h2>Expert Join</h2>
          </div>
          <p className="text-center">
            Please fill in your details to join Donnie's List as an Expert
          </p>

          {this.state.errorMessage &&
            this.state.errorMessage !== null &&
            this.state.errorMessage !== undefined &&
            this.state.errorMessage !== "" && (
              <div className="alert alert-danger">
                {this.state.errorMessage}
              </div>
            )}

          <form
            id="expert_signup_form"
            onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
          >
            <div dangerouslySetInnerHTML={{ __html: this.state.responseMsg }} />
            {/*}
              <div className="row pad15">
                <div className="col-md-6">
                  <label className="label-align">Choose Profile Picture</label>
                  {this.state.profileImage && this.state.profileImage != null && this.state.profileImage != "" ? <div><img height="120" width="160" src={`${Image_URL}`+this.state.profileImage} /></div> : ""}
                  {this.state.RelatedImages1.length > 0 ? <div className="inline-block brdr img_preview_main"> {this.state.RelatedImages1.map((file,id) => <div className='img_preview' key={id}> <img src={file.preview} alt="Preview Not Available" width={160} height={90}/></div> )} </div> : null}

                  <Dropzone className="inline-block icon" accept="image/*" multiple="false" ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
                    <i className="fa fa-camera"></i>
                  </Dropzone>

                  { this.state.showClickButton==true &&
                    <div className="inline-block Upload-button">
                      <button onClick={this.uploadImage} className="btn Btn_common" style={{'padding-top': 15+"px", 'padding-bottom': 15+"px"}}>
                          <i className="fa fa-paper-plane-o" aria-hidden="true"></i> Update Photo
                      </button>
                    </div>
                  }
                </div>
                <div className="col-md-6">
                  <label className="label-align">Upload Resume</label>
                  <Dropzone className="inline-block icon" accept="application/*" multiple="false" ref={(node) => { this.dropzone = node; }} onDrop={this.onDropResume}>
                    <i className="fa fa-file"></i>
                  </Dropzone>
                </div>
              </div>
              {*/}
            <div className="row">
              <div className="col-md-6 form-group">
                <label>First Name</label>
                <Field name="firstName" component={renderField} type="text" />
              </div>
              <div className="col-md-6 form-group">
                <label>Last Name</label>
                <Field name="lastName" component={renderField} type="text" />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label>Email</label>
                <Field name="email" component={renderEmailField} type="email" />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label>Password</label>
                <Field
                  name="password"
                  component={renderField}
                  type="password"
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label>Profile Picture</label>
                <input
                  id="profile"
                  accept="image/tiff, image/png"
                  type="file"
                  name="profile"
                  onChange={(e) => this.onChange(e)}
                />
                {this.state.imageselect && (
                  <div className="error">This field is require.</div>
                )}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label>Upload Resume</label>
                <input
                  id="resume"
                  type="file"
                  name="resume"
                  onChange={(e) => this.onChange(e)}
                />
                {this.state.imageselect && (
                  <div className="error">This field is require.</div>
                )}
              </div>
            </div>

            <div className="row form-group">
              <div className="col-md-4 form-group">
                <label>University</label>
                <Field name="university" component={renderField} type="text" />
              </div>
              <div className="col-md-4 form-group">
                <label>Categories</label>
                <Field
                  name="expertCategories"
                  component={renderFieldexpertCategories}
                  type="select"
                />
              </div>
              <div className="col-md-3 form-group">
                <label>Country Code</label>
                <Field
                  name="expertContactCC"
                  component={renderCountryCodes}
                  type="number"
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-4 form-group">
                <label>Contact Number</label>
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
                <Field name="facebook" component={renderField} type="text" />
              </div>

              <div className="col-md-4 form-group">
                <label>Twitter Url</label>
                <Field name="twitter" component={renderField} type="text" />
              </div>

              <div className="col-md-4 form-group">
                <label>Linkedin Url</label>
                <Field name="linkdin" component={renderField} type="text" />
              </div>
              <div className="col-md-4 form-group">
                <label>Google Url</label>
                <Field name="google" component={renderField} type="text" />
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
            {/* <div className="row ">
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
          <SubCategories subcat={subcat} />
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

export default connect(mapStateToProps, {
  createExpert,
  getExpertEmailFromToken,
})(withRouter(withCookies(form(ExpertSignup))));
