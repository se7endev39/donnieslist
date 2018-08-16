import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { ExpertSendReply,FetchExpertConversation } from '../../actions/messaging';
import * as actions from '../../actions/messaging';
// import $ from 'jquery'

const form = reduxForm({
  form: 'expertReplyMessage',
});
const socket = actions.socket;

class ExpertReplyMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      composedMessage: '',
      emojionearea1:""
    }
    this.handleChange = this.handleChange.bind(this);
    /*
    //= ===============================
    // Expert-Session Messaging sockets
    //= ===============================
    */
    socket.emit('expert enter session', this.props.sessionOwnerUsername);

    // Listen for 'refresh expert session messages' from socket server
    socket.on('refresh expert session messages', (data) => {
        
/*        console.log('refresh expert session messages '+this.props.sessionOwnerUsername);
        console.log('refresh expert session messages '+this.props.sessionOwnerUsername);
        console.log('refresh expert session messages '+this.props.sessionOwnerUsername);
*/
        if(this.props.expertEmail==this.props.messageReceiverEmail){

          console.log('~~~~~ case 1: '+this.props.sessionOwnerUsername+' ---- '+this.props.messageSenderEmail);

          this.props.FetchExpertConversation(this.props.sessionOwnerUsername, this.props.messageSenderEmail).then(
            (res)=>{
                $('.Chating_msg_Here').animate({
//                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
                      scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")
                })            
              }
            )
        } else{

          console.log('~~~~~ case 2: '+this.props.sessionOwnerUsername+' ---- '+this.props.expertEmail);

          this.props.FetchExpertConversation(this.props.sessionOwnerUsername, this.props.messageReceiverEmail).then(

              (res)=>{
                  $('.Chating_msg_Here').animate({
  //                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
                        scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")

                  })            
                }

            )
        }



    });
  }

  componentWillUnmount() {
    socket.emit('expert leave session', this.props.sessionOwnerUsername);
  }
  componentWillMount(){
    var self = this
    $(document).ready(function() {
    $("#emojionearea1").emojioneArea({
      // pickerPosition: "left",
      // tonesStyle: "bullet",
      events: {
        change (editor, event) {
              // console.log('event:click');
              // debugger;
        },
        keypress: function (editor, event) {
          // console.log(event)
          if(event.keyCode==13){
              event.preventDefault();

                var j = editor[0].innerHTML

                var el = document.createElement( 'div' );
                el.innerHTML = j

                var fullString=""
                var composedMessage=""

                for(var x=0; x<el.childNodes.length;x++){

                  if(el.childNodes[x].tagName==undefined && el.childNodes[x].tagName!="DIV"){
                      if(fullString==""){

                        fullString=el.childNodes[x].textContent

                      }
                      else{
                        fullString= fullString+" "+el.childNodes[x].textContent
                      }
                  }
                  if(el.childNodes[x].tagName=="IMG")
                   {
                    fullString= fullString+" "+el.childNodes[x].getAttribute('alt')
                   }


                }
                composedMessage =  fullString;



                if(j!=""){
                  var date= new Date();
                                                // expert slug                        // reciever email               // sender email
                  self.props.ExpertSendReply(self.props.sessionOwnerUsername, self.props.messageReceiverEmail, self.props.messageSenderEmail, composedMessage, date);
                  editor[0].innerHTML=""
                  $('.emojionearea-editor')[0].innerHTML=""
                  $('.emojionearea-editor').html("")

                  // automatic scroller
                  $('.Chating_msg_Here').animate({
  //                    scrollTo: $('.Chating_msg_Here ul').scrollHeight
                        scrollTop: $('.Chating_msg_Here ul').prop("scrollHeight")

                  })
                }
                $('.emojionearea-editor').html("")
          }

        }

      }
    });
  });
  }

  handleChange = (e)=>{
      this.setState({
        [e.target.name] : e.target.value,
      });

  }

  handleFormSubmit() {
    // console.log("@@@")
    // this.props.ExpertSendReply(this.props.sessionOwnerUsername, this.props.messageReceiverEmail, this.props.messageSenderEmail,this.state.composedMessage);
    // this.setState({ composedMessage : "" });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    } else if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.renderAlert()}
        <div className="form-group">
          
          <textarea name="emojionearea1" id="emojionearea1" value={this.state.emojionearea1} onChange={this.handleChange} ></textarea >
            {/*}
            <div className="SendBtn_action">
              <li><a href="#"><i className="fa fa-smile-o" aria-hidden="true"></i></a></li>
              <li><button action="submit" className="btnNull"><i className="fa fa-paper-plane" aria-hidden="true"></i></button></li>
            </div>
            {*/}
       </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipients: state.communication.recipients,
    errorMessage: state.communication.error,
  };
}

export default connect(mapStateToProps, { ExpertSendReply, FetchExpertConversation })(form(ExpertReplyMessage));
