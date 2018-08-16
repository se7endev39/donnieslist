// confirmpaymentconfigurationdone
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookie';
import { protectedTest } from '../../actions/auth';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { API_URL, CLIENT_ROOT_URL, errorHandler, tokBoxApikey } from '../../actions/index';



class confirmpaymentconfigurationdone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseMsg:"",
      role:"",
      errorMessage:"",
      info:"",
      
    };
    this.props.protectedTest();
  }
  componentWillMount(){
    const currentUser = cookie.load('user');
    var id=currentUser._id
    var slug=currentUser.slug
    // console.log(id)
    // console.log(this.props)
    // console.log(this.props.location.query)
    var code = this.props.location.query.code
    var self= this


  	axios.get(`${API_URL}/myuserprofile/${id}/${code}`, {
      headers: { Authorization: cookie.load('token') },
    }).then(
        (res)=>{
              console.log("*****************")
              console.log(res)
              if(res && res.data && res.data!=null && res.data!=undefined && res.data.status && res.data.status!=null && res.data.status!=undefined && res.data.status=="success"){
                this.setState({successMessage:res.data.SuccessMessage, errorMessage:"", info:"Redirecting in 5 Seconds"})

                setTimeout(function(){

                  window.location.href="/mysession/"+slug
                },5000)
                  var sec=4
                  var timer = setInterval(function(){
                    self.setState({successMessage:res.data.SuccessMessage, errorMessage:"", info:"Redirecting in "+ sec +" Seconds"})
                    sec= sec-1
                    if(sec==0){
                      clearInterval(timer)
                    }

                  },1000)
              }
              else{
                this.setState({errorMessage:res.data.error, successMessage:""})
              }
   //        var mainrole=res.data.user.role
   //        var mainId =res.data.user.stripeId
   //        if(res && res!=null && res.data && res.data!=null && res.data.user && res.data.user!=null && res.data.user!=undefined && mainrole=="Expert" && mainId==""){
   //          	this.setState({errorMessage:"Your Payment Configuration Is Not Set. Please Configure It To Access Session Page"})
   //        }
        }

      )
  }
  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
        <li className="breadcrumb-item">Confirm Payements Configuration Page</li>
      </ol>
    );
  }

  userMenu() {
    return (
      <ul className="nav nav-sidebar" id="menu">
        <li><Link to="/profile/edit"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Edit Profile</span></Link></li>
        <li><Link to="/dashboard/inbox"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Inbox</span></Link></li>
      </ul>
    );
  }


  render(){
  	return(

  		<div>
          <div className="container">
            <div className="row">
              {this.breadcrumb()}
              <div className="wrapper-sidebar-page">
                <div className="row row-offcanvas row-offcanvas-left">
                  <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">
                    {this.userMenu()}
                  </div>
                  <div className="column col-sm-9 col-xs-11" id="main">
                    <div id="pageTitle">
                       <div className="title">Confirm Payments Configuration</div>
                    </div>
                    { this.state.errorMessage && this.state.errorMessage!="" &&
                    <div className="alert alert-danger">
                      {this.state.errorMessage}
                    </div>}

                    { this.state.errorMessage && this.state.errorMessage!="" &&
                    <a href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_AO6OL4V0irBbASlFy9dnrWoNYVgJC5Ru&scope=read_write" className="btn btn-danger" >
                      Stripe
                    </a>}
                    { this.state.successMessage && this.state.successMessage!="" &&
                    <div className="alert alert-success">
                      {this.state.successMessage}
                    </div>}
                    { this.state.info && this.state.info!="" &&
                    <div className="alert alert-info">
                      {this.state.info}
                    </div>}

                  </div>
                  
                </div>
              </div>
            </div>
          </div>
  		</div>

  		)
  }

}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}
export default connect(null, {protectedTest })(confirmpaymentconfigurationdone);
