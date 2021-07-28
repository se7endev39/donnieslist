import React, { Component } from "react";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";

import { API_URL, Image_URL } from "../constants/api";

var Dropzone = require("react-dropzone");

// const masonryOptions = {
//   transitionDuration: 0,
// };

class TestPage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      category: "",
      posts: [],
      loading: true,
      error: null,

      showClickButton: false,
      profileImage: "",
      RelatedImages1: [],
    };
    this.onDrop = this.onDrop.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: false,
      error: null,
    });
  }

  renderLoading() {
    return (
      <img className="loader-center" src="/img/ajax-loader.gif" alt="" />
    );
  }

  renderError() {
    return (
      <div className="error-message">Uh oh: {this.state.error.message}</div>
    );
  }

  handleFormSubmit(formProps) {}

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

    console.log("formData:", formData);

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

  onDrop(acceptedFiles) {
    console.log("acceptedFiles: ", acceptedFiles);
    this.setState({
      RelatedImages1: acceptedFiles,
      showClickButton: true,
    });
  }

  renderPosts() {
    const { handleSubmit } = this.props;

    if (this.state.error) {
      return this.renderError();
    }

    // const imagesLoadedOptions = { background: ".my-bg-image-el" };

    return (
      <div id="experts-list" className="experts-list">
        <div className="container">
          <div className="row">
            <div className="row">
              <div className="col-md-12">
                <div className="text-center text-choose">
                  Choose your subject
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <form
                id="expert_signup_form"
                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: this.state.responseMsg }}
                />

                <div className="row pad15">
                  <div className="col-md-6">
                    <label className="label-align">
                      Choose Profile Picture
                    </label>
                    {this.state.profileImage &&
                    this.state.profileImage !== null &&
                    this.state.profileImage !== "" ? (
                      <div>
                        <img
                          height="120"
                          width="160"
                          src={`${Image_URL}` + this.state.profileImage}
						  alt=""
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.RelatedImages1.length > 0 ? (
                      <div className="inline-block brdr img_preview_main">
                        
                        {this.state.RelatedImages1.map((file, id) => (
                          <div className="img_preview" key={id}>
                            
                            <img
                              src={file.preview}
                              alt="Preview Not Available"
                              width={160}
                              height={90}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <Dropzone
                      className="inline-block icon"
                      accept="image/*"
                      multiple="false"
                      ref={(node) => {
                        this.dropzone = node;
                      }}
                      onDrop={this.onDrop}
                    >
                      <i className="fa fa-camera"></i>
                    </Dropzone>

                    {this.state.showClickButton === true && (
                      <div className="inline-block Upload-button">
                        <button
                          onClick={this.uploadImage}
                          className="btn Btn_common"
                          style={{
                            "padding-top": 15 + "px",
                            "padding-bottom": 15 + "px",
                          }}
                        >
                          <i
                            className="fa fa-paper-plane-o"
                            aria-hidden="true"
                          ></i>
                          Update Photo
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="label-align">Upload Resume</label>
                    <Dropzone
                      className="inline-block icon"
                      accept="application/*"
                      multiple="false"
                      ref={(node) => {
                        this.dropzone = node;
                      }}
                      onDrop={this.onDropResume}
                    >
                      <i className="fa fa-file"></i>
                    </Dropzone>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading ? this.renderLoading() : this.renderPosts()}
      </div>
    );
  }
}

//export default connect(mapStateToProps, {})(form(TestPage));
export default withCookies(TestPage);
