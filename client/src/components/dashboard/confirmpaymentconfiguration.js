// ConfirmPaymentConfiguration
import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
// import { Field, reduxForm } from "redux-form";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import { protectedTest } from "../../actions/auth";
// import ReactDOM from "react-dom";
import axios from "axios";
// import { errorHandler } from "../../actions/index";
import { 
  API_URL, 
  // CLIENT_ROOT_URL, 
  // tokBoxApikey 
} from "../../constants/api";

class ConfirmPaymentConfiguration extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      responseMsg: "",
      role: "",
      errorMessage: "",
      successMessage: "",
      info: "",
    };
    this.props.protectedTest();
  }
  UNSAFE_componentWillMount() {
    const currentUser = this.props.cookies.get("user");
    console.log(currentUser.role);
    console.log("cu");
    var id = currentUser._id;
    var self = this;
    this.setState({ role: currentUser.role });
    axios
      .get(`${API_URL}/myuserprofile/${id}`, {
        headers: { Authorization: this.props.cookies.get("token") },
      })
      .then((res) => {
        var mainrole = res.data.user.role;
        var mainId = res.data.user.stripeId;
        if (
          currentUser &&
          currentUser.role !== null &&
          currentUser.role === "Expert" &&
          res &&
          res !== null &&
          res.data &&
          res.data !== null &&
          res.data.user &&
          res.data.user !== null &&
          res.data.user !== undefined &&
          mainrole === "Expert" &&
          mainId === ""
        ) {
          this.setState({
            errorMessage:
              "Your Payment Configuration Is Not Set. Please Configure It To Access Session Page",
          });
        } else if (
          currentUser &&
          currentUser.role !== null &&
          currentUser.role === "Expert" &&
          res &&
          res !== null &&
          res.data &&
          res.data !== null &&
          res.data.user &&
          res.data.user != null &&
          res.data.user !== undefined &&
          mainrole === "Expert" &&
          mainId !== ""
        ) {
          // console.log(res)

          self.setState({
            successMessage: "You have already filled the required information",
            errorMessage: "",
            info: "You will be redirected to dashboard.",
          });
          var sec = 4;
          var timer = setInterval(function () {
            self.setState({ info: "Redirecting in " + sec + " Seconds." });
            sec = sec - 1;
            if (sec === 0) {
              clearInterval(timer);
              window.location.href = "/dashboard";
            }
          }, 1000);
          // setTimeout(function(){

          //   // window.location.href="/dashboard"
          // },5000)
        } else if (currentUser.role !== "Expert") {
          console.log("===========================");
          console.log(currentUser.role);
          console.log(currentUser.role !== "Expert");
          this.setState({
            errorMessage: "You are not authorized to view this page",
            info: "You will be redirected to dashboard.",
          });
          // var sec = 4;
          // var timer =
          setInterval(function () {
            self.setState({ info: "Redirecting in " + sec + " Seconds." });
            sec = sec - 1;
            if (sec === 0) {
              clearInterval(timer);
              window.location.href = "/dashboard";
            }
          }, 1000);
        }
      });
  }
  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          Confirm Payements Configuration Page
        </li>
      </ol>
    );
  }

  userMenu() {
    return (
      <ul className="nav nav-sidebar" id="menu">
        <li>
          <Link to="/profile/edit">
            <i className="glyphicon glyphicon-list-alt"></i>
            <span className="collapse in hidden-xs"> Edit Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/inbox">
            <i className="glyphicon glyphicon-list-alt"></i>
            <span className="collapse in hidden-xs"> Inbox</span>
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                <div
                  className="column col-sm-3 col-xs-1 sidebar-offcanvas"
                  id="sidebar"
                >
                  {this.userMenu()}
                </div>
                <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">Confirm Payments Configuration</div>
                  </div>
                  {this.state.errorMessage &&
                    this.state.errorMessage !== "" && (
                      <div className="alert alert-danger">
                        {this.state.errorMessage}
                      </div>
                    )}

                  {this.state.errorMessage &&
                    this.state.errorMessage !== "" &&
                    this.state.role === "Expert" && (
                      <a
                        href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_AO6OL4V0irBbASlFy9dnrWoNYVgJC5Ru&scope=read_write"
                        className="btn btn-danger"
                      >
                        Stripe
                      </a>
                    )}
                  {this.state.successMessage &&
                    this.state.successMessage !== "" && (
                      <div className="alert alert-success">
                        {this.state.successMessage}
                      </div>
                    )}
                  {this.state.info && this.state.info !== "" && (
                    <div className="alert alert-info">{this.state.info}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     errorMessage: state.auth.error,
//     message: state.auth.message,
//     authenticated: state.auth.authenticated,
//   };
// }
export default connect(null, { protectedTest })(
  withCookies(ConfirmPaymentConfiguration)
);
