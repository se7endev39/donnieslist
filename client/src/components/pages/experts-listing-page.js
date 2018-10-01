import React, { Component } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import { Field } from 'redux-form';
import { sendEmail, isLoggedIn } from '../../actions/expert';
import axios from 'axios';
import $ from 'jquery'
import cookie from 'react-cookie';
import NotificationModal from './notification-modal';

class ExpertsListingPage extends Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    this.state = {
      category :"",
      responseMsg: "",
      isUserLoggedIn: "",
      posts: [],
      topRated:[],
      error: null,
      selectedExpertSlug : ""
    };

    $(document).ready(function(){
      jQuery(document).on('click','.show_message_form',function(){
        $('#msg-form').toggleClass('displayNone');
      });
    });
  }

  handleFormSubmit(formProps) {
    this.props.sendEmail(formProps).then(
    	(response)=>{
        this.setState({responseMsg : response.message})
    	},
    	(err) => err.response.json().then(({errors})=> {
     		this.setState({responseMsg : errors})
     	})
    )
  }

  addEndorsements = (slug) =>{
    const currentUser = cookie.load('user');
    const fromSlug = currentUser.slug;
    
    const data = {'toSlug':slug,'fromSlug':fromSlug};
    
    axios.post(`${API_URL}/addEndorsements/`,data)
      .then(res => {
        console.log(res.message);
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    var category = this.props.params.category;
    // Remove the 'www.' to cause a CORS error (and see the error state)
    axios.get(`${API_URL}/getExpertsListing/${category}`)
      .then(res => {
        // Transform the raw data by extracting the nested posts
        const posts = res.data;
        const category = res.data.name;
        // Clear any errors, and turn off the loading indiciator.
        this.setState({
          posts,
          category,
          error: null
        });
      })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          category:'',
          error: err
        });
      });

    axios.get(`${API_URL}/getExpertsListing/topRated/${category}`)
      .then(res => {
        // Transform the raw data by extracting the nested posts
        const topRated = res.data;
        const category = res.data.name;
        // Clear any errors, and turn off the loading indiciator.
        this.setState({
          topRated,
          error: null
        });
      })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          category:'',
          error: err
        });
      });

  }

  render() {
    return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
  }

  renderError() {
    if(this.state.posts == undefined){
      return (<div className="alert-danger alert">Alas, No expert found in this category!</div>);
    }else{
      return (<div className="alert-danger alert">Uh oh: {this.state.error.message}</div>);
    }
  }

  getStars(rating) {
    var size = Math.max(0, (Math.min(5, rating))) * 16;
    return Object.assign(
      {width:size}
    );
  }

  getOnlineStatus(onlineStatus){
    return (onlineStatus === "ONLINE") ? true : false;
  }

  getOnlineStatusTitle(onlineStatus){
    if(onlineStatus === "ONLINE"){
      return "Online";
    }else{
      return "Offline";
    }
  }

  selectVideoSessionMinutes(item, e){
    this.setState({selectedExpertSlug: item.slug});
    $('.notification-modal').trigger('click');
  }

  redirectToLogin(e){
      e.preventDefault();
      browserHistory.push('/login');
      cookie.save('requiredLogin_for_session', 'Please login to start video session', { path: '/' });
  }

  render() {
    const currentUser = cookie.load('user');
    const { handleSubmit } = this.props;

    if(this.state.error) {
      return (
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                          <li className="breadcrumb-item active">{this.props.params.category}</li>
                        </ol>
                        <div id="center">
                          <div id="pageTitle">
                              <div className="title">{this.props.params.category}</div>
                              {this.renderError()}
                          </div>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      )
    }
    let imageStyle={
      background:'#ffffff',
      padding:15
    }

    return (
         <div id="experts-list" className="experts-list">
           <div className="expertise-tab-wrap">
             <div className="expertise-inner">
                <div className="container">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                      <li className="breadcrumb-item active">{this.props.params.category}</li>
                    </ol>
                    <div id="pageTitle">
                        <div className="title">{this.props.params.category}</div>
                        <div className="small">Select any one of the experts below to view their profile</div>
                    </div><br></br>
                    <ul className="nav nav-tabs" role="tablist">
                      <li role="presentation" className="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Latest</a></li>
                      <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Top Rated</a></li>
                      <li role="presentation"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">My Favorites</a></li>
                    </ul>
                   <div className="tab-content">
                      <div role="tabpanel" className="tab-pane active" id="home">
                         <div className="expertise-all-detail-wrap">

                            {this.state.posts.map(post =>
                            <div className="expertise-detail-only">
                               <div className="row">
                                  <div className="col-sm-8">
                                     <div className="row">
                                        <div className="col-sm-2"  style={imageStyle}>
                                           <div className="img-exper">
                                              {/*post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100" height="64" src={"http://localhost:3000"+post.profileImage} />:<img src="/src/public/img/pro1.png"/>*/}
                                              {post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100"  src={`${Image_URL}`+post.profileImage} />:<img src="/src/public/img/pro1.png"/>}
                                               {this.getOnlineStatus(post.onlineStatus) && <i data-toggle="title" title="Online" className={'user-online-o fa fa-circle'} aria-hidden="true"></i>}
                                          </div>
                                        </div>
                                        <div className="col-sm-10">
                                           <div className="person-per-info">
                                              <Link to={`/expert/${this.props.params.category}/${post.slug}`}><h2>{post.profile.firstName} {post.profile.lastName} {/*}<i title={this.getOnlineStatusTitle(post.onlineStatus)} className={this.getOnlineStatus(post.onlineStatus)} aria-hidden="true"></i>{*/}</h2> </Link>
                                            {/*  <p>About Expert: {post.userBio && post.userBio!=null && post.userBio!=undefined && post.userBio!="" ? post.userBio : '-'}</p>*/}
                                              <p>University: {post.university}</p>
                                              <p>Area of Expertise: {post.expertCategories}</p>
                                            {/*  <p>Country: {post.locationCountry && post.locationCountry!="" && post.locationCountry!=null && post.locationCountry!=undefined?post.locationCountry:"-"}</p>
                                              <p>State: {post.locationState && post.locationState!="" && post.locationState!=null && post.locationState!=undefined ?post.locationState:"-"}</p>
                                              <p>City: {post.locationCity && post.locationCity!="" && post.locationCity!=null && post.locationCity!=undefined ? post.locationCity : "-"}</p>*/}
                                              <p>Focus of Expertise: {post.expertFocusExpertise}</p>
                                              <p>Years of Expertise: {post.yearsexpertise}</p>
                                              <p>Rating: {post.expertRating && post.expertRating!=null && post.expertRating!=undefined && post.expertRating!=""? post.expertRating: "No Ratings Available Yet"} {post.expertRating && post.expertRating!="" && <i className="fa fa-star" aria-hidden="true"></i>}</p>
                                              {/*}<p>Rates: {post.expertRates} <span>★</span></p>{*/}
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-sm-4">
                                     <div className="stars-review">
                                       <span className="stars right">
                                           <span style={this.getStars(post.rating)}></span>
                                       </span>
                                     </div>
                                     <div className="btn-expertise">
                                       {/*}<Link to={`/expert/${this.props.params.category}/${post.slug}`} className="btn-strt-session btn btn-primary pull-right">Start Video Session</Link>{*/}
                                       {currentUser ? <Link data-toggle="modal" title="Start Video Session" data-target="#notificationModal" to="javascript:;" onClick={this.selectVideoSessionMinutes.bind(this, post)} data-slug={post.slug} className="Start-Session btn-strt-session btn btn-primary pull-right">Connect</Link> : <div><Link title="Start Video Session" to="#" onClick={this.redirectToLogin.bind(this)} className="Start-Session btn-strt-session btn btn-primary pull-right">Connect</Link></div> }
                                     </div>
                                  </div>
                               </div>
                            </div>
                            )}
                            {this.state.posts && this.state.posts!=null && this.state.posts!=undefined  && this.state.posts.length==0 &&                       <div role="tabpanel" className="tab-pane" id="settings">
                                   <div className="expertise-all-detail-wrap">
                                    <div className="alert alert-danger">No expert found in this section!</div>
                                   </div>
                                </div>
                            }
                         </div>
                      </div>
                      <div>
                        { currentUser ? <NotificationModal userEmail={currentUser.email} expertSlug={this.state.selectedExpertSlug} modalId="notificationModal"/> : "" }
                      </div>
                      <div role="tabpanel" className="tab-pane" id="profile">
                         <div className="expertise-all-detail-wrap">
                            {this.state.topRated.map(post =>
                            <div className="expertise-detail-only">
                               <div className="row">
                                  <div className="col-sm-8">
                                     <div className="row">
                                        <div className="col-sm-2" style={imageStyle}>
                                           <div className="img-exper">
                                               {/*post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100" height="64" src={"http://localhost:3000"+post.profileImage} />:<img src="/src/public/img/pro1.png"/>*/}
                                              {post.profileImage && post.profileImage!=null && post.profileImage!=undefined && post.profileImage!=""?<img width="100"  src={`${Image_URL}`+post.profileImage} />:<img src="/src/public/img/pro1.png"/>}
                                               {this.getOnlineStatus(post.onlineStatus) && <i data-toggle="title" title="Online" className={'user-online-o fa fa-circle'} aria-hidden="true"></i>}
                                            </div>
                                        </div>
                                        <div className="col-sm-10">
                                           <div className="person-per-info">
                                              <Link to={`/expert/${this.props.params.category}/${post.slug}`}><h2>{post.profile.firstName} {post.profile.lastName} {/*<i title={this.getOnlineStatusTitle(post.onlineStatus)} className={this.getOnlineStatus(post.onlineStatus)} aria-hidden="true"></i>*/}</h2> </Link>
                                              <p>About Expert: {post.userBio}</p>
                                              <p>Area of Expertise: {post.expertCategories}</p>
                                              <p>Country: {post.locationCountry && post.locationCountry!="" && post.locationCountry!=null && post.locationCountry!=undefined?post.locationCountry:"-"}</p>
                                              <p>State: {post.locationState && post.locationState!="" && post.locationState!=null && post.locationState!=undefined ?post.locationState:"-"}</p>
                                              <p>City: {post.locationCity && post.locationCity!="" && post.locationCity!=null && post.locationCity!=undefined ? post.locationCity : "-"}</p>
                                              <p>Focus of Expertise: {post.expertFocusExpertise}</p>
                                              <p>Years of Expertise: {post.yearsexpertise}</p>
                                              <p>Rating: {post.expertRating} {post.expertRating && post.expertRating!="" && <i className="fa fa-star" aria-hidden="true"></i>}</p>
                                              {/*}<p>Rates: {post.expertRates} <span>★</span></p>{*/}
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-sm-4">
                                     <div className="stars-review">
                                       <span className="stars right">
                                           <span style={this.getStars(post.rating)}></span>
                                       </span>
                                     </div>
                                     <div className="btn-expertise">
                                       <Link to={`/expert/${this.props.params.category}/${post.slug}`} className="btn-strt-session btn btn-primary pull-right" onClick={e=>this.addEndorsements(post.slug)}>Connect</Link>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            )}
                            {this.state.topRated && this.state.topRated!=null && this.state.topRated!=undefined  && this.state.topRated.length==0 &&                       <div role="tabpanel" className="tab-pane" id="settings">
                                   <div className="expertise-all-detail-wrap">
                                    <div className="alert alert-danger">No expert found in this section!</div>
                                   </div>
                                </div>
                            }



                         </div>
                      </div>
                      <div role="tabpanel" className="tab-pane" id="messages">
                         <div className="expertise-all-detail-wrap">
                          <div className="alert alert-danger">No expert found in this section!</div>
                         </div>
                      </div>
                      <div role="tabpanel" className="tab-pane" id="settings">
                         <div className="expertise-all-detail-wrap">
                          <div className="alert alert-danger">No expert found in this section!</div>
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

export default connect(mapStateToProps, { sendEmail, isLoggedIn })(ExpertsListingPage);
