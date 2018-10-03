import React, { Component } from 'react';
import { Link, IndexLink ,browserHistory} from 'react-router';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookie';
import { protectedTest } from '../../actions/auth';
import { createExpert } from '../../actions/expert';
import ReactDOM from 'react-dom';
import { API_URL } from '../../actions/index';
import axios from 'axios'
import { Modal, Button} from 'react-bootstrap';

import SidebarMenuAdmin from './sidebar-admin';

const form = reduxForm({
  form: 'register'
});
const renderField = field => (
  <div>
    <input type="text" className="form-control" {...field.input}  />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);



const renderEmailField = field => (
  <div>
    <input type="email"  className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderTextarea = field => (
  <div>
    <textarea rows="3" className="form-control" {...field.input} ></textarea>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderBioField = field => (
  <div>
    <input type="email"  placeholder="Your email here" className="form-control" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
const renderFieldyearsexpertise = field => (
  <div>
    <select name="yearsexpertise" className="form-control" {...field.input} >
      <option value="">Select</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30</option>
      <option value="31">31</option>
      <option value="32">32</option>
      <option value="33">33</option>
      <option value="34">34</option>
      <option value="35">35</option>
      <option value="36">36</option>
      <option value="37">37</option>
      <option value="38">38</option>
      <option value="39">39</option>
      <option value="40">40</option>

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
  constructor(props) {
    super(props);
    this.state = {
      responseMsg:"",
      categories:[],
      musicCategories:[],
      role:"",
      codes:[{"country":"Afghanistan","code":"+93"},{"country":"Albania","code":"+355"},{"country":"Algeria","code":"+213"},{"country":"American Samoa","code":"+1684"},{"country":"Andorra","code":"+376"},{"country":"Angola","code":"+244"},{"country":"Anguilla","code":"+1264"},{"country":"Antigua and Barbuda","code":"+1268"},{"country":"Argentina","code":"+54"},{"country":"Armenia","code":"+374"},{"country":"Aruba","code":"+297"},{"country":"Australia","code":"+61"},{"country":"Austria","code":"+43"},{"country":"Azerbaijan","code":"+994"},{"country":"Bahamas","code":"+1242"},{"country":"Bahrain","code":"+973"},{"country":"Bangladesh","code":"+880"},{"country":"Barbados","code":"+1246"},{"country":"Belarus","code":"+375"},{"country":"Belgium","code":"+32"},{"country":"Belize","code":"+501"},{"country":"Benin","code":"+229"},{"country":"Bermuda","code":"+1441"},{"country":"Bhutan","code":"+975"},{"country":"Bolivia","code":"+591"},{"country":"Bosnia and Herzegovina","code":"+387"},{"country":"Botswana","code":"+267"},{"country":"Brazil","code":"+55"},{"country":"British Indian Ocean Territory","code":"+246"},{"country":"British Virgin Islands","code":"+1284"},{"country":"Brunei","code":"+673"},{"country":"Bulgaria","code":"+359"},{"country":"Burkina Faso","code":"+226"},{"country":"Burma-Myanmar","code":"+95"},{"country":"Burundi","code":"+257"},{"country":"Cambodia","code":"+855"},{"country":"Cameroon","code":"+237"},{"country":"Canada","code":" +1"},{"country":"Cape Verde","code":"+238"},{"country":"Cayman Islands","code":"+1345"},{"country":"Central African Republic","code":"+236"},{"country":"Chad","code":"+235"},{"country":"Chile","code":"+56"},{"country":"China","code":"+86"},{"country":"Christmas Island","code":"+6189"},{"country":"Colombia","code":"+57"},{"country":"Comoros","code":"+269"},{"country":"Congo","code":"+242"},{"country":"Congo, The Democratic Republic","code":"+243"},{"country":"Cook Islands","code":"+682"},{"country":"Costa Rica","code":"+506"},{"country":"Croatia","code":"+385"},{"country":"Cuba","code":"+53"},{"country":"Cyprus","code":"+357"},{"country":"Czech Republic","code":"+420"},{"country":"Denmark","code":"+45"},{"country":"Djibouti","code":"+253"},{"country":"Dominica","code":"+1767"},{"country":"Dominican Republic","code":"+1849"},{"country":"Dominican Republic","code":"+1829"},{"country":"Dominican Republic","code":"+1809"},{"country":"East Timor","code":"+670"},{"country":"Ecuador","code":"+593"},{"country":"Egypt","code":"+20"},{"country":"El Salvador","code":"+503"},{"country":"Equatorial Guinea","code":"+240"},{"country":"Eritrea","code":"+291"},{"country":"Estonia","code":"+372"},{"country":"Ethiopia","code":"+251"},{"country":"Faroe Islands","code":"+298"},{"country":"Fiji","code":"+679"},{"country":"Finland","code":"+358"},{"country":"France","code":"+33"},{"country":"French Guiana","code":"+594"},{"country":"French Polynesia","code":"+689"},{"country":"Gabon","code":"+241"},{"country":"Gambia","code":"+220"},{"country":"Georgia","code":"+995"},{"country":"Germany","code":"+49"},{"country":"Ghana","code":"+233"},{"country":"Gibraltar","code":"+350"},{"country":"Greece","code":"+30"},{"country":"Greenland","code":"+299"},{"country":"Grenada","code":"+1473"},{"country":"Guadeloupe","code":"+590"},{"country":"Guam","code":"+1671"},{"country":"Guatemala","code":"+502"},{"country":"Guinea","code":"+224"},{"country":"Guinea-Bissau","code":"+245"},{"country":"Guyana","code":"+592"},{"country":"Haiti","code":"+509"},{"country":"Honduras","code":"+504"},{"country":"Hong Kong","code":"+852"},{"country":"Hungary","code":"+36"},{"country":"Iceland","code":"+354"},{"country":"India","code":"+91"},{"country":"Indonesia","code":"+62"},{"country":"Iran","code":"+98"},{"country":"Iraq","code":"+964"},{"country":"Ireland","code":"+353"},{"country":"Israel","code":"+972"},{"country":"Italy","code":"+39"},{"country":"Ivory Coast","code":"+225"},{"country":"Jamaica","code":"+1876"},{"country":"Japan","code":"+81"},{"country":"Jordan","code":"+962"},{"country":"Kazakhstan","code":"+7"},{"country":"Kenya","code":"+254"},{"country":"Kiribati","code":"+686"},{"country":"Kuwait","code":"+965"},{"country":"Kyrgyzstan","code":"+996"},{"country":"Laos","code":"+856"},{"country":"Latvia","code":"+371"},{"country":"Lebanon","code":"+961"},{"country":"Lesotho","code":"+266"},{"country":"Liberia","code":"+231"},{"country":"Libya","code":"+218"},{"country":"Liechtenstein","code":"+423"},{"country":"Lithuania","code":"+370"},{"country":"Luxembourg","code":"+352"},{"country":"Macau","code":"+853"},{"country":"Macedonia","code":"+389"},{"country":"Madagascar","code":"+261"},{"country":"Malawi","code":"+265"},{"country":"Malaysia","code":"+60"},{"country":"Maldives","code":"+960"},{"country":"Mali","code":"+223"},{"country":"Malta","code":"+356"},{"country":"Marshall Islands","code":"+692"},{"country":"Martinique","code":"+596"},{"country":"Mauritania","code":"+222"},{"country":"Mauritius","code":"+230"},{"country":"Mayotte","code":"+262"},{"country":"Mexico","code":"+52"},{"country":"Moldova","code":"+373"},{"country":"Monaco","code":"+377"},{"country":"Mongolia","code":"+976"},{"country":"Montenegro","code":"+382"},{"country":"Montserrat","code":"+1664"},{"country":"Morocco","code":"+212"},{"country":"Mozambique","code":"+258"},{"country":"Namibia","code":"+264"},{"country":"Nauru","code":"+674"},{"country":"Nepal","code":"+977"},{"country":"Netherlands","code":"+31"},{"country":"Curaçao","code":"+599"},{"country":"New Caledonia","code":"+687"},{"country":"New Zealand","code":"+64"},{"country":"Nicaragua","code":"+505"},{"country":"Niger","code":"+227"},{"country":"Nigeria","code":"+234"},{"country":"Niue","code":"+683"},{"country":"Norfolk Island","code":"+672"},{"country":"Northern Mariana Islands","code":"+1670"},{"country":"North Korea","code":"+850"},{"country":"Norway","code":"+47"},{"country":"Oman","code":"+968"},{"country":"Pakistan","code":"+92"},{"country":"Palau","code":"+680"},{"country":"Palestine","code":"+970"},{"country":"Panama","code":"+507"},{"country":"Papua New Guinea","code":"+675"},{"country":"Paraguay","code":"+595"},{"country":"Peru","code":"+51"},{"country":"Philippines","code":"+63"},{"country":"Pitcairn Islands","code":"+870"},{"country":"Poland","code":"+48"},{"country":"Portugal","code":"+351"},{"country":"Puerto Rico","code":"+1787"},{"country":"Qatar","code":"+974"},{"country":"Réunion","code":"+262"},{"country":"Romania","code":"+40"},{"country":"Russia","code":"+7"},{"country":"Rwanda","code":"+250"},{"country":"Saint Helena","code":"+290"},{"country":"Saint Kitts and Nevis","code":"+1869"},{"country":"Saint Lucia","code":"+1758"},{"country":"Saint Martin","code":"+1599"},{"country":"Saint Pierre and Miquelon","code":"+508"},{"country":"Saint Vincent and the Grenadines","code":"+1784"},{"country":"Samoa","code":"+685"},{"country":"San Marino","code":"+378"},{"country":"São Tomé and Príncipe","code":"+239"},{"country":"Saudi Arabia","code":"+966"},{"country":"Senegal","code":"+221"},{"country":"Serbia","code":"+381"},{"country":"Seychelles","code":"+248"},{"country":"Falkland Islands","code":"+500"},{"country":"Sierra Leone","code":"+232"},{"country":"Singapore","code":"+65"},{"country":"Slovakia","code":"+421"},{"country":"Slovenia","code":"+386"},{"country":"Solomon Islands","code":"+677"},{"country":"Somalia","code":"+252"},{"country":"South Africa","code":"+27"},{"country":"South Korea","code":"+82"},{"country":"South Sudan","code":"+211"},{"country":"Spain","code":"+34"},{"country":"Sri Lanka","code":"+94"},{"country":"Sudan","code":"+249"},{"country":"Suriname","code":"+597"},{"country":"Swaziland","code":"+268"},{"country":"Sweden","code":"+46"},{"country":"Switzerland","code":"+41"},{"country":"Syria","code":"+963"},{"country":"Taiwan","code":"+886"},{"country":"Tajikistan","code":"+992"},{"country":"Tanzania","code":"+255"},{"country":"Thailand","code":"+66"},{"country":"Togo","code":"+228"},{"country":"Tokelau","code":"+690"},{"country":"Tonga","code":"+676"},{"country":"Trinidad and Tobago","code":"+1868"},{"country":"Tunisia","code":"+216"},{"country":"Turkey","code":"+90"},{"country":"Turkmenistan","code":"+993"},{"country":"Turks and Caicos Islands","code":"+1649"},{"country":"Tuvalu","code":"+688"},{"country":"Uganda","code":"+256"},{"country":"United Kingdom","code":"+44"},{"country":"Ukraine","code":"+380"},{"country":"United Arab Emirates","code":"+971"},{"country":"Uruguay","code":"+598"},{"country":"United States","code":"+1"},{"country":"Uzbekistan","code":"+998"},{"country":"Vanuatu","code":"+678"},{"country":"Venezuela","code":"+58"},{"country":"Vietnam","code":"+84"},{"country":"Virgin Islands","code":"+1340"},{"country":"Wallis and Futuna","code":"+681"},{"country":"Yemen","code":"+967"},{"country":"Zambia","code":"+260"},{"country":"Zimbabwe","code":"+263"}]
      ,
      profile: [],
      resume: [],
      imageselect:false,
      resumeselect:false,
      facebookLink:'',
      linkdinLink:'',
      googleLink:'',
      twitterLink:'',
      show:false,
      social_link:'',
      isMusician:false,
      select_category:''
    };

    this.props.protectedTest();
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitLink=this.submitLink.bind(this);
  }
  componentWillMount(){
        const userRole = cookie.load('user').role;
        // console.log(userRole)
        this.setState({role:userRole})
        if(userRole!="Admin"){
          this.setState({errorMessage:"Sorry You Are Not Authorized"})
        }

        axios.get(`${API_URL}/getExpertsCategoryList`)
          .then(res => {
                this.setState({categories:res.data})
                res.data.map(key=>{
                    if(key.name==='Music Lessons'){
                      this.setState({musicCategories:key})
                    }
                })
              }
        )
  }
  componentDidMount(){

    $(document).ready(function(){
      jQuery("#create_expert").validate({
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
         }
      });
    });
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
        this.handleShow();
        break;
      case 'twitter':
        this.setState({social_link:'Twitter'})
        this.handleShow();
        break;
      case 'google':
        this.setState({social_link:'Google'})
        this.handleShow();
        break;
      case 'linkdin':
        this.setState({social_link:'Linkdin'})
        this.handleShow();
        break;

    }
  }

  getsubcategories= (event) =>{
    this.setState({select_category:event.target.value});
    for (var i = 0; i <   this.state.musicCategories.subcategory.length; i++) {
         if(event.target.value.match(new RegExp(this.state.musicCategories.subcategory[i].name,"i"))){
           this.setState({isMusician:true});
           break;
         }else{
           this.setState({isMusician:false})
         }
      }

  }

  setSocialLink=(e)=>{
    switch (this.state.social_link) {
      case 'Facebook':
      this.setState({facebookLink:e.target.value})
        break;
      case 'Twitter':
        this.setState({twitterLink:e.target.value})
        break;
      case 'Google':
        this.setState({googleLink:e.target.value})
        break;
      case 'Linkdin':
        this.setState({linkdinLink:e.target.value})
        break;
     }
  }

  clearInput() {
    location.reload();
  }

  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
        <li className="breadcrumb-item">Create Expert</li>
      </ol>
    );
  }

  isRole(roleToCheck, toRender) {
    const userRole = cookie.load('user').role;
    if (userRole == roleToCheck) {
      return toRender;
    }
    return false;
  }

  adminMenu() {
    // return (
    //   <ul className="nav nav-sidebar" id="menu">
    //       <li>
    //           <a href="javascript:void(0)" data-target="#item1" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Users Management <span className="caret"></span></span></a>
    //           <ul className="nav nav-stacked collapse" id="item1">
    //               <li><Link to="#">List Users</Link></li>
    //               <li><Link to="/dashboard/create-expert">Create Expert</Link></li>
    //           </ul>
    //       </li>
    //       <li>
    //           <a href="javascript:void(0)" data-target="#item2" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Session Management <span className="caret"></span></span></a>
    //           <ul className="nav nav-stacked collapse" id="item2">
    //               <li><Link to="#">List Active Sessions</Link></li>
    //           </ul>
    //       </li>
    //   </ul>
    // );
    return (
      <SidebarMenuAdmin/>
    );
  }

  handleFormSubmit(formProps) {

    if(this.state.profile.length>0){
        this.setState({imageselect:false})

    }
    if(this.state.resume.length>0){
      this.setState({resumeselect:false})
    }
    if(this.state.profile.length==0 || this.state.resume.length==0){
        this.setState({imageselect:true})

    }else{
      var formdata = new FormData(formProps);
      formdata.append('email',formProps.email)
      formdata.append('expertCategories',this.state.select_category?this.state.select_category:'')
      formdata.append('expertContact',formProps.expertContact)
      formdata.append('expertContactCC',formProps.expertContactCC)
      formdata.append('expertFocusExpertise',formProps.expertFocusExpertise ? formProps.expertFocusExpertise :'')
      formdata.append('firstName',formProps.firstName)
      formdata.append('lastName',formProps.lastName)
      formdata.append('password',formProps.password)
      formdata.append('university',formProps.university)
      formdata.append('yearsexpertise',formProps.yearsexpertise?formProps.yearsexpertise:'')

      formdata.append('profile', this.state.profile.length>0 ? this.state.profile[0]:'', this.state.profile.length>0?this.state.profile[0].name:'');
      formdata.append('resume', this.state.resume.length>0?this.state.resume[0]:'', this.state.resume.length>0? this.state.resume[0].name:'');
      formdata.append('facebookLink',formProps.facebookLink? formProps.facebookLink:'')
      formdata.append('twitterLink',formProps.twitterLink?formProps.twitterLink:'')
      formdata.append('linkedinLink',formProps.linkdinLink?formProps.linkdinLink:'')
      formdata.append('googleLink',formProps.googleLink?formProps.googleLink:'')
      if(this.state.isMusician){
        formdata.append('isMusician',true)
        formdata.append('youtubeLink',formProps.youtubeLink?formProps.youtubeLink:'')
        formdata.append('instagramLink',formProps.instagramLink?formProps.instagramLink:'')
        formdata.append('soundcloudLink',formProps.soundcloudLink?formProps.soundcloudLink:'');
        console.log(formProps)
      }else{
          formdata.append('isMusician',false)
      }

     return axios.post(`${API_URL}/createExpert`, formdata,{
       headers: { Authorization: cookie.load('token') },
       })
     .then((response) => {
       console.log(response);
       if(!response.data.success){
           this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+response.data.error+"</div>"});
           //this.clearInput();
           $(".form-control").val("");
           $( 'form' ).each(function(){
            this.reset();
           });
       }
       if(response.data.success){

         this.setState({responseMsg : "<div class='alert alert-success text-center'>"+response.data.message+"</div>"});

         //this.clearInput();
         //document.getElementById("create_expert").reset();
         // $(".form-control").val("");
         // $('#create_expert').each(function(){
         //     this.reset();
         // });
       }
     }).catch((error) => {
       console.log(error);
       this.setState({responseMsg : "<div class='alert alert-danger text-center'>"+error+"</div>"});
     });

    }
  }



  onChange = (e) => {

    const state = this.state;
 switch (e.target.name) {
   case 'profile':
      this.setState({profile: e.target.files})
        this.setState({imageselect:false})
     break;
  case 'resume':
    this.setState({resume: e.target.files})
    this.setState({resumeselect:false})
 }
}



  render() {
    const renderFieldexpertCategories = field => (
  <div>
    <select name="expertCategories" className="form-control" {...field.input} onChange={this.getsubcategories}>
        <option value="">Select</option>
    {/*<option value="">Select</option>
      <option value="accounting">Accounting</option>
      <option value="accounting-finance">Accounting-finance</option>
      <option value="blogging">Blogging</option>
      <option value="graphic-design">Graphic-design</option>
      <option value="bass">bass</option>*/}
      {this.state.categories.map((cats,i)=> <TheCategories cats={cats} /> )}
    </select>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
)


const { handleSubmit } = this.props;
const renderCountryCodes = field => (
  <div>
    <select name="expertContactCC" className="form-control" {...field.input} >
        <option value="">Select</option>
      {
        this.state.codes.map((code, key)=>
        <option value={code.code}>{code.country + " " + code.code}</option>
        )
      }

    </select>
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);
    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
              {this.isRole('Admin', this.adminMenu())}
                  <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">

                  </div>
                  <div className="column col-sm-9 col-xs-11" id="main">
                      <div id="pageTitle">
                        <div className="title">Create Expert</div>

                        {this.state.errorMessage && this.state.errorMessage!==null && this.state.errorMessage!==undefined && this.state.errorMessage!="" && <div className="alert alert-danger">{this.state.errorMessage}  </div>}
                      </div>
                      {/* form begin here */ }
    {this.state.role && this.state.role=="Admin" &&
                   <div>
                      <form id="create_expert" enctype="multipart/form-data" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <div dangerouslySetInnerHTML={{__html: this.state.responseMsg}} />
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label>First Name*</label>
                            <Field name="firstName" component={renderField} type="text" />
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Last Name*</label>
                            <Field name="lastName" component={renderField} type="text" />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Email*</label>
                            <Field name="email" component={renderEmailField} type="email" />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Password*</label>
                            <Field name="password" component={renderField} type="password" />
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
                            {this.state.imageselect && <div className="error">This field is require.</div>}
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
                          {this.state.resumeselect && <div className="error">This field is require.</div>}
                          </div>
                        </div>

                        <div className="row form-group">

                          <div className="col-md-4 form-group">
                            <label>University*</label>
                            <Field name="university" component={renderField} type="text" />
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Categories*</label>
                            <Field name="expertCategories" component={renderFieldexpertCategories} type="select" />
                          </div>
                          <div className="col-md-3 form-group">
                            <label>Country Code*</label>
                            <Field name="expertContactCC" component={renderCountryCodes} type="number"/>
                          </div>
                        </div>
                        <div className="row form-group">
                          {/*<div className="col-md-4 form-group">
                                                      <label>Rating</label>
                                                      <Field name="expertRating" component={renderField} type="number" min="1" max="10"/>
                                                    </div>*/}
                        <div className="col-md-4 form-group">
                          <label>Contact Number*</label>
                          <Field name="expertContact" component={renderField} type="number"/>
                        </div>
                          <div className="col-md-4 form-group">
                            <label>Focus of Expertise</label>
                            <Field name="expertFocusExpertise" component={renderField} type="text"/>
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Years of Expertise</label>
                            <Field name="yearsexpertise" component={renderFieldyearsexpertise} type="select" />
                          </div>
                        </div>
                        <div className="row form-group">

                        <div className="col-md-4 form-group">
                           <label>Facebook Url</label>
                             <Field name="facebookLink" component={renderField} type="text" />
                         </div>

                         <div className="col-md-4 form-group">
                           <label>Twitter Url</label>
                             <Field name="twitterLink" component={renderField} type="text" />
                         </div>

                         <div className="col-md-4 form-group">
                           <label>Linkedin Url</label>
                             <Field name="linkdinLink" component={renderField} type="text" />
                         </div>
                         <div className="col-md-4 form-group">
                           <label>Google Url</label>
                             <Field name="googleLink" component={renderField} type="text" />
                         </div>
                         {this.state.isMusician &&
                          <div>
                              <div className="col-md-4 form-group">
                                <label>Youtube Url</label>
                                  <Field name="youtubeLink" component={renderField} type="text" />
                              </div>
                              <div className="col-md-4 form-group">
                                <label>Instagram Url</label>
                                  <Field name="instagramLink" component={renderField} type="text" />
                              </div>

                              <div className="col-md-4 form-group">
                                <label>SoundCoud Url</label>
                                  <Field name="soundcloudLink" component={renderField} type="text" />
                              </div>
                          </div>
                        }

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
                            <button type="submit" className="btn btn-primary">Submit</button>
                          </div>
                        </div>

                      </form>

                      <button className="btn btn-default" onClick = {this.clearInput}>Reset</button>
                      </div>
                    }
                      { /* form end here */ }
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
            {this.props.cats.subcategory.map((subcat,k)=><SubCategories subcat={subcat}  />)}
            {/*console.log(this.props.cats.subcategory)*/}
          </optgroup>
      );
   }
}
class SubCategories extends React.Component {
   render() {
      return (
          <option value={this.props.subcat.name} >{this.props.subcat.name} </option>
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
export default connect(mapStateToProps, { protectedTest, createExpert })(form(CreateExpert));
