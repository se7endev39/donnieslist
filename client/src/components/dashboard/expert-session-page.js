import React, { Component } from 'react';
import { Link, IndexLink, browserHistory  } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler, tokBoxApikey, Image_URL } from '../../actions/index';
import { protectedTest } from '../../actions/auth';
import $ from 'jquery'
import axios from 'axios';
import { Modal, Button, Panel } from 'react-bootstrap';

import { FetchExpertConversation,ExpertSessionUserDisconnected } from '../../actions/messaging';
import { saveVideoSessionInfo } from '../../actions/videosession';
import * as actions from '../../actions/messaging';
import ExpertReplyMessage from './expert-reply-message';
import io from 'socket.io-client';
const socket = actions.socket;
import Loader from './loader';
import SessionWhiteboard from './session-whiteboard';
import UserReview from './user-review';
import ErrorExpertNotActive from './error-expert-not-active';
import { AlertList, Alert, AlertContainer } from "react-bs-notifier";

import {emojify} from 'react-emojione';

class SessionPage extends Component {
  constructor(props) {
    super(props);
    // this.props.FetchExpertConversation(this.props.params.slug);
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
      showErrorExpertNotActiveModal: false,
      errorExpertNotActiveModalData: '',
      sessionStartEndBtn: 'start',
      isShowingInfoAlert: false,
      infoAlertText: '',
      isExpertStartedSession: false,
      refreshIntervalId: '',
      expert_stripe_id: '',
      connected_username: '',
      connected_useremail: '',
      connected_userimage: '',
      videoSessionStartTime: '',
      videoSessionEndTime: '',
      sessionEndBy: '', // user, expert
      reviewModalData: {
          sessionPaymentAmount: 0,
          name: '',
          image: '',
          icon_classname: '',
      },
      video_session_id: '',
      blurChatAreaStatus:true,
      blurChatAreaStatusMessage:'',
      videoDisableWarning: false,
      videoDisabled: false,
      subscriber: null,      
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer  = this.stopTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.disconnectOT = this.disconnect.bind(this);
    this.props.protectedTest();

    $(document).ready(function(){
       jQuery('.Chat_Trigger').click(function() {
            jQuery("body").toggleClass('OpenChatList');
        });
        jQuery(document).on('click','.Hide_Left_panel',function(){
          jQuery("body").toggleClass('OpenChatList');
        });
        jQuery(document).on('click','.WhiteBoard_Trigger a,.whiteBoard_close',function(){
          jQuery("body").toggleClass('OpenWhiteBoard');
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
        // console.log("***** expert_stripe_id "+this.state.expert_stripe_id)
        // console.log(res.data[0])
      })
      .catch(err => {});
          
        // set current user cookie
    this.state.currentUser = cookie.load('user');
    this.startVideoSession = this.startVideoSession.bind(this);
  }

  handleFormSubmit(formProps) {
    console.log('handleFormSubmit');
  }

  componentDidMount() {

    const _this = this;
    setTimeout(function(){
      var g = $(".emojionearea-editor")[0]
      if (g == undefined || g == null){
        location.reload()
      }
    },1000)


    const self = this;  
    const currentUser = cookie.load('user');
    //console.log('~~~~~~ currentUser: ',currentUser)
    var expertSlug = this.props.params.slug,//"avadhesh_bhatt@rvtechnologies.co.in",
        userEmail = currentUser.email,
        userSlug = currentUser.slug,
        slug = this.props.params.slug,
        sessionOwner = false;
    if(userSlug === expertSlug){
      sessionOwner = true;
    }

    axios.post(`${API_URL}/createVideoSession`, { expertSlug, userEmail, sessionOwner })
      .then(res => {
               //console.log('*** createVideoSession ***');      
        if(res){
          //console.log('~~~~~~~~~~~ res: ',res);
          if(res.data.err && res.data.err_code == 'expert_session_inactive'){
            this.setState({
              showErrorExpertNotActiveModal: true,
              errorExpertNotActiveModalData : res.data.err
            });
          }
        }

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
                    sessionStartEndBtn: 'end',
                    videoSessionStartTime: new Date(),
                });
                self.state.sessionObj.publish(self.state.publisherObj);
                self.startTimer();
                
                /****************** save video session info in the database : START *********************/
                
                try{
                    const expertEmail = self.state.expert.email;  //default initial time is 30 minutes
                    const userEmail = self.state.currentUser.email;
                    const sessionCreationDate = self.state.videoSessionStartTime;
                    
                    self.props.saveVideoSessionInfo({ expertEmail, userEmail, sessionCreationDate }).then(
                      (response)=>{
                        console.log('saveVideoSessionInfo response: '+JSON.stringify(response));
                        self.setState({
                            video_session_id: response.video_session_id
                        });
                      },
                      (err) => err.response.json().then(({errors})=> {
                        console.log('saveVideoSessionInfo err: '+JSON.stringify(err));
                      })
                    )
                  }catch(e){
                     console.log('saveVideoSessionInfo catch error '+e.message);
                  }
                    
                
                /****************** save video session info in the database : END *********************/
                
                
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
          let localStream = false;
            if(event.stream.connection.connectionId == session.connection.connectionId){
              localStream = true;
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
          console.log('event.stream');
          //console.log(event.stream);
          //this.state.streams.push(event.stream);

          //var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)', insertMode: 'append'}
            //var options = {width: 200, height: 200, 'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)'};
            var optionsSubscriber = {
              insertMode: "append",
              style: {
                nameDisplayMode: 'on',
              }
            };
          
            var subscriber = session.subscribe(event.stream, 'subscribers' ,optionsSubscriber, function(error) {
              if (error) {
                console.log(error.message);
                return;
              }
              if (subscriber.stream.hasVideo) {
                // var imgData = subscriber.getImgData();
                // if(!imgData){
                //     subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
                // }
                // subscriber.setStyle('backgroundImageURI', imgData);
              } else {
                // subscriber.setStyle('backgroundImageURI','https://donnieslist.com/src/public/img/mini-user-dummy.png');
              }
            });

          subscriber.on('videoDisableWarning', function(e) {
            const subImg = subscriber.getImgData();
            subscriber.setStyle('backgroundImageURI', subImg);
            self.setState({
              videoDisableWarning: true,
            });
          });
          subscriber.on('videoDisableWarningLifted', function(e) {
            self.setState({
              videoDisableWarning: false,
            });
          });
          subscriber.on('videoDisabled', function(e) {
            self.setState({
              videoDisabled: true,
            });
          });
          subscriber.on('videoEnabled', function(e) {
            self.setState({
              videoDisabled: false,
            });
          });
          self.setState({ subscriber });
        })
        .on('streamDestroyed', function(event){
          console.log('~~~~~~ streamDestroyed');
            if(session.connection.connectionId != event.stream.connection.connectionId){
                self.setState({
                        sessionStartEndBtn: 'start',
                        sessionEndBy: 'expert'
                    });
                self.state.sessionObj.disconnect();
                self.stopTimer();
                    if(self.state.currentUser){
                      self.setState({role:self.state.currentUser.role})
                        if(self.state.currentUser.role == 'User'){
                            
                            self.setState({
                                videoSessionEndTime: new Date()
                            });
                            
                          /***** payment video session : START ******/
                          var startTime = new Date(self.state.videoSessionStartTime); 
                          var endTime = new Date(self.state.videoSessionEndTime); 
                          var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
                          var resultInMinutes = Math.ceil(difference / 60000);
                          
                          resultInMinutes = resultInMinutes ? resultInMinutes : 1;
                          var customer_id = self.state.currentUser.customerId;
                          var userEmail = self.state.currentUser.email;
                          var expertEmail = self.state.expert.email;
                          var amount = resultInMinutes;
                          var video_session_id = self.state.video_session_id;
                          var videoSessionDuration = Math.round(difference / 1000); // in seconds
                          
                          var stripe_connect_id = self.state.expert_stripe_id;
                          var userName = self.state.currentUser.firstName + ' ' + self.state.currentUser.lastName;
                          var expertName = self.state.expert.profile.firstName + ' ' + self.state.expert.profile.lastName;
                          var userImage =  self.state.currentUser.profileImage ?  Image_URL+self.state.currentUser.profileImage : CLIENT_ROOT_URL+'/src/public/img/profile.png';
                          var expertImage =  self.state.expert.profileImage ?  Image_URL+self.state.expert.profileImage : CLIENT_ROOT_URL+'/src/public/img/profile.png';
                            axios.post(`${API_URL}/videosession/payment-video-session`, { customer_id, userEmail, amount, stripe_connect_id, video_session_id, videoSessionDuration, expertEmail, userName, expertName, userImage, expertImage })
                            .then(res => {
                                            console.log('*** payment video session : success '+ JSON.stringify(res.data)+ ' amount '+amount);
                                            self.setState({
                                                showUserReviewModal: true,
                                                //videoSessionEndTime: new Date(),
                                                isShowingInfoAlert: true,
                                                infoAlertText: 'Expert has ended session!',
                                                reviewModalData: {
                                                    sessionPaymentAmount: amount,
                                                    name: self.state.expert.profile.firstName + ' '+ self.state.expert.profile.lastName,
                                                    image: expertImage,
                                                    icon_classname: 'fa fa-graduation-cap',
                                                    rate_your_text: 'Rate Your Session'
                                                },
                                                
                                            });

                                            $('.wrapper').addClass('blur_page');
                                        })
                                        .catch(err => {
                                            console.log('*** payment video session : error '+ JSON.stringify(err));
                                        });
                          /****** payment video session : END ********/ 
                        }else if(self.state.currentUser.role == 'Expert'){
                            //alert('session closed by user');
                            self.setState({
                                showUserReviewModal: true,
                                isShowingInfoAlert: true,
                                infoAlertText: 'You have ended the session!',
                                reviewModalData: {
                                    name: self.state.connected_username,
                                    image: self.state.connected_userimage,
                                    icon_classname: 'fa fa-user',
                                    rate_your_text: 'Rate your user'
                                }
                                
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
              //const currentUser = cookie.load('user');
              //console.log('%%%%%%%%%%%%% currentUser: ',currentUser);
              if(self.state.currentUser){
                if(self.state.currentUser.role == 'User'){
                    //console.log('~~~~event: ',event);
                    self.setState({
                        isShowingInfoAlert: true,
                        blurChatAreaStatus:false,
                        blurChatAreaStatusMessage:'Waiting for Expert to connnect!',
                        infoAlertText:  'Expert is online, chat feature is available now'
                    });
                }else{
                    self.setState({
                        blurChatAreaStatus:false,
                        blurChatAreaStatusMessage:'Waiting for User to connnect!'
                      });
                }
              }
             // self.setState({});
            }
        })
        .on('connectionDestroyed', function connectionDestroyedHandler(event) {
            console.log('connectionDestroyed. ' + connectionCount);
            connectionCount = connectionCount-1;
            let connectionDestroyer = 'User';
            if(self.state.currentUser.role == 'User'){
              connectionDestroyer = 'Expert';
            }
            self.setState({
                isShowingInfoAlert: true,
                infoAlertText:  'Alas, '+connectionDestroyer+' left the session page.',
                blurChatAreaStatus:true,
                blurChatAreaStatusMessage:'Waiting for '+connectionDestroyer+' to connnect!'
            });
        })
        .on('sessionDisconnected', function(e){
            console.log('*** sessionDisconnected ***');
            self.stopTimer();
            self.setState({
                sessionStartEndBtn: 'start',
            });

            if(self.state.currentUser){
                if(self.state.currentUser.role == 'User'){
                    
                            if(self.state.sessionEndBy != 'expert'){
                                self.setState({
                                    videoSessionEndTime: new Date()
                                });

                              /***** payment video session : START ******/
                              var startTime = new Date(self.state.videoSessionStartTime); 
                              var endTime = new Date(self.state.videoSessionEndTime); 
                              var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
                              var resultInMinutes = Math.ceil(difference / 60000);

                              resultInMinutes = resultInMinutes ? resultInMinutes : 1;
                              var customer_id = self.state.currentUser.customerId;
                              var userEmail = self.state.currentUser.email;
                              var expertEmail = self.state.expert.email;
                              var amount = resultInMinutes;
                              var video_session_id = self.state.video_session_id;
                              var videoSessionDuration = Math.round(difference / 1000); // in seconds

                              var stripe_connect_id = self.state.expert_stripe_id;
                              var userName = self.state.currentUser.firstName + ' ' + self.state.currentUser.lastName;
                              var expertName = self.state.expert.profile.firstName + ' ' + self.state.expert.profile.lastName;
                              
                              var userImage =  self.state.currentUser.profileImage ?  Image_URL+self.state.currentUser.profileImage : CLIENT_ROOT_URL+'/src/public/img/profile.png';
                              var expertImage =  self.state.expert.profileImage ?  Image_URL+self.state.expert.profileImage : CLIENT_ROOT_URL+'/src/public/img/profile.png';
                            axios.post(`${API_URL}/videosession/payment-video-session`, { customer_id, userEmail, amount, stripe_connect_id, video_session_id, videoSessionDuration, expertEmail, userName, expertName, userImage, expertImage })
                                .then(res => {
                                                console.log('*** payment video session : success '+ JSON.stringify(res.data)+ ' amount '+amount);
                                                self.setState({
                                                    showUserReviewModal: true,
                                                    //videoSessionEndTime: new Date(),
                                                    isShowingInfoAlert: true,
                                                    infoAlertText: 'Expert has ended session!',
                                                    reviewModalData: {
                                                        sessionPaymentAmount: amount,
                                                        name: self.state.expert.profile.firstName + ' '+ self.state.expert.profile.lastName,
                                                        image: expertImage,
                                                        icon_classname: 'fa fa-graduation-cap',
                                                        rate_your_text: 'Rate Your Session'
                                                    },

                                                });

                                                $('.wrapper').addClass('blur_page');
                                            })
                                            .catch(err => {
                                                console.log('*** payment video session : error '+ JSON.stringify(err));
                                            });
                              /****** payment video session : END ********/ 
                            }
                          
                }
                else if(self.state.currentUser.role == 'Expert'){
                    self.setState({
                        showUserReviewModal: true,
                        reviewModalData: {
                            name: self.state.connected_username,
                            image: self.state.connected_userimage,
                            icon_classname: 'fa fa-user',
                            rate_your_text: 'Rate your user'
                        },
                    });

                    $('.wrapper').addClass('blur_page');
                } else {
                   browserHistory.push('/');
                } 
            } 

        }).on("signal:user_session_connected", function(event) {
            //console.log("Signal sent from connection " + event.from.id + event.data);
            if(event.from.id != session.connection.id){

                console.log('~~~~~~~~~~ ~~~~~~~ ~~~~~~~~ event: ',event);
                console.log('\n~~~~~~~~~~ ~~~~~~~ ~~~~~~~~ event.data: ',event.data);
                var data = JSON.parse(event.data);
                var seconds = data.seconds;
                var connected_username = data.connected_username;
                var connected_useremail = data.connected_useremail;
                var connected_userimage = data.connected_userimage;
                self.setState({
                    seconds: parseInt(data.seconds),
                    isShowingInfoAlert: true,
                    infoAlertText:  connected_username + ' is online, you can start session by clicking on call button.',
                    connected_username: connected_username,
                    connected_useremail: connected_useremail,
                    connected_userimage: connected_userimage,
                    blurChatAreaStatus:false,
                    blurChatAreaStatusMessage:'Waiting for User to connnect!'
                });

                self.props.FetchExpertConversation(self.props.params.slug,connected_useremail).then(
                    (res)=>{
                            $('.Chating_msg_Here').animate({
            //                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
                                  scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")

                            })
                    }
                  )


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
                        connected_useremail: self.state.currentUser.email,
                        connected_userimage: self.state.currentUser.profileImage ?  Image_URL+self.state.currentUser.profileImage : CLIENT_ROOT_URL+'/src/public/img/profile.png'
                    }
                    
                    if(cookie.load('selectMins')){
                        cookie.remove('selectMins', { path: '/' });
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
                    // var chatemail = 
                  self.props.FetchExpertConversation(self.props.params.slug, self.state.currentUser.email).then(
                    (res)=>{
                            $('.Chating_msg_Here').animate({
            //                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
                                  scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")

                            })
                    }
                  )
                }
            }
        })
        .connect( this.state.apiToken, function(error) {
          if (error) {
            console.log('~~~~~~~~~ error .connect: ',error);
            if (error.code === 1010) {
              $('#publisher').html('<div class="alert alert-danger">Alas! You are not connected to the internet. Check your network connection. <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
            }else if (error.code === 1004) {
              $('#publisher').html('<div class="alert alert-danger">Alas! Session Expired, Please recharge your account to restart session! <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalExtendSession" class="btn btn-primary"><i className="fa fa-handshake-o"></i> Extend Session Now!</a></div>');
            }
          } else {
            console.log('connected');

            var optionsPublisher = {
              name: _this.state.currentUser.firstName + ' ' + _this.state.currentUser.lastName,
              'z-index': 2,'box-shadow':'0 2px 12px 1px rgba(0,0,0,.89)'
            };
            const el = document.createElement('div');
            var publisher = OT.initPublisher(el, optionsPublisher);
            setTimeout(function() {
              $('#'+publisher.id + " " + ".OT_name").text('Me');
            }, 500);
            document.getElementById('subscribers').appendChild(el);
            self.setState({
                publisherObj: publisher,
                blurChatAreaStatus:true,
                blurChatAreaStatusMessage:'Waiting for User to connnect!'
            });
            $('.session-page-container').show();
            $('.loader-center-ajax').hide();
            //$('.Left_Panel').css('height',$('.mainContainer').height()+'px');
            $('.Chating_msg_Here').animate({
                  scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")

            });
                
                
          }
        });
        //this.inputElement.click();
        this.setState({showEndCallOptions: true });
        //this.startTimer();

    }).catch(err => {
      if(err){
        console.log('****** err: ',err);
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
    //const moment = require('moment');
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
    debugger;
    if(e){
      e.preventDefault();  
    }
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
            this.state.sessionStartEndBtn == 'start' ? <li className="video_session_call_btn start_video_session_call"><Link to="#" data-toggle="tooltip" title="Start Session"  onClick={ e => this.startVideoSession(e)}></Link></li> : <li className="video_session_call_btn end_video_session_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={ ()=> this.disconnectOT()}></Link></li>
          );
      }
      if(this.state.currentUser.role == 'User') {
          return(
            this.state.isExpertStartedSession  ?  <li className="video_session_call_btn end_video_session_call"><Link data-toggle="tooltip" title="End Session" to="javascript:void(0)" onClick={this.disconnect.bind(this)}></Link></li> : <li><Link to="#" style={{ visibility: 'hidden' }} ></Link></li>
          );
      }
  }

  componentWillUnmount(){
      //console.log('~~~~ componentWillUnmount: ',this);
      //this.state.sessionObj.disconnect();
      //window.sessionObj = this.state.sessionObj;
      //this.disconnectOT();
  }

  render() {
    const currentUser = cookie.load('user');
    var controller = this.props.messagesController;
    const { handleSubmit } = this.props;
    const { videoDisableWarning, subscriber } = this.state;
    if(videoDisableWarning && subscriber) {
      $("#" + subscriber.id + " video").addClass('blur');
      if($('.video-disconnect-error-container').length == 0) {
        $("#" + subscriber.id).append("<div class='video-disconnect-error-container'><div>Connection unstable</div></div>")        
      }
    } else if(subscriber) {
      $("#" + subscriber.id + " video").removeClass('blur');
      $(".video-disconnect-error-container").remove();
    }

    return (
      <div className="session-page">
        <Loader/> 
        <UserReview onSubmitReview={ this.onSubmitReview.bind(this) } reviewModalData={this.state.reviewModalData} expertSlug={this.props.params.slug} showUserReviewModal={ this.state.showUserReviewModal } reviewBy={this.state.currentUser.role} />
        <ErrorExpertNotActive errorExpertNotActiveModalData={this.state.errorExpertNotActiveModalData} expertSlug={this.props.params.slug} showErrorExpertNotActiveModal={ this.state.showErrorExpertNotActiveModal } />
        
        <div className="container-fluid session-page-container" style={{display: 'none' }}>
          <div className="row">
            <section>
              <div dangerouslySetInnerHTML={{__html: this.state.errorSessionMessage}} />
              <div className="mainContainer FullHeightSec">
                <div className="Left_Panel">
                  <div className={this.state.blurChatAreaStatus ? "Conversation cntrl_show" : "Conversation cntrl_hide"}>
                    <h6>Conversation</h6>
                    <a href="javascript:void(0)" className="Hide_Left_panel"><i className="fa fa-times" aria-hidden="true"></i></a>
                  </div>
                  <p className={this.state.blurChatAreaStatus ? "text-center chatarea_msg_show" : "text-center chatarea_msg_hide"}>{this.state.blurChatAreaStatusMessage} </p>
                  <div className={this.state.blurChatAreaStatus ? "Chat_Main_section chatarea_blur" : "Chat_Main_section"}>
                      <div className="Chating_msg_Here">

                        { this.renderInbox() }
                      
                      </div>
                      <div className="typeMessage">
                      { this.state.currentUser.role == 'Expert' &&   <ExpertReplyMessage sessionOwnerUsername={this.props.params.slug} messageReceiverEmail={this.state.connected_useremail} messageSenderEmail={currentUser.email} expertEmail={this.state.expert.email}/>}
                      { this.state.currentUser.role == 'User' &&   <ExpertReplyMessage sessionOwnerUsername={this.props.params.slug} messageReceiverEmail={this.state.expert.email} messageSenderEmail={currentUser.email} expertEmail={this.state.expert.email}/>}
                      </div>
                  </div>
                  <SessionWhiteboard/>
                </div>
                <div className="Right_Panel">
                  <div className="Client_image">
                    <div className="innerm">
                      <div id="subscribers"></div>
                      { this.state.showEndCallOptions ? null : <Loader/> }
                      <div id="publisher"></div>
                    </div>
                  </div>

                  <div className="footer_action_btns">
                    <a href="javascript:void(0)" data-toggle="modal" data-target="#myModalWaitingToJoin" className="btn btn-primary btn_waitingtojoin"></a>
                    <ul>
                      <li className={this.state.blurChatAreaStatus ? "Chat_Trigger cntrl_hide" : "Chat_Trigger cntrl_show"}>
                        <a data-toggle="tooltip" title="Conversation" href="javascript:void(0)"><i className="fa fa-commenting" aria-hidden="true"></i></a>
                      </li>
                      <li className={this.state.blurChatAreaStatus ? "WhiteBoard_Trigger cntrl_hide" : "WhiteBoard_Trigger cntrl_show"}>
                        {/*}<a data-toggle="modal" data-target="#myWhiteBoard" className="btn btn-primary btn_waitingtojoin"></a>{*/}
                        <a data-toggle="tooltip" title="White Board" href="javascript:void(0)"><i className="fa fa-pencil" aria-hidden="true"></i></a>
                      </li>
                      
                        {this.state.blurChatAreaStatus ? "" : this.showSessionCallBtn()}

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
            <Alert onDismiss={ this.dismissAlert.bind(this) } type="info" headline="Session Info">
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
                              <div className="form-group">
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

export default connect(mapStateToProps, { protectedTest, FetchExpertConversation, ExpertSessionUserDisconnected, saveVideoSessionInfo })(SessionPage);
