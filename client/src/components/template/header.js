import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import $ from 'jquery';

import * as actions from '../../actions/messaging';
import ExpertAudioCall from './expert-audio-call';
import { setpage } from '../../actions/setpage';
import { setsearch } from '../../actions/searchaction';
import axios from 'axios';
import { API_URL } from '../../actions/index';


const socket = actions.socket;

const currentUser = cookie.load('user');
//console.log('currentUser: '+JSON.stringify(currentUser));

class HeaderTemplate extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      redirect: false,
      category:null,
      searchval: true,
      searchres: [],
    };
  }

  hidesearch() {
    console.log(typeof(this.props.posts))
    if(this.props.posts === '0'){ 
      return false
    }
    else if(this.props.posts === undefined){
      return true
    }
    else {
      return true
    }
  }

  renderLinks() {

    if (this.props.authenticated) {
      return [
        <li key={`${1}header`}>
          <Link onClick={this.handleOnClick} to="/"><i className="fa fa-home"></i> Home</Link>
        </li>,
        <li key={`${2}header`}>
            {/*}<Link onClick={this.handleOnClick} to="dashboard">Dashboard( {currentUser.role} - {currentUser.slug} )</Link>{*/}
          <div className="dropdown">
              <a data-toggle="dropdown" className="dropdown-toggle" href="javascript:void()" aria-expanded="true">
                <span className="name"><i className="fa fa-user"></i> {currentUser.firstName} {currentUser.lastName}({currentUser.role})</span>
                <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                 <div className="log-arrow-up"></div>
                  
                  <li><Link onClick={this.handleOnClick} to="/update-profile"><i className="fa fa-pencil" title="Update Profile"></i> update profile</Link></li>
                  
                  <li><Link onClick={this.handleOnClick} to="/account-info"><i className="fa fa-suitcase" title="account information"></i> account information</Link></li>

                  <li><Link onClick={this.handleOnClick} to="/profile"><i className="fa fa-user" title="Update Profile"></i> profile</Link></li>

                  { currentUser.role == 'User' ?  <li><Link onClick={this.handleOnClick} to="/dashboard/my-reviews"><i className="fa fa-commenting-o" aria-hidden="true"></i> my reviews</Link></li> : ''}
                   
                  { currentUser.role == 'Expert' ?  <li><Link onClick={this.handleOnClick} to="/dashboard/session-reviews"><i className="fa fa-commenting-o" aria-hidden="true"></i> session reviews</Link></li> : '' }

                  { currentUser.role == 'Expert' ?  <li><Link onClick={this.handleOnClick} to={"/mysession/"+currentUser.slug}><i className="fa fa-desktop"></i> my session</Link></li> : ''}
                  
                  { currentUser.role == 'Expert' ?  <li><Link onClick={this.handleOnClick} to="/mysession-list"><i className="fa fa-history" aria-hidden="true"></i> sessions history</Link></li> : ''}
                  
                  { currentUser.role == 'Expert' ?   <li><Link onClick={this.handleOnClick} to="/recordings"><i className="fa fa-microphone"></i> recordings </Link></li> : '' }
                  
                  <li><Link onClick={this.handleOnClick} to="logout"><i className="fa fa-key" ></i> logout</Link></li>

              </ul>
            </div>
        </li>
      ];
    } else {
      return [
        // Unauthenticated navigation
        <li key={1}>
          <Link onClick={this.homeOnClick} to="/">Home</Link>
        </li>,
        <li key={2}>
          <Link onClick={this.handleOnClick} to="login">Login</Link>
        </li>,
        <li key={3}>
          <Link onClick={this.handleOnClick} to="register">Signup</Link>
        </li>
        //<li key={4}>
        //  <Link onClick={this.handleOnClick} to="how-it-works">how it works</Link>
        //</li>,
        //<li key={5}>
        //  <Link onClick={this.handleOnClick} to="contact-us">contact</Link>
        //</li>
      ];
    }
  }

  getplaceholder(){
    if(this.props.posts === "HOME" || this.props.posts === undefined){
      return "Search"
    }
    else if(this.props.posts === '0'){
      return ""
    }
    else{
      return `Search ${this.props.posts}`
    }
  }

  handleOnClick(){
    console.log('here');
    let linksEl = document.querySelector('#nav-collapse');
    linksEl.classList.remove("in");
  }

  homeOnClick(){
    let linksEl = document.querySelector('#nav-collapse');
    linksEl.classList.remove("in");
    this.props.setpage('HOME');
  }

  searchinvoke(e) {
    console.log("Test........");
    axios.get(`${API_URL}/getExpertsListingByKeyword/${e.target.value}`)
    .then((res) => {
      // Transform the raw data by extracting the nested posts
      const searchres = res.data;
      // Clear any errors, and turn off the loading indiciator.
      this.setState({
        searchres,
        error: null,
      });
      if (this.state.searchres.length > 0) {
        this.props.setsearch(this.state.searchres);
      } else {
        this.props.setsearch([]);
      }
    })
    .catch((err) => {
      // Something went wrong. Save the error in state and re-render.
      this.setState({
        category: '',
        error: err,
      });
    });
  }

  displayPendingAccountAlert(){
    if(currentUser && currentUser.role == 'User' && !currentUser.customerId){
       return (
             <div className="user-pending-account-alert alert alert-danger">
                You are pending with your account setup for placing session with any expert, please fill in your information <Link to="/account-info"> here </Link>
             </div>
        );
    }
  }

  render() {
    return (
      <div>
        {  this.displayPendingAccountAlert() }
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-collapse">
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <div className="logo-tag"> <IndexLink className="navbar-brand" to="/">donnie's list</IndexLink>
                  {/*<span className="navbar-caption">$1/min live video education, lessons and instant advice from top experts.</span>*/}
              </div>
            </div>
            <div className="collapse navbar-collapse" id="nav-collapse">
              <ul className="nav navbar-nav navbar-right">
                {this.hidesearch() && <li>
                  <div className="search">
                    <i className="fa fa-search"></i>
                    <input className="test" placeholder={this.getplaceholder()} type="text" onChange={e => this.searchinvoke(e)}/>
                  </div>
                </li>}
                {this.renderLinks()}
              </ul>
            </div>
          </div>
        </nav>

        {/* modal for expert to notify audio call  */}
          <ExpertAudioCall email={ currentUser ?  currentUser.email : '' } />
         {/* modal for expert to notify audio call  */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let pos= state.pageroute.pagename;
  return {
    authenticated: state.auth.authenticated,
    posts: pos
  };
}

export default connect(mapStateToProps, { setpage, setsearch })(HeaderTemplate);
