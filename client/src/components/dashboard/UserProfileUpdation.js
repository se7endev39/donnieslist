// UserProfileUpdation
import React, { Component } from 'react';
import { connect} from 'react-redux';
import { Link, IndexLink ,browserHistory} from 'react-router';
import cookie from 'react-cookie';
import { protectedTest } from '../../actions/auth';
import { fetchMyProfile,API_URL, Image_URL } from '../../actions/index';
import {UpdateMyProfile} from '../../actions/user'
import { Modal, Button} from 'react-bootstrap';

import SidebarMenuAdmin from './sidebar-admin';
import SidebarMenuExpert from './sidebar-expert';
import SidebarMenuUser from './sidebar-user';
import {logoutUser} from '../../actions/auth';

import classnames from 'classnames'
var Dropzone = require('react-dropzone');
const currentUser = cookie.load('user');
import axios from 'axios'

class UserProfileUpdation extends Component {

	constructor(props){
		super(props)
		this.state={
			successmessage:"",
			errorMessage:'',
			firstName:"",
			lastName:"",
			categories:[],
			musicCategories:[],
			profileImage:"",
 	    RelatedImages1:[],

			email:"",
			password:"",
			userBio:"",
			expertRates:"",
			expertContactCC:'',
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
			university:'',
			resume:'',
			role:"",
			facebookURL:"",
			googleURL:"",
			twitterURL: "",
			instagramURL: "",
			linkedinURL: "",
			snapchatURL: "",
			websiteURL:"",
			show:false,
			social_link:'',
			soc_link:false,
			link_soc:'',
			uploadResume:false,
			update_resume:'',
			Image_other_UrlContain:false,
			soundcloudURL:'',
			isMusician:false,
			youtubeURL:'',
			confirm_password:'',
			passwordMatcherror:false

		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.uploadImage = this.uploadImage.bind(this)
		this.clearInput  = this.clearInput.bind(this)
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.submitLink=this.submitLink.bind(this);
		this.upload_resume= this.upload_resume.bind(this);
	}

	componentWillMount(){
		const currentUser = cookie.load('user');
		var role = currentUser.role
		axios.get(`${API_URL}/getExpertsCategoryList`)
			.then(res => {
				this.setState({categories:res.data});
				res.data.map(key=>{
						if(key.name==='Music Lessons'){
							this.setState({musicCategories:key})
						}
				})

			})
		if(currentUser && currentUser!==null && currentUser!==undefined && currentUser!=""){
			var id=currentUser._id

			this.props.fetchMyProfile(id).then(
					(response)=>{
						if(response.data.user.role=='Expert'){
							this.state.categories.map(key=>{
								if(key.name==='Music Lessons'){
									key.subcategory.map(newKey=>{
								console.log(newKey)
									let name=newKey.name;
									 if(response.data.user.expertCategories[0].match(new RegExp(name,"i"))){
										 this.setState({isMusician:true})
									 }
									})
								}
						})
						}

						const pattern = new RegExp('^(https?:\/\/)?'+
								'((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+
								'((\d{1,3}\.){3}\d{1,3}))');

								if(pattern.test(response.data.user.profileImage)) {
									this.setState({Image_other_UrlContain:true})
								 }

						this.setState({"profileImage":response.data.user.profileImage, role:response.data.user.role})
						this.setState({"firstName":response.data.user.profile.firstName,"lastName":response.data.user.profile.lastName, email:response.data.user.email})
						this.setState({"userBio":response.data.user.userBio,expertRates:response.data.user.expertRates, expertCategories:response.data.user.expertCategories[0]})
						this.setState({"expertContact": response.data.user.contact, "expertRating":response.data.user.expertRating, expertFocusExpertise:response.data.user.expertFocusExpertise})
						this.setState({"yearsexpertise":response.data.user.yearsexpertise, password:response.data.user.password})
						this.setState({"locationCountry":response.data.user.locationCountry, locationState:response.data.user.locationState, locationCity:response.data.user.locationCity})
						this.setState({facebookURL:response.data.user.facebookURL})
						this.setState({soundcloudURL:response.data.user.soundcloudURL?response.data.user.soundcloudURL:''})
						this.setState({password:response.data.user.password})
						this.setState({twitterURL:response.data.user.twitterURL})
						this.setState({googleURL:response.data.user.googleURL})
						this.setState({instagramURL:response.data.user.instagramURL})
						this.setState({linkedinURL:response.data.user.linkedinURL})
						this.setState({snapchatURL:response.data.user.snapchatURL})
						this.setState({websiteURL:response.data.user.websiteURL})
						this.setState({university:response.data.user.university})
						this.setState({resume:response.data.user.resume_path})
						this.setState({expertContactCC:response.data.user.expertContactCC})
						this.setState({contact:response.data.user.contact})
						this.setState({youtubeURL:response.data.user.youtubeURL})

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
			//if(this.state.role=="Expert" && (this.state.expertRates===""|| this.state.expertRates==undefined) ) errors.expertRates="Expert Rates cant be empty"
			if(this.state.role=="Expert" && (this.state.expertCategories==="" || this.state.expertCategories==undefined )) errors.expertCategories="Categories cant be empty"
			if(this.state.role=="Expert" && (this.state.resume==="" || this.state.resume==undefined )) errors.resume="Resume cant be empty"

			if(this.state.expertContact==="" || this.state.expertContact==undefined ) errors.expertContact="Contact cant be empty"
			{/*if(this.state.role=="Expert" && (this.state.expertRating==="" || this.state.expertRating==undefined) ) errors.expertRating="Ratings cant be empty"*/}
			if(this.state.role=="Expert" && (this.state.expertFocusExpertise==="" || this.state.expertFocusExpertise==undefined || this.state.expertFocusExpertise.trim()==="")) errors.expertFocusExpertise="Focus Expertise cant be empty"
			if(this.state.role=="Expert"&& (this.state.yearsexpertise===""|| this.state.yearsexpertise==undefined || this.state.yearsexpertise.trim()==="")) errors.yearsexpertise="Experience cant be empty"

			if(!this.state.role=="Expert"){
				if(this.state.userBio==="" || this.state.userBio==undefined ||this.state.userBio.trim()==="") errors.userBio="User Bio cant be empty"
				if(this.state.locationCountry==="" || this.state.locationCountry==undefined || this.state.locationCountry.trim()==="" ) errors.locationCountry="Country Name cant be empty"
				if(this.state.locationState==="" || this.state.locationState==undefined || this.state.locationState.trim()==="" ) errors.locationState="State Name cant be empty"
				if(this.state.role=="Expert" && this.state.locationCity==="" || this.state.locationCity==undefined || this.state.locationCity.trim()==="" ) errors.locationCity="City Name cant be empty"
			}

			// if(this.state.role=="Expert" && this.state.facebookURL===undefined || (this.state.facebookURL!=="" && (this.state.facebookURL).includes("facebook.com")==false)) errors.facebookURL="It needs to be a Facebook Link"
			// if(this.state.role=="Expert" && this.state.twitterURL===undefined || (this.state.twitterURL!=="" && (this.state.twitterURL).includes("twitter")==false)) errors.twitterURL="It needs to be a Twitter Link"
			// if(this.state.role=="Expert" && this.state.instagramURL===undefined || (this.state.instagramURL!=="" && (this.state.instagramURL).includes("instagram")==false)) errors.instagramURL="It needs to be a Instagram Link"
			// if(this.state.role=="Expert" && this.state.linkedinURL===undefined || (this.state.linkedinURL!=="" && (this.state.linkedinURL).includes("linkedin")==false)) errors.linkedinURL="It needs to be a Linkedin Link"
			// if(this.state.role=="Expert" && this.state.snapchatURL===undefined || (this.state.snapchatURL!=="" && (this.state.snapchatURL).includes("snapchat")==false)) errors.snapchatURL="It needs to be a Snapchat Link"
			// if(this.state.role=="Expert" && this.state.googleURL===undefined || (this.state.googleURL!=="" && (this.state.googleURL).includes("google")==false)) errors.googleURL="It needs to be a google Link"
				// if(this.state.websiteURL===undefined ) errors.websiteURL="It needs to be a Website Link"
				if(this.state.password.length>0 && this.state.confirm_password.length>0){
					if(this.state.password != this.state.confirm_password) errors.confirm_password="Password not match"
				}
		this.setState({ errors })

		const isValid = Object.keys(errors).length===0
		if(isValid){

			if(this.state.isMusician){
			const	{email,university,firstName,lastName,password,confirm_password,userBio,isMusician,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity, facebookURL,twitterURL,instagramURL,soundcloudURL,youtubeURL,linkedinURL,snapchatURL,websiteURL,googleURL } = this.state

				this.props.UpdateMyProfile({email,university,firstName,lastName,isMusician, password,confirm_password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity, facebookURL,twitterURL,instagramURL,soundcloudURL,youtubeURL,linkedinURL,snapchatURL,websiteURL,googleURL})
				.then((response)=>{
				if(response.success){
					this.setState({successmessage:"Your profile successfully updated"})
					$("html, body").animate({ scrollTop: $('#main').offset().top-5 }, 1000);
					if(response.passchange){
						setTimeout(function(){
					         browserHistory.push('/logout');
					 },1500);
					}
				}

				if(!response.success){
					this.setState({errorMessage:"Something went wrong!"})
					$("html, body").animate({ scrollTop: $('#main').offset().top-5 }, 1000);
				}
				},(err)=>{
							console.log("Failure")
						}
					)
			}else{
				const	{email,university,firstName,lastName,password,confirm_password,userBio,isMusician,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity, facebookURL,twitterURL,linkedinURL,snapchatURL,websiteURL,googleURL } = this.state
					this.props.UpdateMyProfile({email,university,firstName,lastName,isMusician, password,confirm_password,userBio,expertRates,expertCategories,expertContact,expertRating,expertFocusExpertise,yearsexpertise,locationCountry,locationState,locationCity, facebookURL,twitterURL,linkedinURL,snapchatURL,websiteURL,googleURL})
					.then((response)=>{
					if(response.success){
						this.setState({successmessage:"Your profile successfully updated"})
						$("html, body").animate({ scrollTop: $('#main').offset().top-5 }, 1000);
						if(response.passchange){
							setTimeout(function(){
						         browserHistory.push('/logout');
						 },1500);
						}
					}

					if(!response.success){
						this.setState({errorMessage:"Something went wrong!"})
						$("html, body").animate({ scrollTop: $('#main').offset().top-5 }, 1000);
					}
					},(err)=>{
								console.log("Failure")
							}
						)
			}
		}
	}


	keyPress=(e)=>{
		 if(e.keyCode == 8){
			this.setState({
				password:''
			})
		 }
	}

	handleChange = (e)=>{

		if(e.target.name=='expertCategories'){
			for (var i = 0; i <   this.state.musicCategories.subcategory.length; i++) {
					 if(e.target.value.match(new RegExp(this.state.musicCategories.subcategory[i].name,"i"))){
						 this.setState({isMusician:true});
						 break;
					 }else{
						 this.setState({isMusician:false})
					 }
				}
		}

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
			console.log(acceptedFiles)
      this.setState({
        RelatedImages1: acceptedFiles,
        showClickButton:true
      });
    }

		upload_resume(){
			  const {email} = this.state
			  var formData = new FormData();
				formData.append('expertEmail',this.state.email);
				formData.append('resume',this.state.update_resume[0],this.state.update_resume[0].name);
				return axios({
					    method: 'POST',
					    url: `${API_URL}/user/update/resume`,
					    data: formData,
						  headers: {'Content-Type': 'multipart/form-data' }
					}).then((response) => {
						if(response.data.success){
								this.setState({successMessage:"Successfully Uploaded Resume"});
							  location.reload();
						}
						if(!response.data.success){
							this.setState({ errorMessage:"Something went wrong"})

						}
				})

		}

		onChange = (e) => {

			const state = this.state;
	 switch (e.target.name) {
		case 'resume':
			this.setState({update_resume: e.target.files})
			this.setState({uploadResume:true})
	  }
	}

    uploadImage(){

          const {email, RelatedImages1} = this.state
          var formData = new FormData();
          var data = this.state;

          Object.keys(data).forEach(( key ) => {
            if(key === 'RelatedImages1'){
            }else{
              if(key ==='email' ){
                formData.append("expertEmail", data[ key ]);
              }

            }
          });
					formData.append('profileImage',RelatedImages1[0],RelatedImages1[0].name);

				return axios({
						    method: 'POST',
						    url: `${API_URL}/user/update/profile`,
						    data: formData,
							  headers: {'Content-Type': 'multipart/form-data' }
						})
		      .then((response) => {
						if(response.data.success){
								this.setState({successMessage:"Successfully Uploaded Profile Image"});
							  location.reload();
						}
						if(!response.data.success){
							this.setState({ errorMessage:"Something went wrong"})

						}
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

        //    return fetch(`${API_URL}/user/update/profile`, {
        //     method: 'POST',
        //     body: formData,
        //   }).then(
        //     (response)=>{
        //         var j = response.json()
        //         return j
        //     },
        //     (err)=>{
        //       console.log("ERR")
        //     }
        //   ).then(
        //     (res)=>{
        //       if(res && res!=null && res!=undefined && res.SuccessMessage && res.SuccessMessage!=null && res.SuccessMessage!=undefined && res.SuccessMessage!=""){
        //         this.setState({successMessage:"Successfully Uploaded Profile Image", RelatedImages1:"", showClickButton:false})
				// const currentUser = cookie.load('user');
				// if(currentUser && currentUser!==null && currentUser!==undefined && currentUser!=""){
				// 	var id=currentUser._id
				// 	this.props.fetchMyProfile(id).then(
				// 			(response)=>{
				// 				// this.setState({"firstName":response.data.user.profile.firstName,"lastName":response.data.user.profile.lastName, email:response.data.user.email})
				// 				// this.setState({"userBio":response.data.user.userBio,expertRates:response.data.user.expertRates, expertCategories:response.data.user.expertCategories})
				// 				// this.setState({"expertContact": response.data.user.contact, "expertRating":response.data.user.expertRating, expertFocusExpertise:response.data.user.expertFocusExpertise})
				// 				// this.setState({"yearsexpertise":response.data.user.yearsexpertise, password:response.data.user.password})
				// 				// this.setState({"locationCountry":response.data.user.locationCountry, locationState:response.data.user.locationState, locationCity:response.data.user.locationCity})
				// 				this.setState({"profileImage":response.data.user.profileImage})
				// 			},
				// 			(err)=>{
				// 				this.setState({ errorMessage:"Sorry Couldn't get Information"})
				// 			}
				// 		);
				//
				// }
        //       }
        //       else if(res && res!=null && res!=undefined && res.errorMessage){
        //         this.setState({errorMessage:res.errorMessage})
				//
        //       }
        //     }
        //   )
          // this.props.uploadImage({email:this.state.expertEmail, RelatedImages1:this.state.RelatedImages1})
    }

		submitLink(){
	    this.handleClose();

	  }

	  handleClose() { this.setState({ show: false }); }
	  handleShow() { this.setState({ show: true }); }

	  social_modal=(link)=>{
	    switch (link) {
	      case 'facebook':
	      this.setState({social_link:'Facebook'})
				this.setState({facebookURL:this.state.facebookURL})
	        this.handleShow();
	        break;
	      case 'twitter':
	        this.setState({social_link:'Twitter'})
					this.setState({twitterURL:this.state.twitterURL})
	        this.handleShow();
	        break;
	      case 'google':
	        this.setState({social_link:'Google'})
					this.setState({googleURL:this.state.googleURL})
	        this.handleShow();
	        break;
	      case 'linkdin':
	        this.setState({social_link:'Linkdin'})
					this.setState({linkedinURL:this.state.linkedinURL})
	        this.handleShow();
	        break;
				case 'soundcloud':
				 this.setState({social_link:'Soundcloud'})
				 this.setState({soundcloudURL:this.state.soundcloudURL})
				 this.handleShow();
				 break;

				 case 'instagram':
 				 this.setState({social_link:'Instagram'})
 				 this.setState({instagramURL:this.state.instagramURL})
 				 this.handleShow();
 				 break;

				 case 'youtube':
 				 this.setState({social_link:'Youtube'})
 				 this.setState({youtubeURL:this.state.youtubeURL})
 				 this.handleShow();
 				 break;

	    }
	  }

	  setSocialLink=(e)=>{

	    switch (this.state.social_link) {
	      case 'Facebook':
	      this.setState({facebookURL:e.target.value})
	        break;
	      case 'Twitter':
	        this.setState({twitterURL:e.target.value})
	        break;
	      case 'Google':
	        this.setState({googleURL:e.target.value})
	        break;
	      case 'Linkdin':
	        this.setState({linkedinURL:e.target.value})
	        break;

				case 'Soundcloud':
				 this.setState({soundcloudURL:e.target.value})
				 break;

				 case 'Instagram':
 				 this.setState({instagramURL:e.target.value})
 				 break;

				 case 'Youtube':
				 this.setState({youtubeURL:e.target.value})
				 break;

	     }
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
					password:"",
					userBio:"",
					expertContact:"",
					expertCategories:"",
					yearsexpertise:"",
					locationCountry:"",
					university:'',
					resume:'',
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
												 {this.state.errorMessage && this.state.errorMessage!==null && this.state.errorMessage!==undefined && this.state.errorMessage!="" && <div className="alert alert-danger">{this.state.errorMessage}  </div>}
		                  </div>


											<div className="row">
												<div className="col-md-3 form-group">
		                  	{this.state.Image_other_UrlContain && this.state.profileImage && this.state.profileImage!=null && this.state.profileImage!=""?<div><img height="120" width="160" src={this.state.profileImage} /></div>:""}
												{!this.state.Image_other_UrlContain && this.state.profileImage && this.state.profileImage!=null && this.state.profileImage!=""?<div><img height="120" width="160" src={`${Image_URL}`+this.state.profileImage} /></div>:""}
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
													{
														this.state.role && this.state.role=="Expert" &&
														<div className="col-md-12">
															<label>Upload Resume</label>
														 <input name="resume"
															 className="form-control"
															 type="file"
															  id="resume"
															 onChange={(e) => this.onChange(e)}
															 />
														 {this.state.uploadResume&&
															 <button className="btn btn-default" onClick={this.upload_resume}>Update Resume</button>}
														 {!this.state.uploadResume && <span className="success">{this.state.resume.slice(9)} </span>}
															<a href={`${Image_URL}`+this.state.resume} title="Download" download className="fa fa-file-pdf-o"></a>
														<span className="error">{this.state.errors.resume} </span>
														</div>
													}
												</div>

		                  <form id="create_expert" onSubmit={this.handleSubmit}>
											<div dangerouslySetInnerHTML={{__html: this.state.responseMsg}} />
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
												<div className="row form-group">
		                      <div className="col-md-12">
		                        <label>Password</label>
		                        <input name="password"  className="form-control" onKeyDown={this.keyPress} onChange={this.handleChange} value={this.state.password} type="password" />
		                      </div>
		                    </div>
												<div className="row form-group">
												 <div className="col-md-12">
													 <label>Confirm Password</label>
													 <input  name="confirm_password" className="form-control" value={this.state.confirm_password} onChange={this.handleChange} type="password" />
												 </div>
												  <span className="error">{this.state.errors.confirm_password} </span>
											 </div>

												{
													this.state.role && this.state.role=="Expert" &&
		                    <div className="row form-group">

		                      <div className="col-md-4 form-group">
		                        <label>University</label>
		                       <input name="university" value={this.state.university} onChange={this.handleChange} className="form-control" type="text" />
		                        <span className="error">{this.state.errors.university} </span>
		                      </div>


		                      <div className="col-md-4 form-group">
		                        <label>Categories</label>
															<select name="expertCategories" className="form-control" onChange={this.handleChange}>
											          <option value=''>Select Categories</option>
																  {this.state.categories.map((cats,i)=>
																		<optgroup  key={i} label={cats.name}>
													            {
																				cats.subcategory.map((subcat,k)=>

																				  <option key={k} selected={this.state.expertCategories==subcat.name} value={subcat.name}>{subcat.name} </option>
																			)}
													          </optgroup>

																 )}
														  </select>
		                      </div>

	                      	  <div className="col-md-4 form-group">
			                        <label>Country Code</label>
			                        <input name="locationState" className="form-control" value={this.state.expertContactCC} onChange={this.handleChange} type="text" min="1" max="10"/>
			                      	<span className="error">{this.state.errors.locationState} </span>
		                       </div>

		                    </div>
											}


												{this.state.role && (this.state.role=="Admin" || this.state.role=="User") &&
		                    <div className="row form-group">
		                      <div className="col-md-12">
		                        <label>Bio</label>
		                        {/*<input name="userBio" className="form-control" rows="3" value={this.state.userBio} onChange={this.handleChange} type="text" />*/}
		                         <textarea name="userBio" className="form-control" rows="5" value={this.state.userBio} onChange={this.handleChange} type="text"></textarea>
		                        <span className="error">{this.state.errors.userBio} </span>
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
															 <label>Contact Number</label>
															 <input name="locationCity" className="form-control" value={this.state.expertContact} onChange={this.handleChange} type="text" min="1" max="10"/>
															 <span className="error">{this.state.errors.locationCity} </span>
													 </div>
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



		                    </div>
		                }

		                    {this.state.role=="Expert" && <div className="row ">
						                <a className="btn btn-social-icon btn-facebook" onClick={(e)=>this.social_modal('facebook')}><span className="fa fa-facebook"></span></a>
						                    <input name="facebook" type="hidden" value={this.state.facebookURL} />
						               <a className="btn btn-social-icon btn-linkedin" onClick={(e)=>this.social_modal('linkdin')}><span className="fa fa-linkedin"></span></a>
						                   <input name="linkdin" type="hidden" value={this.state.linkedinURL} />
						               <a className="btn btn-social-icon btn-google" onClick={(e)=>this.social_modal('google')}><span className="fa fa-google"></span></a>
						                   <input name="google" type="hidden" value={this.state.googleURL} />
						               <a className="btn btn-social-icon btn-twitter" onClick={(e)=>this.social_modal('twitter')}><span className="fa fa-twitter"></span></a>
						                  <input name="twitter" type="hidden" value={this.state.twitterURL} />

														{this.state.isMusician &&
															<div>
																<a className="btn btn-social-icon btn-soundcloud" onClick={(e)=>this.social_modal('soundcloud')}><span className="fa fa-soundcloud"></span></a>
																<input name="soundcloud" type="hidden" value={this.state.soundcloudURL} />
														 	<a className="btn btn-social-icon btn-soundcloud" onClick={(e)=>this.social_modal('instagram')}><span className="fa fa-instagram"></span></a>
																<input name="instagram" type="hidden" value={this.state.instagramURL} />
																	<a className="btn btn-social-icon btn-youtube" onClick={(e)=>this.social_modal('youtube')}><span className="fa fa-youtube"></span></a>
																		<input name="youtube" type="hidden" value={this.state.youtubeURL} />
															</div>
														}
						                {this.state.soc_link && <div className="error">This field is require.</div>}
						            </div>
											}




		                    <div className="row form-group">
		                      <div className="col-md-12">
		                        <button type="submit" className="btn btn-primary">Submit</button>
		                        &nbsp;<button className="btn btn-default" onClick = {this.clearInput}>Reset</button>
		                      </div>
		                    </div>
		                  </form>
											<Modal
												show={this.state.show}
												onHide={this.handleClose}
												dialogClassName="custom-modal text-center"
												bsSize="small">

													<Modal.Body>
															<h5>{this.state.social_link}</h5><p>Link</p>
															{
																this.state.social_link=='Facebook'&&
																<input className="form-control" type="text" value={this.state.facebookURL} onChange={this.setSocialLink.bind(this)}/>
														   }
															{
																this.state.social_link=='Google'&&
																<input className="form-control" type="text" value={this.state.googleURL} onChange={this.setSocialLink.bind(this)}/>
															}

															{
																this.state.social_link=='Twitter'&&
																<input className="form-control" type="text" value={this.state.twitterURL} onChange={this.setSocialLink.bind(this)}/>
															}

															{
																this.state.social_link=='Linkdin'&&
																	<input className="form-control" type="text" value={this.state.linkedinURL} onChange={this.setSocialLink.bind(this)}/>
															}

															{
															this.state.isMusician&&this.state.social_link=='Soundcloud'&&
																	<input className="form-control" type="text" value={this.state.soundcloudURL} onChange={this.setSocialLink.bind(this)}/>
															}

															{
															this.state.isMusician&&this.state.social_link=='Instagram'&&
																	<input className="form-control" type="text" value={this.state.instagramURL} onChange={this.setSocialLink.bind(this)}/>
															}

															{
															this.state.isMusician&&this.state.social_link=='Youtube'&&
																	<input className="form-control" type="text" value={this.state.youtubeURL} onChange={this.setSocialLink.bind(this)}/>
															}

													</Modal.Body>
													<Modal.Footer>
														<div className="pull-right">
															<Button className="btn btn-default"  onClick={this.handleClose}>Close</Button>
															<Button className="btn btn-primary" onClick={this.submitLink}>Submit</Button>
														</div>
													</Modal.Footer>

											</Modal>

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
//   return { logout: state.auth.logoutUser };
// }

export default connect(null, {fetchMyProfile, UpdateMyProfile,logoutUser})(UserProfileUpdation);
