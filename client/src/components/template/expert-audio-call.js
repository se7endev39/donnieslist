import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import { Modal, Button, Panel } from 'react-bootstrap';
import * as actions from '../../actions/messaging';
import $ from 'jquery';
import { audioCallTokenRequest } from '../../actions/expert';
import { tokBoxApikey } from './../../actions/index';

const socket = actions.socket;
const currentUser = cookie.load('user');
//console.log('currentUser: '+JSON.stringify(currentUser));

class ExpertAudioCall extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      audioCallFrom: '',
      email: this.props.email,
      sessionId: '',
      apiToken: '',
      pubOptions: {width:100, height:75, insertMode: 'append'},
      publisherObj: '',
      sessionObj: '',
      newConAudioId: '',
      userAudioCallSokcetname: '',
      totalSeconds: 0,
      refreshIntervalId: '',
    };
    var self = this;
    this.open = this.open.bind(this);
    this.disconnectCall = this.disconnectCall.bind(this);
    this.connectCall = this.connectCall.bind(this);
    
    this.setTime = this.setTime.bind(this);

    const user = cookie.load('user');
    if(user){ // user cookie is set
      const userRole = user.role
      if(userRole == 'Expert'){
        //console.log('**** username ****'+user.slug);
        const expertUsername = user.slug;
        socket.emit('expert audio call session', 'expert-audio-session-'+expertUsername);
      }
    }
    
  }
  
  componentDidMount(){
      var self = this;
      socket.on('audio call to expert', function(data){
        self.setState({
          audioCallFrom: data.audioCallFrom,
          newConAudioId: data.newConAudioId,
          userAudioCallSokcetname: data.userAudioCallSokcetname,
          userConnectionId: data.userConnectionId,
        });
        self.open();
        $('.incomingAudioCall_main').css('right', 0);
        console.log('*** socket on audio call to expert ***'+ self.state.userAudioCallSokcetname);
    });
  }
  
   setTime() {
        var totalSeconds = this.state.totalSeconds;
        ++totalSeconds;
        this.setState({
            totalSeconds: totalSeconds
        });
        
       
        var secondsLabel = this.pad(totalSeconds%60);
        var minutesLabel = this.pad(parseInt(totalSeconds/60));
        
        $('#expert_audio_call_seconds').html(secondsLabel);
        $('#expert_audio_call_minutes').html(minutesLabel);
    }
    
    pad(val)
    {
        var valString = val + "";
        if(valString.length < 2)
        {
            return "0" + valString;
        }
        else
        {
            return valString;
        }
    }
  
  disconnectAudioCall(){
    this.state.sessionObj.disconnect();
  };
  
  open() { this.setState({showModal: true}); }

  disconnectCall() {
      console.log("*** disconnect call ****");
      this.setState({showModal: false, audioCalling: false});
      $('.incomingAudioCall_main').css('right', '-300px');
      var data = { userAudioCallSokcetname: this.state.userAudioCallSokcetname }
      socket.emit('disconnect incoming audio call to user', data);
  }

  connectCall(){
    this.setState({showModal: false});
    $('.incomingAudioCall_main').css('right', '-300px');
    
    const email = this.state.email;
    const newConAudioId = this.state.newConAudioId;
    const self = this;

    this.props.audioCallTokenRequest({ email, newConAudioId }).then(
      (response)=>{
            
            var session = OT.initSession(tokBoxApikey, response.sessionId);
            
            this.setState({
                sessionObj: session,
                userAudioCallSokcetname: 'user-audio-session-'+response.username,
                sessionId  : response.sessionId,
                apiToken   : response.token
            });
            
            var publisher;

            session.on('streamCreated', function(event){
                console.log('streamCreated');
                var options = {width:100, height:75, insertMode: 'append'};
                var subscriber = session.subscribe(event.stream, 'userSubscriberAudio' , options);
                $('#expert-audio-call-interface-wrapper').fadeIn();
                var refreshIntervalId = setInterval(self.setTime, 1000);
                self.setState({
                    refreshIntervalId
                });
            });

            session.on('connectionCreated', function(event){
                console.log('connectionCreated');
            });

            session.on('connectionDestroyed', function(event){
                console.log('connectionDestroyed');
                session.disconnect();
                $('#expert-audio-call-interface-wrapper').fadeOut();
                var refreshIntervalId = self.state.refreshIntervalId;
                clearInterval(refreshIntervalId);
                self.setState({
                    totalSeconds: 0,
                    refreshIntervalId: ''
                });
            });
            
            session.on('sessionDisconnected', function(event){
                console.log('sessionDisconnected');
                $('#expert-audio-call-interface-wrapper').fadeOut();
                var refreshIntervalId = self.state.refreshIntervalId;
                clearInterval(refreshIntervalId);
                self.setState({
                    totalSeconds: 0,
                    refreshIntervalId: ''
                });
            });

            session.on('streamDestroyed', function(event){
                console.log('streamDestroyed');
                $('#expert-audio-call-interface-wrapper').fadeOut();
            });

            session.connect(this.state.apiToken, function(error){
                if(error){
                    console.log('session connection error');
                } else {
                    var pubOptions = {videoSource: null, width:100, height:75, insertMode: 'append'};
                    publisher = OT.initPublisher('expertPublisherAudio', pubOptions);
                    session.publish(publisher);
                }
            });
      },
      (err) => err.response.json().then(({errors})=> {
        //alert('error');
      })
    )

    
    
  }

  render() {
    return (
        <div>
          
            {/* Incoming Audio Call : START  */}
            <div className="incomingAudioCall_main">
              <div className="incomingAudioCall_popup">
                <div className="modal-header">
                  <h4 className="modal-title"> Incoming Call... </h4>
                </div>
                
                <div className="modal-body"> 
                    <div className="userDetail">
                        <div className="user_img"><img src="/src/public/img/Client-img.png" alt="" /></div>
                        <h3> { this.state.audioCallFrom } </h3>
                    </div>
                </div>
                
                <div className="modal-footer">
                  <Button bsStyle="danger" onClick={this.disconnectCall}> <img className="incoming_call disconnect_call" src="/src/public/img/call_cancel.png" alt=""/> </Button>
                  <Button bsStyle="success" onClick={ this.connectCall }> <img className="incoming_call receive_call" src="/src/public/img/call_pick_up.png" alt=""/> </Button>
                </div>
        
             </div>
          </div>
  
          {/* Incoming Audio Call : END  */}
          
        {/* Expert Audio Calling Wrapper : START  */}
        
          <div id="expert-audio-call-interface-wrapper" className={"expert-audio-call-interface-wrapper conn3 audio-call-interface-wrapper " }>
                <div className="panel panel-primary">
                    <div className="panel-heading">Audio Calling...</div>
                    <div className="panel-body audio_call_body">
                         <div className="audio_user_call_img">
                              <img src="/src/public/img/Client-img.png" alt="" />
                         </div>
                         <div className="audio_userrgt_content">
                              <div id="expertPublisherAudio"></div>
                              <div id="userSubscriberAudio"></div>
                              <h3>{ this.state.audioCallFrom }</h3>
                              <h5><label id="expert_audio_call_minutes">00</label>:<label id="expert_audio_call_seconds">00</label></h5>  
                        </div>
                        <button onClick={ this.disconnectAudioCall.bind(this) } className="btn btn-danger"> <img className="incoming_call disconnect_call" src="/src/public/img/call_cancel.png" alt=""/> </button>
                    </div>
                </div>
          </div> 
          
          {/* Expert Audio Calling Wrapper : END  */}
          
          
          {/*  Expert Audio Calling interface : START */}
          {/*  <div id="expert-audio-call-interface-wrapper" className="expert-audio-call-interface-wrapper">
              <Panel header="Audio Calling..."  bsStyle="primary" >
                <div id="expertPublisherAudio"></div>
                <div id="userSubscriberAudio"></div>
                
                <button  onClick={ this.disconnectAudioCall.bind(this) } className="btn btn-danger" type="button">Disconnect</button>
                
              </Panel>
            </div> */}
          {/*  Expert Audio Calling interface : END */}

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


export default connect(null, { audioCallTokenRequest })(ExpertAudioCall);
