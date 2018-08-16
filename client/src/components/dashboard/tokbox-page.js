import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import { protectedTest } from '../../actions/auth';
import axios from 'axios';

class TokboxPage extends Component {
  constructor(props) {
     super(props);
 }

 componentDidMount() {
   var userEmail = "mohit@gmail.com";
   var expertEmail = "rohit@gmail.com";
   var apiKey = "";
   var token = "";
   var sessionId = "";

   axios.post(`${API_URL}/createVideoSession`, { expertEmail, userEmail })
     .then(res => {
       //console.log(JSON.stringify(res.data.session));
       //var session = TB.initSession(res.data.session.sessionId);
       console.log('sessionId: '+res.data.session.sessionId);
       console.log('apiKey: '+res.data.session.ot.apiKey);

       //var publisher = TB.initPublisher(res.data.session.ot.apiKey, 'publisher',{width:'100%', height:400});
       sessionId = res.data.session.sessionId;
       apiKey = res.data.session.ot.apiKey;
       token = res.data.token;
       //apiKey = "45778492";
       //sessionId = "2_MX40NTc3ODQ5Mn5-MTQ4ODQzNTY2ODcyNX5sWjVqSytpNmtFMzBDQ0lKRk5xT0Q4UDB-fg";
       //token = "T1==cGFydG5lcl9pZD00NTc3ODQ5MiZzaWc9NDA2MzdjNzllYzBlZDUwMjg4YzkxOTFhN2ZlOWU3MWI2NDBjODQ2NDpzZXNzaW9uX2lkPTJfTVg0ME5UYzNPRFE1TW41LU1UUTRPRFF6TlRZMk9EY3lOWDVzV2pWcVN5dHBObXRGTXpCRFEwbEtSazV4VDBRNFVEQi1mZyZjcmVhdGVfdGltZT0xNDg4NDM1NjgwJm5vbmNlPTAuNjQ4ODczMTQxNzgxMTkyOCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDkxMDI3Njc5"

       this._initOT(token,sessionId,apiKey);

     }).catch(err => {
       console.log('error catch : '+err);
   });
 }

 _initOT(token,sessionId,apiKey) {

     var session = OT.initSession(apiKey, sessionId).on({
         sessionConnected: function(event) {
           console.log(';;; sessionConnected ')
           subscriber = session.subscribe(stream, 'myDiv');
         },
         streamCreated: function(event) {
           console.log(';;; streamCreated ')
         }
       });

     //this.publish(apiKey, session, token);
     console.log('params: '+JSON.stringify(this.props.params));
     //var join = this.props.params.join;

     switch(this.props.type) {
         case 'publish':
             this.publish(apiKey, session, token);
             break;
         case 'subscribe':
             this.subscribe(session, token);
             break;
         default:
             console.error(this.props.type,
                 ' is an unknown opentok action type. Must be either publish or subscribe.');
     }
 }

 publish(apiKey, session, token) {
     //var publisherVideo = document.querySelector('#publisher-video'),
     //mockPublisherEl = document.createElement('div'),
    var publisher = OT.initPublisher(apiKey, 'publisherA',{width:'50%', height:300});
    publisher.publishVideo(false);
     /*publisher = OT.initPublisher(mockPublisherEl, function(err) {
         if (!err) {
             // Let's put the publisher into my own custom video element
             var pubVid = mockPublisherEl.querySelector('video');
             publisherVideo.src = pubVid.src;
             if (pubVid.mozSrcObject !== void 0) {
                 publisherVideo.mozSrcObject = pubVid.mozSrcObject;
             }
             publisherVideo.play();
         }
     });
     */
     // connect and publish to opentok session
     session.connect(token, function(err) {
         if (!err) {
             session.publish(publisher);
         }
     });
 }

 subscribe(session, token) {
     // connect to opentok session
     session.connect(token, function(err) {
         if (err) {
             console.error('unable to connect to opentok session.');
         }
         console.log('connect');
     });

     session.on({
         streamCreated: function(event) {
            console.log('streamCreated');
            var subContainer = document.createElement('div');
            subContainer.id = 'stream-' + event.stream.streamId;
            document.getElementById('subscribers').appendChild(subContainer);
            session.subscribe(event.stream, subContainer);
         },
         streamDestroyed: function(event) {
             // Clean up video element
             console.log('streamDestroyed');
             var vidContainer = document.getElementById('opentok-container');
             var subscriberVideo = document.getElementById(event.stream.id);
             vidContainer.removeChild(subscriberVideo);
         }
     });
 }

 render() {
     return (
         <div>
             <div id="opentok-container">
                  <div id="publisherA"></div>
                  <div id="subscribers"></div>
             </div>
         </div>
     );
 }
}

function mapStateToProps(state) {
  return { content: state.auth.content };
}
TokboxPage.defaultProps = { type: "publish" }

export default connect(mapStateToProps, { protectedTest })(TokboxPage);
