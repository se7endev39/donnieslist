// UsersProfileView
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { protectedTest } from '../../../actions/auth';

import {getTheUserInformation, AdminUpdateExpert} from '../../../actions/admin'

import SidebarMenuAdmin from '../sidebar-admin';
import SidebarMenuExpert from '../sidebar-expert';
import SidebarMenuUser from '../sidebar-user';

import classnames from 'classnames'

import axios from 'axios'
import { API_URL,Image_URL } from '../../../actions/index';

class UsersProfileView extends Component {
	constructor(props){
		super(props)
		this.state={
			successmessage:"",
			errorMessage:'',

			categories:[],

			role:"",

			firstName:"",
			lastName:"",
			email:"",
			password:"",           //remove it
			userBio:"",
			profile:'',
			expertRates:"",
			expertCategories:"",
			profileImage:"",
			expertContact:"",
			expertContactCC:"",
			university:"",
			expertRating:"",
			expertFocusExpertise:"",
			yearsexpertise:"",
			errors:{},
			resume:'',
			update_resume:'',
			codes:[{"country":"Afghanistan","code":"+93"},{"country":"Albania","code":"+355"},{"country":"Algeria","code":"+213"},{"country":"American Samoa","code":"+1684"},{"country":"Andorra","code":"+376"},{"country":"Angola","code":"+244"},{"country":"Anguilla","code":"+1264"},{"country":"Antigua and Barbuda","code":"+1268"},{"country":"Argentina","code":"+54"},{"country":"Armenia","code":"+374"},{"country":"Aruba","code":"+297"},{"country":"Australia","code":"+61"},{"country":"Austria","code":"+43"},{"country":"Azerbaijan","code":"+994"},{"country":"Bahamas","code":"+1242"},{"country":"Bahrain","code":"+973"},{"country":"Bangladesh","code":"+880"},{"country":"Barbados","code":"+1246"},{"country":"Belarus","code":"+375"},{"country":"Belgium","code":"+32"},{"country":"Belize","code":"+501"},{"country":"Benin","code":"+229"},{"country":"Bermuda","code":"+1441"},{"country":"Bhutan","code":"+975"},{"country":"Bolivia","code":"+591"},{"country":"Bosnia and Herzegovina","code":"+387"},{"country":"Botswana","code":"+267"},{"country":"Brazil","code":"+55"},{"country":"British Indian Ocean Territory","code":"+246"},{"country":"British Virgin Islands","code":"+1284"},{"country":"Brunei","code":"+673"},{"country":"Bulgaria","code":"+359"},{"country":"Burkina Faso","code":"+226"},{"country":"Burma-Myanmar","code":"+95"},{"country":"Burundi","code":"+257"},{"country":"Cambodia","code":"+855"},{"country":"Cameroon","code":"+237"},{"country":"Canada","code":"+1"},{"country":"Cape Verde","code":"+238"},{"country":"Cayman Islands","code":"+1345"},{"country":"Central African Republic","code":"+236"},{"country":"Chad","code":"+235"},{"country":"Chile","code":"+56"},{"country":"China","code":"+86"},{"country":"Christmas Island","code":"+6189"},{"country":"Colombia","code":"+57"},{"country":"Comoros","code":"+269"},{"country":"Congo","code":"+242"},{"country":"Congo, The Democratic Republic","code":"+243"},{"country":"Cook Islands","code":"+682"},{"country":"Costa Rica","code":"+506"},{"country":"Croatia","code":"+385"},{"country":"Cuba","code":"+53"},{"country":"Cyprus","code":"+357"},{"country":"Czech Republic","code":"+420"},{"country":"Denmark","code":"+45"},{"country":"Djibouti","code":"+253"},{"country":"Dominica","code":"+1767"},{"country":"Dominican Republic","code":"+1849"},{"country":"Dominican Republic","code":"+1829"},{"country":"Dominican Republic","code":"+1809"},{"country":"East Timor","code":"+670"},{"country":"Ecuador","code":"+593"},{"country":"Egypt","code":"+20"},{"country":"El Salvador","code":"+503"},{"country":"Equatorial Guinea","code":"+240"},{"country":"Eritrea","code":"+291"},{"country":"Estonia","code":"+372"},{"country":"Ethiopia","code":"+251"},{"country":"Faroe Islands","code":"+298"},{"country":"Fiji","code":"+679"},{"country":"Finland","code":"+358"},{"country":"France","code":"+33"},{"country":"French Guiana","code":"+594"},{"country":"French Polynesia","code":"+689"},{"country":"Gabon","code":"+241"},{"country":"Gambia","code":"+220"},{"country":"Georgia","code":"+995"},{"country":"Germany","code":"+49"},{"country":"Ghana","code":"+233"},{"country":"Gibraltar","code":"+350"},{"country":"Greece","code":"+30"},{"country":"Greenland","code":"+299"},{"country":"Grenada","code":"+1473"},{"country":"Guadeloupe","code":"+590"},{"country":"Guam","code":"+1671"},{"country":"Guatemala","code":"+502"},{"country":"Guinea","code":"+224"},{"country":"Guinea-Bissau","code":"+245"},{"country":"Guyana","code":"+592"},{"country":"Haiti","code":"+509"},{"country":"Honduras","code":"+504"},{"country":"Hong Kong","code":"+852"},{"country":"Hungary","code":"+36"},{"country":"Iceland","code":"+354"},{"country":"India","code":"+91"},{"country":"Indonesia","code":"+62"},{"country":"Iran","code":"+98"},{"country":"Iraq","code":"+964"},{"country":"Ireland","code":"+353"},{"country":"Israel","code":"+972"},{"country":"Italy","code":"+39"},{"country":"Ivory Coast","code":"+225"},{"country":"Jamaica","code":"+1876"},{"country":"Japan","code":"+81"},{"country":"Jordan","code":"+962"},{"country":"Kazakhstan","code":"+7"},{"country":"Kenya","code":"+254"},{"country":"Kiribati","code":"+686"},{"country":"Kuwait","code":"+965"},{"country":"Kyrgyzstan","code":"+996"},{"country":"Laos","code":"+856"},{"country":"Latvia","code":"+371"},{"country":"Lebanon","code":"+961"},{"country":"Lesotho","code":"+266"},{"country":"Liberia","code":"+231"},{"country":"Libya","code":"+218"},{"country":"Liechtenstein","code":"+423"},{"country":"Lithuania","code":"+370"},{"country":"Luxembourg","code":"+352"},{"country":"Macau","code":"+853"},{"country":"Macedonia","code":"+389"},{"country":"Madagascar","code":"+261"},{"country":"Malawi","code":"+265"},{"country":"Malaysia","code":"+60"},{"country":"Maldives","code":"+960"},{"country":"Mali","code":"+223"},{"country":"Malta","code":"+356"},{"country":"Marshall Islands","code":"+692"},{"country":"Martinique","code":"+596"},{"country":"Mauritania","code":"+222"},{"country":"Mauritius","code":"+230"},{"country":"Mayotte","code":"+262"},{"country":"Mexico","code":"+52"},{"country":"Moldova","code":"+373"},{"country":"Monaco","code":"+377"},{"country":"Mongolia","code":"+976"},{"country":"Montenegro","code":"+382"},{"country":"Montserrat","code":"+1664"},{"country":"Morocco","code":"+212"},{"country":"Mozambique","code":"+258"},{"country":"Namibia","code":"+264"},{"country":"Nauru","code":"+674"},{"country":"Nepal","code":"+977"},{"country":"Netherlands","code":"+31"},{"country":"Curaçao","code":"+599"},{"country":"New Caledonia","code":"+687"},{"country":"New Zealand","code":"+64"},{"country":"Nicaragua","code":"+505"},{"country":"Niger","code":"+227"},{"country":"Nigeria","code":"+234"},{"country":"Niue","code":"+683"},{"country":"Norfolk Island","code":"+672"},{"country":"Northern Mariana Islands","code":"+1670"},{"country":"North Korea","code":"+850"},{"country":"Norway","code":"+47"},{"country":"Oman","code":"+968"},{"country":"Pakistan","code":"+92"},{"country":"Palau","code":"+680"},{"country":"Palestine","code":"+970"},{"country":"Panama","code":"+507"},{"country":"Papua New Guinea","code":"+675"},{"country":"Paraguay","code":"+595"},{"country":"Peru","code":"+51"},{"country":"Philippines","code":"+63"},{"country":"Pitcairn Islands","code":"+870"},{"country":"Poland","code":"+48"},{"country":"Portugal","code":"+351"},{"country":"Puerto Rico","code":"+1787"},{"country":"Qatar","code":"+974"},{"country":"Réunion","code":"+262"},{"country":"Romania","code":"+40"},{"country":"Russia","code":"+7"},{"country":"Rwanda","code":"+250"},{"country":"Saint Helena","code":"+290"},{"country":"Saint Kitts and Nevis","code":"+1869"},{"country":"Saint Lucia","code":"+1758"},{"country":"Saint Martin","code":"+1599"},{"country":"Saint Pierre and Miquelon","code":"+508"},{"country":"Saint Vincent and the Grenadines","code":"+1784"},{"country":"Samoa","code":"+685"},{"country":"San Marino","code":"+378"},{"country":"São Tomé and Príncipe","code":"+239"},{"country":"Saudi Arabia","code":"+966"},{"country":"Senegal","code":"+221"},{"country":"Serbia","code":"+381"},{"country":"Seychelles","code":"+248"},{"country":"Falkland Islands","code":"+500"},{"country":"Sierra Leone","code":"+232"},{"country":"Singapore","code":"+65"},{"country":"Slovakia","code":"+421"},{"country":"Slovenia","code":"+386"},{"country":"Solomon Islands","code":"+677"},{"country":"Somalia","code":"+252"},{"country":"South Africa","code":"+27"},{"country":"South Korea","code":"+82"},{"country":"South Sudan","code":"+211"},{"country":"Spain","code":"+34"},{"country":"Sri Lanka","code":"+94"},{"country":"Sudan","code":"+249"},{"country":"Suriname","code":"+597"},{"country":"Swaziland","code":"+268"},{"country":"Sweden","code":"+46"},{"country":"Switzerland","code":"+41"},{"country":"Syria","code":"+963"},{"country":"Taiwan","code":"+886"},{"country":"Tajikistan","code":"+992"},{"country":"Tanzania","code":"+255"},{"country":"Thailand","code":"+66"},{"country":"Togo","code":"+228"},{"country":"Tokelau","code":"+690"},{"country":"Tonga","code":"+676"},{"country":"Trinidad and Tobago","code":"+1868"},{"country":"Tunisia","code":"+216"},{"country":"Turkey","code":"+90"},{"country":"Turkmenistan","code":"+993"},{"country":"Turks and Caicos Islands","code":"+1649"},{"country":"Tuvalu","code":"+688"},{"country":"Uganda","code":"+256"},{"country":"United Kingdom","code":"+44"},{"country":"Ukraine","code":"+380"},{"country":"United Arab Emirates","code":"+971"},{"country":"Uruguay","code":"+598"},{"country":"United States","code":"+1"},{"country":"Uzbekistan","code":"+998"},{"country":"Vanuatu","code":"+678"},{"country":"Venezuela","code":"+58"},{"country":"Vietnam","code":"+84"},{"country":"Virgin Islands","code":"+1340"},{"country":"Wallis and Futuna","code":"+681"},{"country":"Yemen","code":"+967"},{"country":"Zambia","code":"+260"},{"country":"Zimbabwe","code":"+263"}]
			,
			image_select:false,
			twitterURL:"",
			googleURL:"",
			linkedinURL:"",
			facebookURL:"",
			youtubeURL:'',
			soundcloudURL:'',
			instagramURL:'',
			isMusician:false,
			musicCategories:[],
			confirm_password:'',
			passwordMatcherror:false

		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillMount(){
        const userRole = cookie.load('user').role;
        // console.log(userRole)
        this.setState({role:userRole})
        if(userRole=="Admin"){
			if(this.props && this.props!==null && this.props!==undefined && this.props.params && this.props.params!==null && this.props.params!==undefined && this.props.params!==""){
				var id=this.props.params
				this.props.getTheUserInformation(id).then(
						(response)=>{
							this.setState({"firstName":response.user.profile.firstName,"lastName":response.user.profile.lastName, email:response.user.email})
							this.setState({"userBio":response.user.userBio,expertRates:response.user.expertRates, expertCategories:response.user.expertCategories})
							this.setState({"expertContact": response.user.contact, "expertRating":response.user.expertRating, expertFocusExpertise:response.user.expertFocusExpertise})
							this.setState({"yearsexpertise":response.user.yearsexpertise, password:response.user.password, expertContactCC:response.user.expertContactCC})
							this.setState({"profileImage":response.user.profileImage})
							this.setState({"university":response.user.university})
							this.setState({"resume":response.user.resume_path})
							this.setState({"facebookURL":response.user.facebookURL})
							this.setState({"twitterURL":response.user.twitterURL})
							this.setState({"googleURL":response.user.googleURL})
							this.setState({"linkedinURL":response.user.linkedinURL})

							this.setState({"youtubeURL":response.user.youtubeURL})
							this.setState({"instagramURL":response.user.instagramURL})
							this.setState({"soundcloudURL":response.user.linkedinURL})
							this.setState({"isMusician":response.user.isMusician})


						},
						(err)=>{
							this.setState({ errorMessage:"Sorry Couldn't get Information"})
						}
					);
			}
		}
		else{
			this.setState({ errorMessage:"Sorry You Are Not Authorized"})
		}

        axios.get(`${API_URL}/getExpertsCategoryList`)
          .then(res => {
                // console.log(res.data)
                this.setState({categories:res.data})
								res.data.map(key=>{
                    if(key.name==='Music Lessons'){
                      this.setState({musicCategories:key})
                    }
                })
              }
        )
	}


	onChange = (e) => {

    const state = this.state;
 switch (e.target.name) {
   case 'profile':
	 // var ext = $('#profile').val().split('.').pop().toLowerCase();
		// if($.inArray(ext, ['tif','png','jpeg']) == -1) {
		// 	$('#profile').val('');
		// 		alert('Invalid Extension.Image should be .png .jpeg .tiff format');
		// }
      this.setState({profile: e.target.files})
		 break;
   case 'resume':
    this.setState({update_resume: e.target.files})
 }
}


	handleSubmit(e){
		e.preventDefault();
		let errors={}
			if(this.state.firstName==="" || this.state.firstName==undefined || this.state.firstName.trim()==="" ) errors.firstName="First Name cant be empty"
			if(this.state.lastName==="" || this.state.lastName==undefined || this.state.lastName.trim()==="" ) errors.lastName="Last Name cant be empty"
			if(this.state.email===""|| this.state.email==undefined ) errors.this.state.firstName="Email cant be empty"
			if(this.state.password==="" || this.state.password==undefined ||this.state.password.trim()==="" ) errors.password="Password cant be empty"
			//if(this.state.confirm_password==="" || this.state.confirm_password==undefined ||this.state.confirm_password.trim()==="" ) errors.confirm_password="Confirm Password cant be empty"

			//if(this.state.userBio==="" || this.state.userBio==undefined ||this.state.userBio.trim()==="") errors.userBio="User Bio cant be empty"
			//if(this.state.expertRates===""|| this.state.expertRates==undefined ) errors.expertRates="Expert Rates cant be empty"
			if(this.state.expertCategories==="" || this.state.expertCategories==undefined ) errors.expertCategories="Categories cant be empty"
			if(this.state.expertContact==="" || this.state.expertContact==undefined ) errors.expertContact="Contact cant be empty"
			if(this.state.expertContactCC==="" || this.state.expertContactCC==undefined ) errors.expertContactCC="County Code cant be empty"

			// if(this.state.expertRating==="" || this.state.expertRating==undefined ) errors.expertRating="Ratings cant be empty"
			//if(this.state.expertFocusExpertise==="" || this.state.expertFocusExpertise==undefined || this.state.expertFocusExpertise.trim()==="") errors.expertFocusExpertise="Focus Expertise cant be empty"
			//if(this.state.yearsexpertise===""|| this.state.yearsexpertise==undefined || this.state.yearsexpertise.trim()==="") errors.yearsexpertise="Experience cant be empty"
			if(this.state.university===""|| this.state.university==undefined || this.state.university.trim()==="") errors.university="university cant be empty"
			// if(this.state.googleURL===""|| this.state.googleURL==undefined || this.state.googleURL.trim()==="") errors.university="google link cant be empty"
			// if(this.state.linkedinURL===""|| this.state.linkedinURL==undefined || this.state.linkedinURL.trim()==="") errors.linkedinURL="linkdin link  cant be empty"
			// if(this.state.facebookURL===""|| this.state.facebookURL==undefined || this.state.facebookURL.trim()==="") errors.facebookURL="facebook link cant be empty"
			// if(this.state.twitterURL===""|| this.state.twitterURL==undefined || this.state.twitterURL.trim()==="") errors.twitterURL="twitter link cant be empty"
			if(this.state.password.length>0 && this.state.confirm_password.length>0){
				if(this.state.password != this.state.confirm_password) errors.confirm_password="Password not match"
			}

		this.setState({ errors })

		const isValid = Object.keys(errors).length===0

		if(isValid){
			const {email,firstName,lastName,password,confirm_password,expertCategories,expertContact,expertContactCC,expertFocusExpertise,yearsexpertise,googleURL,twitterURL,facebookURL,linkedinURL,profile,update_resume} = this.state
			var formdata = new FormData(this.state);
			formdata.append('email',this.state.email)
			formdata.append('expertCategories',this.state.expertCategories)
			formdata.append('expertContact',this.state.expertContact)
			formdata.append('expertContactCC',this.state.expertContactCC)
			formdata.append('expertFocusExpertise',this.state.expertFocusExpertise)

			if(this.state.confirm_password.length>0){
				formdata.append('password',this.state.password)
			}


			formdata.append('firstName',this.state.firstName)
			formdata.append('lastName',this.state.lastName)
			formdata.append('university',this.state.university)
			formdata.append('yearsexpertise',this.state.yearsexpertise)

			formdata.append('profile', this.state.profile.length>0 ? this.state.profile[0]:'', this.state.profile.length>0?this.state.profile[0].name:'');
			formdata.append('resume', this.state.update_resume.length>0?this.state.update_resume[0]:'', this.state.update_resume.length>0? this.state.update_resume[0].name:'');

			formdata.append('facebookLink',this.state.facebookURL)
			formdata.append('twitterLink',this.state.twitterURL)
			formdata.append('linkedinLink',this.state.linkedinURL)
			formdata.append('googleLink',this.state.googleURL)
			if(this.state.isMusician){
					formdata.append('instagramLink',this.state.instagramURL)
					formdata.append('youtubeLink',this.state.youtubeURL)
					formdata.append('soundcloudLink',this.state.soundcloudURL)
					formdata.append('isMusician',true)
			}else{
				formdata.append('isMusician',false)
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

			return axios.post(`${API_URL}/UpdateUserInfo`, formdata,{

        }).then((response) => {
					if(response.passchange){
						setTimeout(function(){
					      browserHistory.push('/logout');
					 },1500);
					}
        	if(response.data.success){
						location.reload();
					}
      }).catch((error) => {
				console.log(error)
      });

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

		// if(e.target.name=='confirm_password'){
		// 	if(this.state.password !=this.state.confirm_password){
		// 		this.setState({passwordMatcherror:true})
		// 	}else{
		// 		this.setState({passwordMatcherror:false})
		// 	}
		// }

		if(!!this.state.errors[e.target.name]){
			let errors = Object.assign({}, this.state.errors)

			delete errors[e.target.name]
			this.setState({
				[e.target.name] : e.target.value,
				errors
			});
		}
		else{
			this.setState({[e.target.name]: e.target.value})
		}
	}
	  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
        <li className="breadcrumb-item">Update This Expert</li>
      </ol>
    );
  }

	adminMenu() {
    return (
      <SidebarMenuAdmin/>
    );
  }
  isRole(roleToCheck, toRender) {
    const userRole = cookie.load('user').role;
    if (userRole == roleToCheck) {
      return toRender;
    }
    return false;
  }

	render(){
// console.log(this.state.password)
		return(
		      <div className="session-page">
		        <div className="container">
		          <div className="row">
		            {this.breadcrumb()}
		            <div className="wrapper-sidebar-page">
		              <div className="row row-offcanvas row-offcanvas-left">
		              {this.isRole('Admin', this.adminMenu())}
		                  <div className="column col-sm-9 col-xs-11" id="main">
		                  <div id="pageTitle">
		                    <div className="title">Update Expert</div>
		                    {this.state.successmessage && this.state.successmessage!==null && this.state.successmessage!==undefined && this.state.successmessage!="" && <div className="alert alert-success">{this.state.successmessage}  </div>}
		                    {this.state.errorMessage && this.state.errorMessage!==null && this.state.errorMessage!==undefined && this.state.errorMessage!="" && <div className="alert alert-danger">{this.state.errorMessage}  </div>}
		                  </div>


{this.state.role &&	this.state.role=="Admin" &&
						<form id="create_expert" onSubmit={this.handleSubmit}>
		                    <div dangerouslySetInnerHTML={{__html: this.state.responseMsg}} />
		                    <div className="row">
													<div>
											   		<img height="120" width="160" src={`${Image_URL}`+this.state.profileImage} />
													</div>
													<span>selected file {this.state.profileImage.slice(9)}</span>
												<div  className={classnames('col-md-6 form-group', {"has-error":!!this.state.errors.profile})}>
													 <label>Profile Picture</label>
														 <input
 															type="file"
 															name="profile"
 															onChange={(e) => this.onChange(e)}
 														/>
												 </div>
												 <div className={classnames('col-md-6 form-group', {"has-error":!!this.state.errors.resume})}>
													 <label>Resume</label>
														 <input
                               type="file"
                               name="resume"
                              onChange={(e) => this.onChange(e)}
                             />
													 <span>selected file {this.state.resume.slice(9)}</span>
													 <span className="error">{this.state.errors.resume} </span>
												 </div>

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
		                        <input  name="password" className="form-control" onKeyDown={this.keyPress}  value={this.state.password} onChange={this.handleChange} type="password" />
		                      	<span className="error">{this.state.errors.password} </span>
		                      </div>
		                    </div>
												<div className="row form-group">
												 <div className="col-md-12">
													 <label>Confirm Password</label>
													 <input  name="confirm_password" className="form-control" value={this.state.confirm_password} onChange={this.handleChange} type="password" />
													 <span className="error">{this.state.errors.confirm_password} </span>
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
							    <select name="expertCategories" className="form-control" value={this.state.expertCategories} onChange={this.handleChange}>
/*							      <option  value="">Select</option>
							      <option   value="accounting">Accounting</option>
							      <option  value="accounting-finance">Accounting-finance</option>
							      <option  value="blogging">Blogging</option>
							      <option  value="graphic-design">Graphic-design</option>
							      <option  value="bass">bass</option>*/
							      {this.state.categories.map((cats,i)=> <TheCategories cats={cats} /> )}
							    </select>
							    <span className="error">{this.state.errors.expertCategories} </span>
		                      </div>
		                      <div className="col-md-3 form-group">
		                        <label>Country-Code</label>
		                      	<select name="expertContactCC" className="form-control" value={this.state.expertContactCC} onChange={this.handleChange}>
		                      		{this.state.codes.map((code, key)=><option value={code.code}>{code.country + " " + code.code}</option>)}
		                      	</select>
		                      	<span className="error">{this.state.errors.expertContactCC} </span>
		                      </div>
		                      <div className="col-md-3 form-group">
		                        <label>Contact Number</label>
		                        <input name="expertContact" className="form-control" value={this.state.expertContact} onChange={this.handleChange} type="number"/>
		                      	<span className="error">{this.state.errors.expertContact} </span>
		                      </div>
		                    </div>
		                    <div className="row form-group">
		                      {/*
			                      	<div className="col-md-4 form-group">
			                        <label>Rating</label>
			                        <input name="expertRating" className="form-control" value={this.state.expertRating} onChange={this.handleChange} type="number" min="1" max="10"/>
			                      	<span className="error">{this.state.errors.expertRating} </span>
			                      </div>
		                  		*/ }
		                      <div className="col-md-4 form-group">
		                        <label>Focus of Expertise</label>
		                        <input name="expertFocusExpertise" className="form-control" value={this.state.expertFocusExpertise} onChange={this.handleChange} type="text"/>

		                      </div>
		                      <div className="col-md-4 form-group">
		                        <label>Years of Expertise</label>
		                        <input name="yearsexpertise" className="form-control" value={this.state.yearsexpertise} onChange={this.handleChange} type="select" />

		                      </div>
													<div className="col-md-4 form-group">
														<label>University</label>
														 <input name="university" className="form-control" value={this.state.university}  onChange={this.handleChange} type="text" />
														 <span className="error">{this.state.errors.university} </span>
												</div>

		                    </div>

		                    <div className="row form-group">

		                     <div className="col-md-4 form-group">
		                        <label>Facebook Url</label>
															<input name="facebookURL" className="form-control" value={this.state.facebookURL}  onChange={this.handleChange} type="text" />
		                      </div>

		                      <div className="col-md-4 form-group">
		                        <label>Twitter Url</label>
															<input name="twitterURL" className="form-control" value={this.state.twitterURL}  onChange={this.handleChange} type="text" />
		                      </div>

		                      <div className="col-md-4 form-group">
		                        <label>Linkedin Url</label>
															<input name="linkedinURL" className="form-control" value={this.state.linkedinURL}  onChange={this.handleChange} type="text" />
		                      </div>
													<div className="col-md-4 form-group">
		                        <label>Google Url</label>
															<input name="googleURL" className="form-control" value={this.state.googleURL}  onChange={this.handleChange} type="text" />
		                      </div>

													{this.state.isMusician&&
														<div>
															<div className="col-md-4 form-group">
				                        <label>Youtube Url</label>
																	<input name="youtubeURL" className="form-control" value={this.state.youtubeURL}  onChange={this.handleChange} type="text" />
				                      </div>
															<div className="col-md-4 form-group">
				                        <label>SoundCloud Url</label>
																	<input name="soundcloudURL" className="form-control" value={this.state.soundcloudURL}  onChange={this.handleChange} type="text" />
				                      </div>

															<div className="col-md-4 form-group">
				                        <label>Instagram Url</label>
																	<input name="instagramURL" className="form-control" value={this.state.instagramURL}  onChange={this.handleChange} type="text" />
				                      </div>

														</div>
													}
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
		                        <button type="submit" className="btn btn-primary">Submit</button>
		                        &nbsp;<button className="btn btn-default" onClick = {this.clearInput}>Reset</button>
		                      </div>
		                    </div>
		                  </form>}


		                 </div>
		              </div>
		            </div>
		          </div>
		        </div>
		      </div>

			)


	}




}

class TheCategories extends React.Component {
   render() {
      return (
          <optgroup label={this.props.cats.name}>
            {this.props.cats.subcategory.map((subcat,k)=><SubCategories subcat={subcat}  />)}
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

export default connect(mapStateToProps, {getTheUserInformation, AdminUpdateExpert})(UsersProfileView);
