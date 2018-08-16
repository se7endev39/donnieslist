import React, { Component } from 'react';
import { Link, IndexLink, browserHistory  } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler, tokBoxApikey } from '../../actions/index';
import { protectedTest } from '../../actions/auth';
import $ from 'jquery'
import axios from 'axios';
import { Modal, Button, Panel } from 'react-bootstrap';

import { FetchExpertConversation,ExpertSessionUserDisconnected } from '../../actions/messaging';
import * as actions from '../../actions/messaging';
import ExpertReplyMessage from './expert-reply-message';
import io from 'socket.io-client';
const socket = actions.socket;
import Loader from './loader';
import SessionWhiteboard from './session-whiteboard';
import UserReview from './user-review';
import { AlertList, Alert, AlertContainer } from "react-bs-notifier";

import {emojify} from 'react-emojione';

class SessionPage extends Component {
  constructor(props) {
    super(props);
    this.props.FetchExpertConversation(this.props.params.slug);
    this.state = {
      expert: "",
      role:"",
      firstName: "",
      lastName: "",
      apiToken: "",
      showEndCallOptions: false,
      session: "",
      publisher: "",
      numberofConnections:0,
      errorSession : false,
      errorSessionMessage : "",
      streams : {},
      sessionDate : "",
      sessionObj: '',
      publisherObj: '',
      currentUser : '',
      time: { },
      //seconds: 1800,
      seconds: cookie.load('selectMins') ? cookie.load('selectMins') : 1800,
      showUserReviewModal: false,
      sessionStartEndBtn: 'start',
      isShowingInfoAlert: false,
      infoAlertText: '',
      isExpertStartedSession: false,
      refreshIntervalId: '',
      expert_stripe_id: '',
      connected_username: '',
      connected_useremail: '',
      videoSessionStartTime: '',
      videoSessionEndTime: '',
      
    };

    //this.state = { time: {}, seconds: 1800 };
    //this.state = { time: {}, seconds: 310 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer  = this.stopTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    this.props.protectedTest();

		$(document).ready(function(){
		   jQuery('.Chat_Trigger').click(function() {
		        jQuery("body").toggleClass('OpenChatList');
            //jQuery(".Left_Panel").show();
		    });
		    jQuery(document).on('click','.Hide_Left_panel',function(){
		      jQuery("body").toggleClass('OpenChatList');
          //jQuery(".Left_Panel").hide();
		    });

        jQuery(document).on('click','.WhiteBoard_Trigger a',function(){
		      jQuery("body").toggleClass('OpenWhiteBoard');
          //jQuery("body").toggleClass('OpenChatList');
          jQuery(".whiteBoard_close").removeClass('OpenWhiteBoard');
		    });

        jQuery(document).on('click','.stream-end-btn',function(){
          jQuery(this).parent().remove();
        });

        jQuery('.canvas-tools a').click(function(){
          jQuery('.canvas-tools a').removeClass('active');
          jQuery(this).addClass('active');
        });
		});

    socket.on('expert user disconnected', (data) => {
      console.log('client side : expert user disconnected '+this.state.time+" : "+this.state.seconds);
      //this.props.ExpertSessionUserDisconnected(this.props.sessionOwnerUsername);
    });
    
    var todayDate = new Date();
    todayDate = todayDate.getDate()+"/"+todayDate.getMonth()+"/"+todayDate.getFullYear();
    this.state.sessionDate = todayDate ;
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.state.time = timeLeftVar;
    var slug = this.props.params.slug;


    const currentUser = cookie.load('user');
    var id=currentUser._id

    if(currentUser.role=="Expert"){
        axios.get(`${API_URL}/myuserprofile/${id}`, {
          headers: { Authorization: cookie.load('token') },
        }).then(
            (res)=>{

              var mainrole=res.data.user.role
              var mainId =res.data.user.stripeId
              if(res && res!=null && res.data && res.data!=null && res.data.user && res.data.user!=null && res.data.user!=undefined && mainrole=="Expert" && mainId==""){
                window.location.href = '/dashboard/confirm-payments';
              }
            }

          )
    }
    axios.get(`${API_URL}/getExpertDetail/${slug}`)
		  .then(res => {
        const expert = res.data[0];
        this.state.firstName = res.data[0].profile.firstName;
        this.state.lastName = res.data[0].profile.lastName;
        this.state.expert = expert;
        this.state.expert_stripe_id = expert.stripeId;            
        console.log("***** expert_stripe_id "+this.state.expert_stripe_id)
        console.log(res.data[0])
		  })
		  .catch(err => {});
          
        // set current user cookie
    this.state.currentUser = cookie.load('user');
    this.startVideoSession = this.startVideoSession.bind(this);
  }

  handleFormSubmit(formProps) {
    console.log('handleFormSubmit');
  }

  componentWillMount() {
//    const self = this;  
//    const currentUser = cookie.load('user');
//    // console.log(currentUser)
//    var expertEmail = "avadhesh_bhatt@rvtechnologies.co.in",
//        userEmail = currentUser.email,
//        slug = this.props.params.slug,
//        sessionOwner = false;
//    if(userEmail === expertEmail){
//      sessionOwner = true;
//    }
//
//    axios.post(`${API_URL}/createVideoSession`, { expertEmail, userEmail, sessionOwner })
//		  .then(res => {
//               console.log('*** createVideoSession ***');       
//        this.setState({sessionId  : res.data.sessionId });
//        this.setState({apiToken   : res.data.token });
//        var errorList = {};
//
//        var connectionCount;
//
//        var session = OT.initSession(tokBoxApikey, this.state.sessionId);
//        
//        this.setState({
//            sessionObj: session
//        });
//        
//        
//        
//        session.on('signal:video_session_start', function(event){
//            if(event.from.id != session.connection.connectionId){
//                console.log('*** Signal sent from connection '+ event.from.id);
//                self.setState({
//                    isShowingInfoAlert: true,
//                    infoAlertText: 'Expert has started session! be ready.',
//                    isExpertStartedSession: true
//                });
//                self.state.sessionObj.publish(self.state.publisherObj);
//                self.startTimer();
//            }
//        });
//        
//        session.on('signal:video_session_end', function(event){
//            if(event.from.id != session.connection.connectionId){
//                console.log('*** Signal sent from connection '+ event.from.id);
//                console.log('signal:video_session_end');
//            }
//        });
//        
//        session.on('streamCreated', function(event) {
//
//          //console.log('streamCreated'+ event.stream.connection.connectionId );
//            if(event.stream.connection.connectionId == session.connection.connectionId){
//                console.log('*** streamCreated same connectiond id ***');
//            } else {
//                console.log('*** streamCreated different connectiond id ***');
//            }
//
//          var subContainer = document.createElement('div');
//
//          subContainer.id = 'stream-' + event.stream.streamId;
//
//          document.getElementById('subscribers').appendChild(subContainer);
//
//          $('#'+subContainer.id+' .OT_root').append('<button id="end-btn-'+event.stream.streamId+'" class="stream stream-end-btn">End Button</button>');
//
//          // store the stream object for later use
//          //streams[event.stream.streamId] = event.stream;
//          console.log(event.stream);
//          //this.state.streams.push(event.stream);
//
//          //var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)', insertMode: 'append'}
//          var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)'}
//          //var subscriber = session.subscribe(event.stream, subContainer,options, function(error) {
//            var subscriber = session.subscribe(event.stream, 'subscribers' ,options, function(error) {
//            if (error) {
//              console.log(error.message);
//              return;
//            }
//            if (subscriber.stream.hasVideo) {
//              var imgData = subscriber.getImgData();
//              if(!imgData){
//                  subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
//              }
//              subscriber.setStyle('backgroundImageURI', imgData);
//            } else {
//              subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
//            }
//          });
//        })
//        .on('streamDestroyed', function(event){
////            if(event.stream.connection.connectionId == session.connection.connectionId){
////                console.log('*** streamDestroyed same connectiond id ***');
////            } else {
////                console.log('*** streamDestroyed different connectiond id ***');
////            }
//
//
//            if(session.connection.connectionId != event.stream.connection.connectionId){
//                self.state.sessionObj.disconnect();
//                    self.setState({
//                        sessionStartEndBtn: 'start'
//                    });
//                    self.stopTimer();
//
//                    if(self.state.currentUser){
//                      self.setState({role:self.state.currentUser.role})
//                        if(self.state.currentUser.role == 'User'){
//                            //alert('session closed by user');
//                            
//                            
//                            self.setState({
//                                showUserReviewModal: true,
//                                isShowingInfoAlert: true,
//                                infoAlertText: 'Expert has ended session!'
//                                
//                            });
//
//                            $('.wrapper').addClass('blur_page');
//                            
//                            
//                        }
//                        else if(self.state.currentUser.role == 'Expert'){
//                            //alert('session closed by user');
//                            self.setState({
//                                showUserReviewModal: true,
//                                isShowingInfoAlert: true,
//                                infoAlertText: 'You have ended the session!'
//                                
//                            });
//
//                            $('.wrapper').addClass('blur_page');
//                        } else {
//                            browserHistory.push('/');
//                        } 
//                    } 
//            }
//
//            
//        }).on('connectionCreated', function (event) {
//            connectionCount = connectionCount+1;
//            if (event.connection.connectionId != session.connection.connectionId) {
//              console.log('Another client connected. ' + connectionCount + ' total.');
//            }
//        })
//        .on('connectionDestroyed', function connectionDestroyedHandler(event) {
//            connectionCount = connectionCount-1;
//            //console.log('A client disconnected. ' + connectionCount + ' total.');
////            if(session.connection.connectionId != event.connection.connectionId){
////                self.state.sessionObj.disconnect();
////                    self.setState({
////                        sessionStartEndBtn: 'start'
////                    });
////                    self.stopTimer();
////
////                    if(self.state.currentUser){
////                      self.setState({role:self.state.currentUser.role})
////                        if(self.state.currentUser.role == 'User'){
////                            //alert('session closed by user');
////                            self.setState({
////                                showUserReviewModal: true,
////                                isShowingInfoAlert: true,
////                                infoAlertText: 'Expert has ended session!'
////                                
////                            });
////
////                            $('.wrapper').addClass('blur_page');
////                        }
////                        else if(self.state.currentUser.role == 'Expert'){
////                            //alert('session closed by user');
////                            self.setState({
////                                showUserReviewModal: true,
////                                isShowingInfoAlert: true,
////                                infoAlertText: 'You have ended the session!'
////                                
////                            });
////
////                            $('.wrapper').addClass('blur_page');
////                        } else {
////                            browserHistory.push('/');
////                        } 
////                    } 
////            }
//            
//        })
//        .on('sessionDisconnected', function(e){
//            console.log('*** sessionDisconnected ***');
//            self.stopTimer();
//            self.setState({
//                sessionStartEndBtn: 'start'
//            });
//
//            if(self.state.currentUser){
//                if(self.state.currentUser.role == 'User'){
//                    self.setState({
//                        showUserReviewModal: true
//                    });
//                    $('.wrapper').addClass('blur_page');
//                }
//                else if(self.state.currentUser.role == 'Expert'){
//                    //alert('session closed by user');
//                    self.setState({
//                        showUserReviewModal: true,
//                    });
//
//                    $('.wrapper').addClass('blur_page');
//                } else {
//                   browserHistory.push('/');
//                } 
//            } 
//
//        }).on("signal:user_session_connected", function(event) {
//            //console.log("Signal sent from connection " + event.from.id + event.data);
//            self.setState({
//                seconds: parseInt(event.data)
//            });
//            
//            var todayDate = new Date();
//            todayDate = todayDate.getDate()+"/"+todayDate.getMonth()+"/"+todayDate.getFullYear();
//            self.state.sessionDate = todayDate ;
//            let timeLeftVar = self.secondsToTime(self.state.seconds);
//            self.state.time = timeLeftVar;
//            console.log('time : '+ JSON.stringify(timeLeftVar));
//            
//           })
//         .on('sessionConnected', function(e){
//             
//            if(self.state.currentUser){
//                if(self.state.currentUser.role == 'User'){
//                    session.signal({
//                        type: 'user_session_connected',
//                        data: self.state.seconds
//                    }, function(error){
//                        if (error) {
//                           console.log("signal error ("
//                                        + error.name
//                                        + "): " + error.message);
//                         } else {
//                           console.log("signal sent."+self.state.seconds);
//                         }
//                    });
//                }
//            }
//             
//             
//             
//         })
//        .on('streamDestroyed', function(event) {
//          console.log('streamDestroyed: '+event.reason+' - '+slug);
//          socket.emit('expert user disconnected', slug);
//        })
//        .connect( this.state.apiToken, function(error) {
//          if (error) {
//            if (error.code === 1010) {
//              $('#publisher').html('<div class="alert alert-danger">Alas! You are not connected to the internet. Check your network connection. <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
//            }else if (error.code === 1004) {
//              $('#publisher').html('<div class="alert alert-danger">Alas! Session Expired, Please recharge your account to restart session! <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
//            }
//          } else {
//            console.log('connected');
//            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
//            var publisher = OT.initPublisher('45801242', 'publisher',{width:'100%', height:'603px'});
//            //session.publish(publisher);
//            self.setState({
//                publisherObj: publisher
//            });
//            $('.session-page-container').show();
//            $('.loader-center-ajax').hide();
//            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
//                $('.Chating_msg_Here').animate({
////                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
//                      scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")
//
//                });
//                
//                
//          }
//        });
//        //this.inputElement.click();
//        this.setState({showEndCallOptions: true });
//        //this.startTimer();
//
//	  }).catch(err => {
//      if(err){
//        this.setState({errorSessionMessage : "<div class='alert alert-danger'>Session is not active from Expert end. Please try again later.</div>" });
//      }
//    });
//    
//   console.log('Customer id '+ this.state.currentUser.customerId) ;
//   console.log('Stripe connect id '+ this.state.currentUser.stripe_connect_id) ;
    
    
  }

  componentDidMount() {

    setTimeout(function(){
      var g = $(".emojionearea-editor")[0]
      if (g == undefined || g == null){
        location.reload()
      }
    },1000)


//    var todayDate = new Date();
//    todayDate = todayDate.getDate()+"/"+todayDate.getMonth()+"/"+todayDate.getFullYear();
//    this.setState({sessionDate : todayDate });
//    let timeLeftVar = this.secondsToTime(this.state.seconds);
//    this.setState({ time: timeLeftVar });
//    var slug = this.props.params.slug;
//
//    axios.get(`${API_URL}/getExpertDetail/${slug}`)
//		  .then(res => {
//        const expert = res.data[0];
//        this.setState({firstName : res.data[0].profile.firstName });
//        this.setState({lastName : res.data[0].profile.lastName });
//		    this.setState({expert});
//		  })
//		  .catch(err => {});
//          
//        // set current user cookie
//        this.setState({
//            currentUser: cookie.load('user')
//        });


    const self = this;  
    const currentUser = cookie.load('user');
    // console.log(currentUser)
    var expertEmail = "avadhesh_bhatt@rvtechnologies.co.in",
        userEmail = currentUser.email,
        slug = this.props.params.slug,
        sessionOwner = false;
    if(userEmail === expertEmail){
      sessionOwner = true;
    }

    axios.post(`${API_URL}/createVideoSession`, { expertEmail, userEmail, sessionOwner })
		  .then(res => {
               console.log('*** createVideoSession ***');       
        this.setState({sessionId  : res.data.sessionId });
        this.setState({apiToken   : res.data.token });
        var errorList = {};

        var connectionCount;

        var session = OT.initSession(tokBoxApikey, this.state.sessionId);
        
        this.setState({
            sessionObj: session
        });
        
        
        
        session.on('signal:video_session_start', function(event){
            if(event.from.id != session.connection.connectionId){
                console.log('*** Signal sent from connection '+ event.from.id);
                self.setState({
                    isShowingInfoAlert: true,
                    infoAlertText: 'Expert has started session!',
                    isExpertStartedSession: true,
                    videoSessionStartTime: new Date(),
                });
                self.state.sessionObj.publish(self.state.publisherObj);
                self.startTimer();
                
            }
        });
        
        session.on('signal:video_session_end', function(event){
            if(event.from.id != session.connection.connectionId){
                console.log('*** Signal sent from connection '+ event.from.id);
                console.log('signal:video_session_end');
            }
        });
        
        session.on('streamCreated', function(event) {

          //console.log('streamCreated'+ event.stream.connection.connectionId );
            if(event.stream.connection.connectionId == session.connection.connectionId){
                console.log('*** streamCreated same connectiond id ***');
            } else {
                console.log('*** streamCreated different connectiond id ***');
            }

          var subContainer = document.createElement('div');

          subContainer.id = 'stream-' + event.stream.streamId;

          document.getElementById('subscribers').appendChild(subContainer);

          $('#'+subContainer.id+' .OT_root').append('<button id="end-btn-'+event.stream.streamId+'" class="stream stream-end-btn">End Button</button>');

          // store the stream object for later use
          //streams[event.stream.streamId] = event.stream;
          console.log(event.stream);
          //this.state.streams.push(event.stream);

          //var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)', insertMode: 'append'}
          var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)'}
          //var subscriber = session.subscribe(event.stream, subContainer,options, function(error) {
            var subscriber = session.subscribe(event.stream, 'subscribers' ,options, function(error) {
            if (error) {
              console.log(error.message);
              return;
            }
            if (subscriber.stream.hasVideo) {
              var imgData = subscriber.getImgData();
              if(!imgData){
                  subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
              }
              subscriber.setStyle('backgroundImageURI', imgData);
            } else {
              subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
            }
          });
        })
        .on('streamDestroyed', function(event){
//            if(event.stream.connection.connectionId == session.connection.connectionId){
//                console.log('*** streamDestroyed same connectiond id ***');
//            } else {
//                console.log('*** streamDestroyed different connectiond id ***');
//            }


            if(session.connection.connectionId != event.stream.connection.connectionId){
                self.state.sessionObj.disconnect();
                    self.setState({
                        sessionStartEndBtn: 'start'
                    });
                    self.stopTimer();

                    if(self.state.currentUser){
                      self.setState({role:self.state.currentUser.role})
                        if(self.state.currentUser.role == 'User'){
                            
                            
                    
                            self.setState({
                                showUserReviewModal: true,
                                videoSessionEndTime: new Date(),
                                isShowingInfoAlert: true,
                                infoAlertText: 'Expert has ended session!'
                            });

                            $('.wrapper').addClass('blur_page');
                            
                            
                          /***** payment video session : START ******/
                          
                          console.log('payment video session start');
                          
                            var startTime = self.state.videoSessionStartTime; 
                            var endTime = self.state.videoSessionEndTime; 
                            var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
                            var resultInMinutes = Math.round(difference / 60000);
                            
                            resultInMinutes = resultInMinutes ? resultInMinutes : 1;
                          
                            var customer_id = self.state.currentUser.customerId;
                            var userEmail = self.state.currentUser.email;
                            var amount = resultInMinutes;
                            var stripe_connect_id = self.state.expert_stripe_id;
                            axios.post(`${API_URL}/videosession/payment-video-session`, { customer_id, userEmail, amount, stripe_connect_id })
                            //axios.get(`${API_URL}/getExpertDetail/${slug}`)
                                        .then(res => {

                          var startTime = self.state.videoSessionStartTime; 
                          var endTime = self.state.videoSessionEndTime; 
                          var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
                          var resultInMinutes = Math.round(difference / 60000);
                            
                          resultInMinutes = resultInMinutes ? resultInMinutes : 1;
                          var customer_id = self.state.currentUser.customerId;
                          var userEmail = self.state.currentUser.email;
                          var amount = resultInMinutes;
                          var stripe_connect_id = self.state.expert_stripe_id;
                          axios.post(`${API_URL}/videosession/payment-video-session`, { customer_id, userEmail, amount, stripe_connect_id })
                            .then(res => {

                                            console.log('*** payment video session : success '+ JSON.stringify(res.data));
                                        })
                                        .catch(err => {
                                            console.log('*** payment video session : error '+ JSON.stringify(err));
                                        });

                          console.log('payment video session end');
                            
                          /****** payment video session : END ********/ 
                            
                            
                            
                            
//                            self.setState({
//                                showUserReviewModal: true,
//                                isShowingInfoAlert: true,
//                                infoAlertText: 'Expert has ended session!'
//                                
//                            });
//
//                            $('.wrapper').addClass('blur_page');
//                            
//                            
//                          /***** payment video session : START ******/
//                          
//                          console.log('payment video session start');
//                          
//                            var customer_id = self.state.currentUser.customerId;
//                            var userEmail = self.state.currentUser.email;
//                            var amount = 20;
//                            var stripe_connect_id = self.state.expert_stripe_id;
//                            axios.post(`${API_URL}/videosession/payment-video-session`, { customer_id, userEmail, amount, stripe_connect_id })
//                            //axios.get(`${API_URL}/getExpertDetail/${slug}`)
//                                        .then(res => {
//                                            console.log('*** payment video session : success '+ JSON.stringify(res.data));
//                                        })
//                                        .catch(err => {
//                                            console.log('*** payment video session : error '+ JSON.stringify(err));
//                                        });
//                          console.log('payment video session end');
//                            
//                          /****** payment video session : END ********/  
                            

                          /****** payment video session : END ********/ 

                        }
                        else if(self.state.currentUser.role == 'Expert'){
                            //alert('session closed by user');
                            self.setState({
                                showUserReviewModal: true,
                                isShowingInfoAlert: true,
                                infoAlertText: 'You have ended the session!'
                                
                            });

                            $('.wrapper').addClass('blur_page');
                        } else {
                            browserHistory.push('/');
                        } 
                    }
                    
                    console.log('streamDestroyed: '+event.reason+' - '+slug);
                    socket.emit('expert user disconnected', slug);
            }

            
        }).on('connectionCreated', function (event) {
            connectionCount = connectionCount+1;
            if (event.connection.connectionId != session.connection.connectionId) {
              console.log('Another client connected. ' + connectionCount + ' total.');
            }
        })
        .on('connectionDestroyed', function connectionDestroyedHandler(event) {
            connectionCount = connectionCount-1;
            
        })
        .on('sessionDisconnected', function(e){
            console.log('*** sessionDisconnected ***');
            self.stopTimer();
            self.setState({
                sessionStartEndBtn: 'start'
            });

            if(self.state.currentUser){
                if(self.state.currentUser.role == 'User'){
                    
                            self.setState({
                                showUserReviewModal: true,
                                videoSessionEndTime: new Date(),
                            });

                            $('.wrapper').addClass('blur_page');
                            
                            
                          /***** payment video session : START ******/
                          
                          console.log('payment video session start');
                          
                            var startTime = self.state.videoSessionStartTime; 
                            var endTime = self.state.videoSessionEndTime; 
                            var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
                            var resultInMinutes = Math.round(difference / 60000);
                            
                            resultInMinutes = resultInMinutes ? resultInMinutes : 1;
                          
                            var customer_id = self.state.currentUser.customerId;
                            var userEmail = self.state.currentUser.email;
                            var amount = resultInMinutes;
                            var stripe_connect_id = self.state.expert_stripe_id;
                            axios.post(`${API_URL}/videosession/payment-video-session`, { customer_id, userEmail, amount, stripe_connect_id })

                            //axios.get(`${API_URL}/getExpertDetail/${slug}`)

                                        .then(res => {
                                            console.log('*** payment video session : success '+ JSON.stringify(res.data));
                                        })
                                        .catch(err => {
                                            console.log('*** payment video session : error '+ JSON.stringify(err));
                                        });
                          console.log('payment video session end');
                            
                          /****** payment video session : END ********/ 
                }
                else if(self.state.currentUser.role == 'Expert'){
                    self.setState({
                        showUserReviewModal: true,
                    });

                    $('.wrapper').addClass('blur_page');
                } else {
                   browserHistory.push('/');
                } 
            } 

        }).on("signal:user_session_connected", function(event) {
            //console.log("Signal sent from connection " + event.from.id + event.data);
            if(event.from.id != session.connection.id){
                var data = JSON.parse(event.data);
                var seconds = data.seconds;
                var connected_username = data.connected_username;
                var connected_useremail = data.connected_useremail;
                self.setState({
                    seconds: parseInt(data.seconds),
                    isShowingInfoAlert: true,
                    infoAlertText:  connected_username + ' joined your session',
                    connected_username: connected_username
                });

                var todayDate = new Date();
                todayDate = todayDate.getDate()+"/"+todayDate.getMonth()+"/"+todayDate.getFullYear();
                self.state.sessionDate = todayDate ;
                let timeLeftVar = self.secondsToTime(self.state.seconds);
                self.setState({
                    time: timeLeftVar
                });
            }
           })
         .on('sessionConnected', function(e){
             
            if(self.state.currentUser){
                if(self.state.currentUser.role == 'User'){
                    var data = {
                        seconds: self.state.seconds,
                        connected_username: self.state.currentUser.firstName + ' ' + self.state.currentUser.lastName,
                        connected_useremail: self.state.currentUser.email
                    }
                    session.signal({
                        type: 'user_session_connected',
                        data: JSON.stringify(data)
                    }, function(error){
                        if (error) {
                           console.log("signal error ("
                                        + error.name
                                        + "): " + error.message);
                         } else {
                           console.log("signal sent."+self.state.seconds);
                         }
                    });
                }
            }
             
             
             
         })
        .on('streamDestroyed', function(event) {
//          console.log('streamDestroyed: '+event.reason+' - '+slug);
//          socket.emit('expert user disconnected', slug);
        })
        .connect( this.state.apiToken, function(error) {
          if (error) {
            if (error.code === 1010) {
              $('#publisher').html('<div class="alert alert-danger">Alas! You are not connected to the internet. Check your network connection. <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
            }else if (error.code === 1004) {
              $('#publisher').html('<div class="alert alert-danger">Alas! Session Expired, Please recharge your account to restart session! <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
            }
          } else {
            console.log('connected');
            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
            var publisher = OT.initPublisher('45801242', 'publisher',{width:'100%', height:'603px'});
            //session.publish(publisher);
            self.setState({
                publisherObj: publisher
            });
            $('.session-page-container').show();
            $('.loader-center-ajax').hide();
            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
                $('.Chating_msg_Here').animate({
//                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
                      scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")

                });
                
                
          }
        });
        //this.inputElement.click();
        this.setState({showEndCallOptions: true });
        //this.startTimer();

	  }).catch(err => {
      if(err){
        this.setState({errorSessionMessage : "<div class='alert alert-danger'>Session is not active from Expert end. Please try again later.</div>" });
      }
    });
    
   console.log('Customer id '+ this.state.currentUser.customerId) ;
   console.log('Stripe connect id '+ this.state.currentUser.stripe_connect_id) ;
          
	}

  getClassName(sender,loggedInUser){
    if(sender == loggedInUser){
      return "me "+loggedInUser+" - "+sender;
    }else{
      return "you "+loggedInUser+" - "+sender;
    }
  }

  renderInbox() {
    const currentUser = cookie.load('user');
    const moment = require('moment');
    if (this.props.messages) {
      return (
        <ul>
            {this.props.messages.map(data =>
              <li className={this.getClassName(data.messageSenderEmail,currentUser.email)}>
                <span className="message-body">
                {emojify(data.message)}
                  
                </span>
                <div className="session-msg-date">{moment(data.messageTime).fromNow()}</div>
              </li>
            )}
        </ul>
      );
    }
  }

/*
 * Author: Mohit
 */

//  secondsToTime(secs){ 
//    let hours = Math.floor(secs / (60 * 60));
//    let divisor_for_minutes = secs % (60 * 60);
//    let minutes = Math.floor(divisor_for_minutes / 60);
//    let divisor_for_seconds = divisor_for_minutes % 60;
//    let seconds = Math.ceil(divisor_for_seconds);
//    let obj = { "h": hours, "m": minutes, "s": seconds };
//    return obj;
//  }

/*
 * Author: Avadhesh
 */
secondsToTime(secs){
    var totalSeconds = secs;
    var hours   = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    
    // round seconds
    seconds = Math.round(seconds * 100) / 100;
    
    let obj = { "h": hours, "m": minutes, "s": seconds };
    return obj;
    
    
  }

  startTimer() {
//    if (this.timer == 0) {
//      this.timer = setInterval(this.countDown, 1000);
//      this.state.refreshIntervalId = this.timer;
//    }
        
      if(!this.state.refreshIntervalId){
        this.state.refreshIntervalId = setInterval(this.countDown, 1000);
      }

  }
  stopTimer(){
      clearInterval(this.state.refreshIntervalId);
      this.setState({
          refreshIntervalId: ''
      });
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  redAlertTiming(minutes) {
    if(minutes <= this.props.redAlert && this.state.time.h == 0)
    return Object.assign(
      {'-webkit-animation':'shake 0.1s ease-in-out 0.1s infinite alternate', 'color':'#FF0000'}
    );
  }

  disconnect(e) {
    
    e.preventDefault();
    if(this.state.currentUser){
        if(this.state.currentUser.role == 'User'){ // user ended the session
            this.state.sessionObj.signal({ type: 'video_session_end', data: 'video call session end by user' }, function(err){
                if(err){
                    console.log('*** video session end by user : ERROR ***'+ JSON.stringify(err) );
                } else {
                    console.log('*** video session end by user : SUCCESS ***');
                }
            });
            
        } else { // expert ended the session
            this.state.sessionObj.signal({ type: 'video_session_end', data: 'video call session end by expert' }, function(err){
                if(err){
                    console.log('*** video session end by expert: ERROR ***'+ JSON.stringify(err) );
                } else {
                    console.log('*** video session end by expert: SUCCESS ***');
                }
            });
        } 
    } 
    this.state.sessionObj.disconnect();
    
  }
  
  dismissAlert(){
      console.log('*** dismissAlert ***');
      this.setState({
          isShowingInfoAlert: false
      });
  }
  
  startVideoSession(e){
      e.preventDefault();
      console.log('start video session');
      const self = this;
      
      this.state.sessionObj.signal({ type: 'video_session_start', data: 'session started by expert' }, function(err){
          if(err){
              console.log('*** signal error ('+ err.name + '): '+ err.message);
          } else{
              self.state.sessionObj.publish(self.state.publisherObj);
              console.log('*** signal sent ***');
          }
      });
      
      this.startTimer();
      this.setState({
          sessionStartEndBtn: 'end',
          //isShowingInfoAlert: true
      });
      // to notify admin thata a new session has been started
      socket.emit('admin new expert session starting', {});
  }
  
  onSubmitReview(){
    var self = this;
    
    setTimeout(function(){
        self.setState({
            showUserReviewModal: false
        });
        browserHistory.push('/');
        $('.wrapper').removeClass('blur_page');
    }, 2000);
    
    
    
  }
  
  showSessionCallBtn(){
      
      if(this.state.currentUser.role == 'Expert'){
          return(
            this.state.sessionStartEndBtn == 'start' ? <li className="video_session_call_btn start_video_session_call"><Link to="#" data-toggle="tooltip" title="Start Session"  onClick={ e => this.startVideoSession(e)}></Link></li> : <li className="video_session_call_btn end_video_session_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={this.disconnect.bind(this)}></Link></li>
          );
      }
      if(this.state.currentUser.role == 'User') {
          return(
            this.state.isExpertStartedSession  ?  <li className="video_session_call_btn end_video_session_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={this.disconnect.bind(this)}></Link></li> : <li><Link to="#" style={{ visibility: 'hidden' }} ></Link></li>
          );
      }
      
      
  }

  render() {
    const currentUser = cookie.load('user');
    var controller = this.props.messagesController;
    const { handleSubmit } = this.props;

    return (
      <div className="session-page">
        <Loader/> 
        <UserReview onSubmitReview={ this.onSubmitReview.bind(this) } expertSlug={this.props.params.slug} showUserReviewModal={ this.state.showUserReviewModal } reviewBy={this.state.currentUser.role} />
        
        <div className="container-fluid session-page-container" style={{display: 'none' }}>
          <div className="row">
            <section>
              <div dangerouslySetInnerHTML={{__html: this.state.errorSessionMessage}} />
            	<div className="mainContainer">
            		<div className="Left_Panel">
            			<div className="Conversation">
            				<h6>Conversation</h6>
            				<a href="javascript:void()" className="Hide_Left_panel"><i className="fa fa-times" aria-hidden="true"></i></a>
            			</div>
                  <div className="Chat_Main_section">
                      <div className="Chating_msg_Here">

                        { this.renderInbox() }
                      
                      </div>
                      <div className="typeMessage">
                      { this.state.currentUser.role == 'Expert' &&   <ExpertReplyMessage sessionOwnerUsername={this.props.params.slug} messageReceiverEmail={this.state.connected_useremail} messageSenderEmail={currentUser.email}/>}
                      { this.state.currentUser.role == 'User' &&   <ExpertReplyMessage sessionOwnerUsername={this.props.params.slug} messageReceiverEmail={this.state.expert.email} messageSenderEmail={currentUser.email}/>}
                      </div>
                  </div>
                  <SessionWhiteboard/>
            		</div>
          		  <div className="Right_Panel">
            			<div className="Client_image">
            				<div className="innerm">
                      <div id="subscribers" className="chatHead chatHeadLeader"></div>
                      { this.state.showEndCallOptions ? null : <Loader/> }
                      <div id="publisher"></div>
            					<div className="upperimageName">
                        <div className="text-left-detail"><i className="fa fa-user-o" aria-hidden="true"></i> {this.state.firstName} {this.state.lastName}</div>
                        <div className="text-right-detail"></div>
                      </div>
            				</div>
            			</div>

            			<div className="footer_action_btns">
                    <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalWaitingToJoin" class="btn btn-primary btn_waitingtojoin"></a>
            				<ul>
            					<li className="Chat_Trigger">
                        <a data-toggle="tooltip" title="Conversation" href="javascript:void(0)"><i className="fa fa-commenting" aria-hidden="true"></i></a>
                      </li>
                      <li className="WhiteBoard_Trigger">
                        {/*}<a data-toggle="modal" data-target="#myWhiteBoard" class="btn btn-primary btn_waitingtojoin"></a>{*/}
                        <a data-toggle="tooltip" title="White Board" href="javascript:void(0)"><i className="fa fa-pencil" aria-hidden="true"></i></a>
                      </li>
                      
                        { this.showSessionCallBtn() }
                        {/* this.state.sessionStartEndBtn == 'start' ? <li className="video_session_call_btn start_video_session_call"><Link to="#" data-toggle="tooltip" title="Start Session"  onClick={ e => this.startVideoSession(e)}></Link></li> : <li className="video_session_call_btn end_video_session_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={this.disconnect.bind(this)}></Link></li> */}
                        
                        
                      {/* this.state.showEndCallOptions ? <li className="phone_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={this.disconnect.bind(this)}><i className="fa fa-phone"></i></Link></li> : null */}
                      <li className="clockicon" style={this.redAlertTiming(this.state.time.m)}><a data-toggle="tooltip" title="Session Time" href="javascript:void(0)"><i className="fa fa-clock-o" aria-hidden="true"></i> {this.state.sessionDate} - {this.state.time.h} : {this.state.time.m} : {this.state.time.s}</a></li>
                      { /* }
            					<li className="video_call"><a href="#"><i className="fa fa-video-camera" aria-hidden="true"></i></a></li>
            					<li className="microphone"><a href="#"><i className="fa fa-microphone" aria-hidden="true"></i></a></li>
            					<li className="phone_call"><a href="#"><i className="fa fa-phone" aria-hidden="true"></i></a></li>

            					<li className="ellipsismore"><a href="#"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></a></li>
                      { */ }
            				</ul>
                                        
                        
                        <AlertContainer position="top-right" >
                            {this.state.isShowingInfoAlert ? (
						<Alert timeout={5000} onDismiss={ this.dismissAlert.bind(this) } type="info" headline="Session Info">
                                                    { this.state.infoAlertText }
						</Alert>
					) : null}
                        </AlertContainer>
                                
                                
            			</div>
            		</div>
            	</div>
            </section>
          </div>
        </div>
        {/* myModalWaitingToJoin start here */}
        <div id="myModalWaitingToJoin" className="modal fade continueshoppingmodal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content alert alert-danger">
              <div className="modal-header text-center">
                  <h4 className="modal-title">Waiting for user to join!</h4>
              </div>
              <div className="modal-body text-center">
                  <p>No one has joined your session yet, once any user will join the session, timer will initiate!</p>
              </div>
            </div>
          </div>
        </div>
        {/* myModalWaitingToJoin end here */}
        {/* myModalExtendSession for email start here */}
         <div id="myModalExtendSession" className="modal fade continueshoppingmodal" role="dialog">
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">×</button>
                  <h4 className="modal-title">Send Email</h4>
               </div>
               <div className="modal-body">
                 <p className="text-center"> Recharge your account to start session! </p>
                 <table className="table table-hover">
                    <tbody>
                        <tr>
                            <form>
                              <div className="row form-group">
                                <div className="col-md-12">
                                  <label>Time</label>
                                  <select className="form-control" name="sessionExtendTime">
                                    <option value="30">30 Minutes</option>
                                    <option value="60">1 Hour</option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group">
                                <i>Note: Transaction will process automatically in backend!</i>
                              </div>
                              <div class="form-group">
                                <button type="submit" className="btn btn-primary">Pay Now!</button>
                                &nbsp;
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                              </div>
                            </form>
                        </tr>
                    </tbody>
                 </table>{/*end of table*/}
               </div>{/*end of modal body*/}
             </div>
           </div>
         </div> {/* myModalExtendSession for email end here */}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    content: state.auth.content,
    messages: state.communication.messages
  };
}

SessionPage.defaultProps = { redAlert: 5 }

export default connect(mapStateToProps, { protectedTest, FetchExpertConversation, ExpertSessionUserDisconnected })(SessionPage);
