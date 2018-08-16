import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import moment from 'moment';
import ChatView from 'react-chatview';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import { protectedTest } from '../../actions/auth';
import $ from 'jquery'
import axios from 'axios';

import { FetchExpertConversation } from '../../actions/messaging';
import ExpertReplyMessage from './expert-reply-message';

import io from 'socket.io-client';
//var socket = io().connect();

//var socket = io.connect();

var Compose = React.createClass({
  render () {
    return (
        <div className="composition-area">
            <textarea
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={this.props.cursor.value} />
        </div>
    );
  },

  onChange(e) {
    this.props.cursor.set(e.target.value);
  },

  onKeyDown (e) {
    if (e.keyCode == 13) {
      console.log('enter pressed');
      e.preventDefault();
      this.props.sendMessage(this.props.cursor.value);
    }
  }
});

class SessionPage extends Component {
  constructor(props) {
    super(props);

    this.props.FetchExpertConversation(this.props.params.slug);

    this.state = {
      expert: "",
      firstName: "",
      lastName: "",
      apiKey: "",
      apiSecret: "",
      showEndCallOptions: "",
      loading: false,
      error: null,
      session: "",
      publisher: ""
    };

    this.state = { time: {}, seconds: 1800 };
    //this.state = { time: {}, seconds: 310 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    this.props.protectedTest();
		$(document).ready(function(){
		   jQuery('.Chat_Trigger').click(function() {
		        jQuery("body").addClass('OpenChatList');
		    });
		    jQuery(document).on('click','.Hide_Left_panel',function(){
		      jQuery("body").removeClass('OpenChatList');
		    });

        setTimeout(function(){
            jQuery("body").addClass('OpenChatList');
            //console.log( $('.mainContainer').height() );
            var mainContainerHeight = $('.mainContainer').height();
            $('.Left_Panel').css('height',mainContainerHeight+'px');
        },1200);
		});

    $(function () {
      console.log('session page dom loaded');
    });
  }

  renderInbox() {
    const currentUser = cookie.load('user');
    const moment = require('moment');
    //console.log('currentUser: '+JSON.stringify(currentUser));
    if (this.props.messages) {
      return (
        <ul>
            {this.props.messages.map(data =>
              <li className="me">
                <span className="message-body">
                  {data.message}
                </span>
                <div className="session-msg-date">{moment(data.messageTime).from(moment())}</div>
              </li>
            )}
        </ul>
      );
    }
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  callNowButtonClick(e){
    /*
    e.preventDefault();

    var userEmail = "mohit@gmail.com";
    var expertEmail = "rohit@gmail.com";
    axios.post(`${API_URL}/createVideoSession`, { expertEmail, userEmail })
		  .then(res => {
        this.setState({sessionId : res.data.session.sessionId });
        this.setState({apiKey : res.data.session.ot.apiKey });
        this.setState({apiSecret : res.data.session.ot.apiSecret });
		    this.setState({
		      expert,
		      loading: false,
		      error: null
		    });
		  })
		  .catch(err => {
		    // Something went wrong. Save the error in state and re-render.
		    this.setState({
		      loading: false,
		      error: err
		    });
  	});

    // Initialize an OpenTok Session object
    var session = TB.initSession(this.state.sessionId);

    // Initialize a Publisher, and place it into the element with id="publisher"
    var publisher = TB.initPublisher(this.state.apiKey, 'publisher',{width:700, height:400});
    // Attach event handlers
    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: function(event) {
        console.log('sessionConnected');
        // Publish the publisher we initialzed earlier (this will trigger 'streamCreated' on other
        // clients)
        session.publish(publisher);
      },

      // This function runs when another client publishes a stream (eg. session.publish())
      streamCreated: function(event) {

        // Create a container for a new Subscriber, assign it an id using the streamId, put it inside
        // the element with id="subscribers"
        var subContainer = document.createElement('div');
        subContainer.id = 'stream-' + event.stream.streamId;
        document.getElementById('subscribers').appendChild(subContainer);

        // Subscribe to the stream that caused this event, put it inside the container we just made
        session.subscribe(event.stream, subContainer);
      }
    });

    this.setState({ showEndCallOptions: true });
    */
  }

  componentWillMount() {
    //console.log('*** **** *** componentWillMount ');

    //jQuery("body").addClass('OpenChatList');

    var userEmail = "mohit@gmail.com";
    var expertEmail = "rohit@gmail.com";

    axios.post(`${API_URL}/createVideoSession`, { expertEmail, userEmail })
		  .then(res => {
        //console.log(JSON.stringify(res.data.session));
        this.state.session = TB.initSession(res.data.session.sessionId);

        //console.log('sessionId: '+res.data.session.sessionId);
        //console.log('apiKey: '+res.data.session.ot.apiKey);

        this.state.publisher = TB.initPublisher(res.data.session.ot.apiKey, 'publisher',{width:'100%', height:400},function(error) {
          if (error) {
            console.log('Publisher error : '+error);
          }else{
            $('.Left_Panel').css('height',$('.mainContainer').height()+'px');
            console.log('Publisher initialized.');
          }
        });

        /*this.state.session.on('sessionConnected', function(){
          console.log('sessionConnected');
        });
        this.state.session.on('sessionDisconnected', function(){
          console.log('sessionDisconnected');
        });*/



        this.startTimer();
        this.setState({ showEndCallOptions: true });
        this.setState({sessionId : res.data.session.sessionId });
        this.setState({apiKey : res.data.session.ot.apiKey });
        this.setState({apiSecret : res.data.session.ot.apiSecret });
		    this.setState({
		      expert,
		      loading: false,
		      error: null
		    });

		  }).catch(err => {
		    // Something went wrong. Save the error in state and re-render.
		    this.setState({
		      loading: false,
		      error: err
		    });
  	});
  }
  
  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    var slug = this.props.params.slug;

    //console.log('sessionId set by prev :'+this.state.sessionId);
    axios.get(`${API_URL}/getExpertDetail/${slug}`)
		  .then(res => {
        const expert = res.data[0];
        this.setState({firstName : res.data[0].profile.firstName });
        this.setState({lastName : res.data[0].profile.lastName });
		    this.setState({
		      expert,
		      loading: false,
		      error: null
		    });
		  })
		  .catch(err => {
		    this.setState({
		      loading: false,
		      error: err
		    });
	  	});
	}

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
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
    //if(minutes == this.props.redAlert)
    if(minutes <= this.props.redAlert)
    return Object.assign(
      {'-webkit-animation':'shake 0.1s ease-in-out 0.1s infinite alternate', 'color':'#FF0000'}
    );
  }

  disconnect() {
    //session.disconnect();
    if (this.state.publisher) {
      this.state.session.unpublish(this.state.publisher);
    }
  }

  render() {
    var controller = this.props.messagesController;
    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
           <ol className="breadcrumb">
             <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
             <li className="breadcrumb-item">Session with {this.state.firstName} {this.state.lastName}</li>
           </ol>

            { /* }
            <header className="header-session">John L</header>
            { */ }
            <section>
            	<div className="mainContainer">
            		<div className="Left_Panel">
            			<div className="Conversation">
            				<h6>Conversation</h6>
            				<a href="#" className="Hide_Left_panel"><i className="fa fa-times" aria-hidden="true"></i></a>
            			</div>
                  <div className="Chat_Main_section">
                    <div className="Chating_msg_Here">
                      { this.renderInbox() }
                      {/*}<ul>
                        <div className="Show_date_startMassage">May 27, 2016 .</div>
                        <li className="me">lorem ipsum dolor site. lorem ipsum dolor site.lorem ipsum dolor site.</li>
                        <li className="you"><strong>Name: </strong> lorem ipsum dolor site. <span className="Msgtime">02:57 PM</span></li>
                        <li className="me">lorem ipsum dolor site.</li>
                        <li className="you"><strong>Name: </strong> lorem ipsum dolor site. <span className="Msgtime">02:57 PM</span></li>
                        <li className="me">lorem ipsum dolor site.</li>
                        <li className="you"><strong>Name: </strong> lorem ipsum dolor site. <span className="Msgtime">02:57 PM</span></li>
                        <li className="me">lorem ipsum dolor site. lorem ipsum dolor site.lorem ipsum dolor site.</li>
                        <li className="you"><strong>Name: </strong> lorem ipsum dolor site. <span className="Msgtime">02:57 PM</span></li>
                        <li className="me">lorem ipsum dolor site.</li>
                      </ul>{*/}
                    </div>
                    <div className="typeMessage">
                      <ExpertReplyMessage sessionOwnerUsername={this.props.params.slug} messageReceiverEmail={'avadhesh_bhatt@rvtechnologies.co.in'} messageSenderEmail={'mohit@gmail.com'}/>
                      <div className="SendBtn_action">
                        <li><a href="#"><i className="fa fa-smile-o" aria-hidden="true"></i></a></li>
                        <li><a href="#"><i className="fa fa-paper-plane" aria-hidden="true"></i></a></li>
                      </div>
                    </div>
                  </div>
            		</div>
            		<div className="Right_Panel">

            			<div className="CallingDetails">
            				<div className="ClientName"><span><i className="fa fa-users" aria-hidden="true"></i></span> 2 Participants</div>
            				{ /* }<div className="ClientEmail">Calling {this.state.expert.name}</div>{ */ }
            			</div>

            			<div className="Client_image">
            				<div className="innerm">
                      { /* }
                      <div className="chatHead chatHeadLeader"><img src="/src/public/img/Client-img.png"/></div>
                      { */ }
                      { this.state.showEndCallOptions ? null : <LoaderImage/> }
                      <div id="publisher"></div>
                      <div id="subscribers"></div>
            					<div className="upperimageName">
                        <div className="text-left-detail"><i className="fa fa-user-o" aria-hidden="true"></i> {this.state.firstName} {this.state.lastName}</div>
                        <div className="text-right-detail" style={this.redAlertTiming(this.state.time.m)}><i className="fa fa-clock-o" aria-hidden="true"></i> {this.state.time.m} : {this.state.time.s}</div>
                      </div>
            				</div>
            			</div>

            			<div className="footer_action_btns">
            				<ul>
            					<li className="Chat_Trigger"><a href="javascript:void(0)"><i className="fa fa-commenting" aria-hidden="true"></i></a></li>
                      { this.state.showEndCallOptions ? null : <li className="create_phone_call"><Link to="javascript:void()"><i className="fa fa-video-camera" aria-hidden="true"></i> Initiating session...</Link></li> }

                      { this.state.showEndCallOptions ? <li className="phone_call"><Link to="javascript:void(0)" onClick={this.disconnect.bind(this)}><i className="fa fa-phone"></i></Link></li> : null }
                      { /* }
            					<li className="video_call"><a href="#"><i className="fa fa-video-camera" aria-hidden="true"></i></a></li>
            					<li className="microphone"><a href="#"><i className="fa fa-microphone" aria-hidden="true"></i></a></li>
            					<li className="phone_call"><a href="#"><i className="fa fa-phone" aria-hidden="true"></i></a></li>
            					<li className="setting"><a href="#"><i className="fa fa-cogs" aria-hidden="true"></i></a></li>
            					<li className="ellipsismore"><a href="#"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></a></li>
                      { */ }
            				</ul>
            			</div>
            		</div>
            	</div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

class EndCallSection extends Component {
  render(){
    return (
      <li className="phone_call"><Link to="javascript:void(0)" onClick={this.disconnect.bind(this)}><i className="fa fa-phone"></i></Link></li>
    );
  }
}

class LoaderImage extends Component {
  render(){
    return (
        <img className="loader-center-ajax" src="/src/public/img/ajax-loader-l.gif"/>
    );
  }
}

function mapStateToProps(state) {
  return {
    content: state.auth.content,
    messages: state.communication.messages,
  };
}

SessionPage.defaultProps = { redAlert: 5}

export default connect(mapStateToProps, { protectedTest, FetchExpertConversation })(SessionPage);
