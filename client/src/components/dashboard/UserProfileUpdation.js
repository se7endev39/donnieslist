// UserProfileUpdation
import React, { Component } from 'react';
import { connect} from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import { protectedTest } from '../../actions/auth';
import { fetchMyProfile,API_URL, Image_URL } from '../../actions/index';
import {UpdateMyProfile} from '../../actions/user'

import SidebarMenuAdmin from './sidebar-admin';
import SidebarMenuExpert from './sidebar-expert';
import SidebarMenuUser from './sidebar-user';

import classnames from 'classnames'
var Dropzone = require('react-dropzone');
const currentUser = cookie.load('user');

class UserProfileUpdation extends Component {

	constructor(props){
		super(props)
		this.state={
			successmessage:"",
			errorMessage:'',
			firstName:"",
			lastName:"",

			profileImage:"",

 	    	RelatedImages1:[],

			email:"",
			password:"",
			userBio:"",
			expertRates:"",
			expertCategories:"",
			expertContact:"",
			expertRating:"",
			expertFocusExpertise:"",
			yearsexpertise:"",
			locationCountry:"",
			locationState:"",
			locationCity:"",
			errors:{},
			showClickButton:false,

			role:"",
			facebookURL:"",
			twitterURL: "",
			instagramURL: "",
			linkedinURL: "",
			snapchatURL: "",
			websiteURL:"",

		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onDrop = this.onDrop.bind(this);
  		this.uploadImage = this.uploadImage.bind(this)
  		this.clearInput  = this.clearInput.bind(this)
	}

	componentWillMount(){
		const currentUser = cookie.load('user');
		var role = currentUser.role
		if(currentUser && currentUser!==null && currentUser!==undefined && currentUser!=""){
			var id=currentUser._id
			this.props.fetchMyProfile(id).then(
					(response)=>{
						this.setState({"profileImage":response.data.user.profileImage, role:response.data.user.role})
						this.setState({"firstName":response.data.user.profile.firstName,"lastName":response.data.user.profile.lastName, email:response.data.user.email})
						this.setState({"userBio":response.data.user.userBio,expertRates:response.data.user.expertRates, expertCategories:response.data.user.expertCategories})
						this.setState({"expertContact": response.data.user.contact, "expertRating":response.data.user.expertRating, expertFocusExpertise:response.data.user.expertFocusExpertise})
						this.setState({"yearsexpertise":response.data.user.yearsexpertise, password:response.data.user.password})
						this.setState({"locationCountry":response.data.user.locationCountry, locationState:response.data.user.locationState, locationCity:response.data.user.locationCity})
						this.setState({facebookURL:response.data.user.facebookURL})
						this.setState({twitterURL:response.data.user.twitterURL})
						this.setState({instagramURL:response.data.user.instagramURL})
						this.setState({linkedinURL:response.data.user.linkedinURL})
						this.setState({snapchatURL:response.data.user.snapchatURL})
						this.setState({websiteURL:response.data.user.websiteURL})

					},
					(err)=>{
						this.setState({ errorMessage:"Sorry Couldn't get Information"})
					}
				);
		}
	}
	handleSubmit(e){
		e.preventDefault();
		let errors={}
			if(this.state.firstName==="" || this.state.firstName==undefined || this.state.firstName.trim()==="" ) errors.firstName="First Name cant be empty"
			if(this.state.lastName==="" || this.state.lastName==undefined || this.state.lastName.trim()==="" ) errors.lastName="Last Name cant be empty"
			if(this.state.email===""|| this.state.email==undefined ) errors.this.state.firstName="Email cant be empty"
			if(this.state.password==="" || this.state.password==undefined ||this.state.password.trim()==="" ) errors.password="Password cant be empty"
			if(this.state.userBio==="" || this.state.userBio==undefined ||this.state.userBio.trim()==="") errors.userBio="User Bio cant be empty"
			if(this.state.role=="Expert" && (this.state.expertRates===""|| this.state.expertRates==undefined) ) errors.expertRates="Expert Rates cant be empty"
			if(this.state.role=="Expert" && (this.state.expertCategories==="" || this.state.expertCategories==undefined )) errors.expertCategories="Categories cant be empty"
			if(this.state.expertContact==="" || this.state.expertContact==undefined ) errors.expertContact="Contact cant be empty"
			if(this.state.role=="Expert" && (this.state.expertRating==="" || this.state.expertRating==undefined) ) errors.expertRating="Ratings cant be empty"
			if(this.state.role=="Expert" && (this.state.expertFocusExpertise==="" || this.state.expertFocusExpertise==undefined || this.state.expertFocusExpertise.trim()==="")) errors.expertFocusExpertise="Focus Expertise cant be empty"
			if(this.state.role=="Expert"&& (this.state.yearsexpertise===""|| this.state.yearsexpertise==undefined || this.state.yearsexpertise.trim()==="")) errors.yearsexpertise="Experience cant be empty"


			if(this.state.locationCountry==="" || this.state.locationCountry==undefined || this.state.locationCountry.trim()==="" ) errors.locationCountry="Country Name cant be empty"
			if(this.state.locationState==="" || this.state.locationState==undefined || this.state.locationState.trim()==="" ) errors.locationState="State Name cant be empty"
			if(this.state.locationCity==="" || this.state.locationCity==undefined || this.state.locationCity.trim()==="" ) errors.locationCity="City Name cant be empty"
			if(this.state.role=="Expert" && this.state.facebookURL===undefined || (this.state.facebookURL!=="" && (this.state.facebookURL).includes("facebook.com")==false)) errors.facebookURL="It needs to be a Facebook Link"
			if(this.state.role=="Expert" && this.state.twitterURL===undefined || (this.state.twitterURL!=="" && (this.state.twitterURL).includes("twitter")==false)) errors.twitterURL="It needs to be a Twitter Link"
			if(this.state.role=="Expert" && this.state.instagramURL===undefined || (this.state.instagramURL!=="" && (this.state.instagramURL).includes("instagram")==false)) errors.instagramURL="It needs to be a Instagram Link"
			if(this.state.role=="Expert" && this.state.linkedinURL===undefined || (this.state.linkedinURL!=="" && (this.state.linkedinURL).includes("linkedin")==false)) errors.linkedinURL="It needs to be a Linkedin Link"
			if(this.state.role=="Expert" && this.state.snapchatURL===undefined || (this.state.snapchatURL!=="" && (this.state.snapchatURL).includes("snapchat")==false)) errors.snapchatURL="It needs to be a Snapchat Link"
			// if(this.state.websiteURL===undefined ) errors.websiteURL="It needs to be a Website Link"

		this.setState({ errors })
		console.log(errors)

		const isValid = Object.keys(errors).length===0
		if(isValid)
		{

			const {email,firstName,lastName,password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity, facebookURL,twitterURL,instagramURL,linkedinURL,snapchatURL,websiteURL } = this.state

			this.props.UpdateMyProfile({email,firstName,lastName, password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity, facebookURL,twitterURL,instagramURL,linkedinURL,snapchatURL,websiteURL}).then(
					(response)=>{
						this.setState({successmessage:"Your profile successfully updated"})
						$("html, body").animate({ scrollTop: $('#main').offset().top-5 }, 1000);
					},
					(err)=>{
						console.log("Failure")
					}
				)
		}
	}

	handleChange = (e)=>{
		if(!!this.state.errors[e.target.name]){
			let errors = Object.assign({}, this.state.errors)

			delete errors[e.target.name]
			this.setState({
				[e.target.name] : e.target.value,
				errors
			});
		}else{
			this.setState({[e.target.name]: e.target.value})
		}
	}

    onDrop(acceptedFiles) {
      // console.log(acceptedFiles)
      this.setState({
        RelatedImages1: acceptedFiles,
        showClickButton:true
      });
    }

    uploadImage(){
          const {email, RelatedImages1} = this.state

          var formData = new FormData();
          var data = this.state;
          Object.keys(data).forEach(( key ) => {
            if(key === 'RelatedImages1'){
              // console.log("Related "+key +"and the data   "+ JSON.stringify(data[key][0]))
              formData.append(key, data[key][0]);
            }else{
              if(key ==='email' ){
                // console.log("THE ACTUAL KEy"+key)
                formData.append("expertEmail", data[ key ]);
              }

            }
          });

           return fetch(`${API_URL}/user/update/profile`, {
            method: 'POST',
            body: formData,
          }).then(
            (response)=>{
                var j = response.json()
                return j
            },
            (err)=>{
              console.log("ERR")
            }
          ).then(
            (res)=>{
              if(res && res!=null && res!=undefined && res.SuccessMessage && res.SuccessMessage!=null && res.SuccessMessage!=undefined && res.SuccessMessage!=""){
                this.setState({successMessage:"Successfully Uploaded Profile Image", RelatedImages1:"", showClickButton:false})
				const currentUser = cookie.load('user');
				if(currentUser && currentUser!==null && currentUser!==undefined && currentUser!=""){
					var id=currentUser._id
					this.props.fetchMyProfile(id).then(
							(response)=>{
								// this.setState({"firstName":response.data.user.profile.firstName,"lastName":response.data.user.profile.lastName, email:response.data.user.email})
								// this.setState({"userBio":response.data.user.userBio,expertRates:response.data.user.expertRates, expertCategories:response.data.user.expertCategories})
								// this.setState({"expertContact": response.data.user.contact, "expertRating":response.data.user.expertRating, expertFocusExpertise:response.data.user.expertFocusExpertise})
								// this.setState({"yearsexpertise":response.data.user.yearsexpertise, password:response.data.user.password})
								// this.setState({"locationCountry":response.data.user.locationCountry, locationState:response.data.user.locationState, locationCity:response.data.user.locationCity})
								this.setState({"profileImage":response.data.user.profileImage})
							},
							(err)=>{
								this.setState({ errorMessage:"Sorry Couldn't get Information"})
							}
						);

				}
              }
              else if(res && res!=null && res!=undefined && res.errorMessage){
                this.setState({errorMessage:res.errorMessage})

              }
            }
          )
          // this.props.uploadImage({email:this.state.expertEmail, RelatedImages1:this.state.RelatedImages1})
    }


	breadcrumb(){
	    return(
	      <ol className="breadcrumb">
	        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
	        <li className="breadcrumb-item">Update MyProfile</li>
	      </ol>
	    );
  	}
  adminMenu() {
    return (
      <SidebarMenuAdmin/>
    );
  }

  expertMenu() {
    return (
      <SidebarMenuExpert/>
    );
  }

  userMenu() {
    return (
      <SidebarMenuUser/>
    );
  }
    isRole(roleToCheck, toRender) {
    const userRole = cookie.load('user').role;
    if (userRole == roleToCheck) {
      return toRender;
    }
    return false;
  }

  clearInput(e){
  	e.preventDefault()
  	this.setState({profileImage:"",
					firstName:"",
					lastName:"",
					userBio:"",
					expertContact:"",
					yearsexpertise:"",
					locationCountry:"",
					facebookURL:"",
					twitterURL:"",
					instagramURL:"",
					linkedinURL:"",
					snapchatURL:"",
					websiteURL:"",
					clearInput:"",
					errors:{},
	})
  }
	render(){
		return(
				<div>
		      <div className="session-page">
		        <div className="container">
		          <div className="row">
		            {this.breadcrumb()}
		            <div className="wrapper-sidebar-page">
		              <div className="row row-offcanvas row-offcanvas-left">
		              {this.isRole('Admin', this.adminMenu())}
	                  {this.isRole('Expert', this.expertMenu())}
	                  {this.isRole('User', this.userMenu())}
		                  <div className="column col-sm-9 col-xs-11" id="main">
		                  <div id="pageTitle">
		                    {this.state.successmessage && this.state.successmessage!==null && this.state.successmessage!==undefined && this.state.successmessage!="" && <div className="alert alert-success">{this.state.successmessage}  </div>}
		                  </div>

		                  <form id="create_expert" onSubmit={this.handleSubmit}>
											<div dangerouslySetInnerHTML={{__html: this.state.responseMsg}} />
											<div className="row">
												<div className="col-md-3 form-group">
		                  	{this.state.profileImage && this.state.profileImage!=null && this.state.profileImage!=""?<div><img height="120" width="160" src={`${Image_URL}`+this.state.profileImage} /></div>:""}
		                  	{this.state.profileImage==null || this.state.profileImage==undefined || this.state.profileImage==""?<div><img height="120" width="160" src="/src/public/img/profile.png" /></div>:""}
		                    <br/>
				                    {this.state.RelatedImages1.length > 0 ?
		                                  <div className="img_preview_main">
		                                    {this.state.RelatedImages1.map((file,id) => <div className='img_preview' key={id}>
		                                    <img src={file.preview} alt="Preview Not Available" width={160} height={90}/>
		                                    {/*<div>{file.name + ' : ' + file.size + ' bytes.'}</div>*/}
		                                    </div> )}
		                                  </div> : null}
		                                  <Dropzone className="upload_footer icon" accept="image/*" ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
		                                    <i className="fa fa-camera"></i>
		                                      {/*<div>Try dropping some files here, or click to select files to upload.</div>*/}
		                                  </Dropzone>

		                             {this.state.showClickButton==true && <div className="upload_footer Upload-button">
			                              <button onClick={this.uploadImage} className="btn Btn_common" style={{'padding-top': 15+"px", 'padding-bottom': 15+"px"}}><i className="fa fa-paper-plane-o" aria-hidden="true"></i> Update Photo</button>
		                              </div>}
													</div>
												</div>

		                    <div className="row">
		                      <div  className={classnames('col-md-6 form-group', {"has-error":!!this.state.errors.semail})}>
		                        <label>First Name</label>
		                        <input name="firstName" className="form-control" value={this.state.firstName} onChange={this.handleChange} type="text" />
		                        <span className="error">{this.state.errors.firstName} </span>
		                      </div>
		                      <div className={classnames('col-md-6 form-group', {"has-error":!!this.state.errors.semail})}>
		                        <label>Last Name</label>
		                        <input name="lastName" className="form-control" value={this.state.lastName} onChange={this.handleChange} type="text" />
		                        <span className="error">{this.state.errors.lastName} </span>
		                      </div>
		                    </div>
		                    <div className="row form-group">
		                      <div className="col-md-12">
		                        <label>Email</label>
		                        <input name="email" readOnly className="form-control" value={this.state.email} type="email" />
		                      </div>
		                    </div>
{/*		                    <div className="row form-group">
		                      <div className="col-md-12">
		                        <label>Password</label>
		                        <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} type="text" />
		                      	<span className="error">{this.state.errors.password} </span>
		                      </div>
		                    </div>*/}
		                    <div className="row form-group">
		                      <div className="col-md-12">
		                        <label>Bio</label>
		                        {/*<input name="userBio" className="form-control" rows="3" value={this.state.userBio} onChange={this.handleChange} type="text" />*/}
		                         <textarea name="userBio" className="form-control" rows="5" value={this.state.userBio} onChange={this.handleChange} type="text"></textarea>
		                        <span className="error">{this.state.errors.userBio} </span>
		                      </div>
		                    </div>
		                    <div className="row form-group">
		                      <div className="col-md-4 form-group">
		                        <label>Country</label>
		                        <input name="locationCountry" className="form-control" value={this.state.locationCountry} onChange={this.handleChange} type="text" min="1" max="10"/>
		                      	<span className="error">{this.state.errors.locationCountry} </span>
		                      </div>
	                      	  <div className="col-md-4 form-group">
		                        <label>State</label>
		                        <input name="locationState" className="form-control" value={this.state.locationState} onChange={this.handleChange} type="text" min="1" max="10"/>
		                      	<span className="error">{this.state.errors.locationState} </span>
		                      </div>
	                     	  <div className="col-md-4 form-group">
		                        <label>City</label>
		                        <input name="locationCity" className="form-control" value={this.state.locationCity} onChange={this.handleChange} type="text" min="1" max="10"/>
		                      	<span className="error">{this.state.errors.locationCity} </span>
		                      </div>
		                    </div>
		                    {this.state.role && this.state.role=="Expert" &&
			                    <div className="row form-group">
			                      <div className="col-md-4 form-group">
			                        <label>Hourly Rate</label>
			                        <input name="expertRates" className="form-control" value={this.state.expertRates} onChange={this.handleChange} type="number" min="1" max="10"/>
			                      	<span className="error">{this.state.errors.expertRates} </span>
			                      </div>

			                      <div className="col-md-4 form-group">
			                        <label>Categories</label>
			                        {/*<input name="expertCategories" className="form-control" value={this.state.expertCategories} type="select" />*/}
							    <select name="expertCategories" className="form-control" value={this.state.expertCategories} onChange={this.handleChange}>
							      <option  value="">Select</option>
							     <option   value="accounting">Accounting</option>
							      <option  value="accounting-finance">Accounting-finance</option>
							      <option  value="blogging">Blogging</option>
							      <option  value="graphic-design">Graphic-design</option>
							      <option  value="bass">bass</option>

							    </select>
							    <span className="error">{this.state.errors.expertCategories} </span>
			                      </div>
			                      <div className="col-md-4 form-group">
			                        <label>Contact Number</label>
			                        <input name="expertContact" className="form-control" value={this.state.expertContact} onChange={this.handleChange} type="number"/>
			                      	<span className="error">{this.state.errors.expertContact} </span>
			                      </div>
			                    </div>
			                }
			                {this.state.role && (this.state.role=="Admin" || this.state.role=="User") &&
			                	<div className="row form-group">
			                      <div className="col-md-4 form-group">
			                        <label>Contact Number</label>
			                        <input name="expertContact" className="form-control" value={this.state.expertContact} onChange={this.handleChange} type="number"/>
			                      	<span className="error">{this.state.errors.expertContact} </span>
			                      </div>
			                	</div>
			                }
							{this.state.role && this.state.role=="Expert" &&
			                    <div className="row form-group">
			                      {/*<div className="col-md-4 form-group">
			                        <label>Rating</label>
			                        <input readOnly name="expertRating" className="form-control" value={this.state.expertRating} onChange={this.handleChange} type="number" min="1" max="10"/>
			                      	<span className="error">{this.state.errors.expertRating} </span>
			                      </div>
			                  */}
			                      <div className="col-md-4 form-group">
			                        <label>Focus of Expertise</label>
			                        <input name="expertFocusExpertise" className="form-control" value={this.state.expertFocusExpertise} onChange={this.handleChange} type="text"/>
			                      	<span className="error">{this.state.errors.expertFocusExpertise} </span>
			                      </div>
			                      <div className="col-md-4 form-group">
			                        <label>Years of Expertise</label>
			                        <input name="yearsexpertise" className="form-control" value={this.state.yearsexpertise} onChange={this.handleChange} type="select" />
			                      	<span className="error">{this.state.errors.yearsexpertise} </span>
			                      </div>

			                    </div>
		            		}
						{this.state.role=="Expert" &&
							<div className="row form-group">


			                      <div className="col-md-4 form-group">
			                        <label>FaceBook Link</label>
			                        <input name="facebookURL" className="form-control" value={this.state.facebookURL} onChange={this.handleChange} type="text" />
			                      	{<span className="error">{this.state.errors.facebookURL} </span>}
			                      </div>

			                      <div className="col-md-4 form-group">
			                        <label>Twitter Link</label>
			                        <input name="twitterURL" className="form-control" value={this.state.twitterURL} onChange={this.handleChange} type="text" />
			                      	{<span className="error">{this.state.errors.twitterURL} </span>}
			                      </div>

			                      <div className="col-md-4 form-group">
			                        <label>Instagram Link</label>
			                        <input name="instagramURL" className="form-control" value={this.state.instagramURL} onChange={this.handleChange} type="text" />
			                      	{<span className="error">{this.state.errors.instagramURL} </span>}
			                      </div>

		                    </div>
		                }

		                    {this.state.role=="Expert" && <div className="row form-group">


		                    			                      <div className="col-md-4 form-group">
		                    			                        <label>LinkedIn Link</label>
		                    			                        <input name="linkedinURL" className="form-control" value={this.state.linkedinURL} onChange={this.handleChange} type="text" />
		                    			                      	{<span className="error">{this.state.errors.linkedinURL} </span>}
		                    			                      </div>

		                    			                      <div className="col-md-4 form-group">
		                    			                        <label>Snapchat Link</label>
		                    			                        <input name="snapchatURL" className="form-control" value={this.state.snapchatURL} onChange={this.handleChange} type="text" />
		                    			                      	{<span className="error">{this.state.errors.snapchatURL} </span>}
		                    			                      </div>

		                    			                      <div className="col-md-4 form-group">
		                    			                        <label>Website Link</label>
		                    			                        <input name="websiteURL" className="form-control" value={this.state.websiteURL} onChange={this.handleChange} type="text" />
		                    			                      	{<span className="error">{this.state.errors.websiteURL} </span>}
		                    			                      </div>


		                    		                    </div>
		                    }


		                    <div className="row form-group">
		                      <div className="col-md-12">
		                        <button type="submit" className="btn btn-primary">Submit</button>
		                        &nbsp;<button className="btn btn-default" onClick = {this.clearInput}>Reset</button>
		                      </div>
		                    </div>
		                  </form>


		                 </div>
		              </div>
		            </div>
		          </div>
		        </div>
		      </div>
			</div>

			)

	}
}
// function mapStateToProps(state) {
//   return { content: state.auth.content };
// }

export default connect(null, {fetchMyProfile, UpdateMyProfile})(UserProfileUpdation);
