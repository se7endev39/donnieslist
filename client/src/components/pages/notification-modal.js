import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import StripeCheckout from 'react-stripe-checkout';
import { rechargeVideoSession, addMoneyToWallet, createAudioSession } from '../../actions/expert';
import { CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import cookie from 'react-cookie';
var classNames = require('classnames');
import Calendar from 'react-calendar';
// import './model.css';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class NotificationModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { 
        responseTextMsg : "",
        currentUser: cookie.load('user'),
        selectMins : 0,
        disableAddToWalletBtn: false,
        walletSuccess: false,
        walletError: false,
        walletMessage: this.props.modalMessage,
        walletDefault: true,
        date: new Date(),
    };
    const userEmail = this.props.userEmail;
    
    this.addMoneyToWallet = this.addMoneyToWallet.bind(this);
    this.selectMins = this.selectMins.bind(this);
    this.startNowSession = this.startNowSession.bind(this);
    this.sendSessionRequest = this.sendSessionRequest.bind(this);
  }
  
  startNowSession(){
      var self = this;
      var selectMins = this.state.selectMins;
      window.jQuery('.scheduleSuccess').show();
      window.jQuery('.scheduleDiv').hide();
      // if(selectMins == 0){
      //   self.setState({
      //       walletError: true,
      //       walletDefault: false,
      //       walletMessage: 'Please select time slot'
      //   });
      // } else{
      //    self.setState({
      //       walletError: false,
      //   });
      //   cookie.save('selectMins', selectMins * 60, { path: '/' });
      //   browserHistory.push('/mysession/'+this.props.expertSlug);
        
      // }
      
      
  }
  
  selectMins(e){
      this.setState({
       selectMins: parseInt(e.target.value)   
      });
  }

  sendSessionRequest() {
    const logged_user_email = this.state.currentUser ? this.state.currentUser.email : '';
   // alert(JSON.stringify(this.props.expert))
    const data = {
        requestedMinutes: this.state.selectMins,
        requestedDate: this.state.date,
        userEmail: logged_user_email,
        expertEmail: this.props.expert.email,
        sessionCompletionStatus: 'UNCOMPLETED'
     }
     //alert(JSON.stringify(data));
     this.props.createAudioSession(data).then(response => {
                 console.log(response);
                 if (response.success) {
                     //alert(response.message);
                     this.props.toggleCallLinks();
                     window.jQuery('.scheduleSuccess').show();
                     window.jQuery('.scheduleDiv').hide();
                 }
     })
  }
  
  addMoneyToWallet(e){
      
      //cookie.save('requiredLogin_for_session', 'Please login to start video session', { path: '/' });
      
      var self = this;
      e.preventDefault();
      this.setState({
          disableAddToWalletBtn: true
      });
      
      try{
      const amount = this.state.selectMins;
      const userEmail = this.props.userEmail;
      const expertSlug = this.props.expertSlug;
      const customer_id = this.state.currentUser ? this.state.currentUser.customerId : '';

      //this.props.rechargeVideoSession({stripeToken, expertSlug, userEmail, amount}).then(
      this.props.addMoneyToWallet({customer_id, expertSlug, userEmail, amount}).then(
      	(response)=>{
          //console.log('response: '+JSON.stringify(response));
          if(response.status == 1){
              self.setState({
                  walletSuccess: true,
                  walletDefault: false,
                  walletError: false,
                  walletMessage: response.message
              });
          } else {
              self.setState({
                  walletError: true,
                  walletDefault: false,
                  disableAddToWalletBtn: false,
                  walletMessage: response.message
              });
          }
      	},
      	(err) => err.response.json().then(({errors})=> {
          console.log('err: '+JSON.stringify(err));
       	})
      )
    }catch(e){}
  }

  onToken(stripeToken){
    try{
      //const amount = 30;  //default initial time is 30 minutes
      const amount = this.state.selectMins;  //default initial time is 30 minutes
      const userEmail = this.props.userEmail;
      const expertSlug = this.props.expertSlug;

      //this.props.rechargeVideoSession({stripeToken, expertSlug, userEmail, amount}).then(
      this.props.addMoneyToWallet({stripeToken, expertSlug, userEmail, amount}).then(
      	(response)=>{
          console.log('response: '+JSON.stringify(response));
      	},
      	(err) => err.response.json().then(({errors})=> {
          console.log('err: '+JSON.stringify(err));
       	})
      )
    }catch(e){}
  }

  onCalendarChange = date => this.setState({ date:new Date(date) })

  render() {
      
    const modalMessageClass = classNames(
        {
            'alert alert-success': this.state.walletSuccess,
            'alert alert-danger' : this.state.walletError,
            //'alert-info': this.state.walletDefault
        }
    );   
      
    return (
      <div id={this.props.modalId} className="modal fade continueshoppingmodal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Message</h4>
            </div>
            <div className="modal-body text-center">
                
                
                <div className={modalMessageClass}>
                    {this.state.walletMessage}
                </div>
        
                <div className='scheduleDiv' style={{marginBottom: '10px'}}>
                    Please select date from the calendar you want to spend with expert
                </div>
                
                <div className="form-group row">
                  <div style={{display:'none'}} className="col-md-12 scheduleSuccess">
                  <div class="alert alert-success">
                    <strong>Video Session Scheduled Successfully ! </strong> 
                      You Will Get Notified By Email Once Experts Confirms.
                    </div>
                  </div>
                    <div className="col-md-12 scheduleDiv">
                    
                    <div style={{display:'flex', justifyContent:'center'}}>
                    <Calendar
                    onChange={this.onCalendarChange}
                    value={this.state.date}
                    />
                    </div>
                    {this.state.date &&
                    <div style={{display:'flex', justifyContent:'center'}}>
                    <p>Selected Date: <span style={{fontWeight:'bold'}}>{this.state.date.toLocaleDateString("en-US", dateOptions)}</span></p>
                   </div>
                    }

                      {/* <div className="col-md-4 col-md-offset-4">
                        <select className="form-control" onChange={this.selectMins}>
                            <option value="0">Select Mins</option>
                            <option value="15">15 mins ($15)</option>
                            <option value="30">30 mins ($30)</option>
                            <option value="45">45 mins ($45)</option>
                            <option value="60">1 hr ($60)</option>
                        </select>
                    </div>*/}
                    
                    </div>
                </div>
                
                <div dangerouslySetInnerHTML={{__html: this.state.responseTextMsg}}/>
            </div>
            <div className="modal-footer scheduleDiv">
              <div className="bootstrap-dialog-footer">
                <div className="bootstrap-dialog-footer-buttons text-center">
                  
                    {/* <StripeCheckout token={this.onToken.bind(this)} stripeKey="pk_test_s744wYvqQUrpqsXGLnUBUFRw" panelLabel="Pay Now!" name="Donny's List Wallet Money"> <a href="javascript:void()" className="btn btn-primary">Add Money to Wallet</a></StripeCheckout>  */} 
                    {/* <button  disabled={this.state.disableAddToWalletBtn}  onClick={this.addMoneyToWallet} className="btn btn-primary">Add Money to Wallet</button> */}
                    <button  onClick={this.startNowSession} className="btn btn-primary">Start Now</button>
                    
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
    message: state.auth.message
  };
}

export default connect(mapStateToProps, { rechargeVideoSession, addMoneyToWallet, createAudioSession })(NotificationModal);
