// AccountInformation
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
// import { protectedTest } from '../../actions/auth';

import { UpdateAccountInfo, FetchAccountInfo } from "../../actions/user";
// import { fetchMyProfile,API_URL, Image_URL } from '../../actions/index';
// import {UpdateMyProfile} from '../../actions/user'
// import SidebarMenuAdmin from './sidebar-admin';
// import classnames from 'classnames'

import SidebarMenuUser from "./sidebar-user";

class AccountInformation extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      successmessage: "",
      errorMessage: "",

      role: "",

      emailId: "",
      exp_year: "",

      exp_month: "",

      car_number: "",
      address_country: "",
      address_state: "",
      address_city: "",
      address_zip: "",
      car_holder_name: "",
      cvc: "",
      address_line1: "",
      address_line2: "",

      errors: {},
      showClickButton: false,

      //   role: "",
      years: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }
  UNSAFE_componentWillMount() {
    const currentUser = this.props.cookies.get("user");
    var emailId = currentUser.email;
    var role = currentUser.role;
    this.setState({ emailId: emailId, role: role });
    if (role !== "User") {
      this.setState({
        errorMessage: "Sorry you are not authorized to view this page",
      });
    }
    if (role === "User") {
      this.props.FetchAccountInfo({ emailId }).then((res) => {
        var cardInfo = res.user.cardInfo;
        if (res && res !== null && res !== undefined && res.status === 0) {
          this.setState({ errorMessage: res.message });
        } else if (
          res &&
          res !== null &&
          res !== undefined &&
          res.user &&
          res.user !== null &&
          res.user !== undefined
        ) {
          this.setState({
            exp_year: cardInfo.exp_year,
            exp_month: cardInfo.exp_month,
            car_number: cardInfo.number,
            address_country: cardInfo.address_country,
            address_state: cardInfo.address_state,
            address_city: cardInfo.address_city,
            address_zip: cardInfo.address_zip,
            car_holder_name: cardInfo.name,
            cvc: cardInfo.cvc,
            address_line1: cardInfo.address_line1,
            address_line2: cardInfo.address_line2,
          });
        }
      });
    }
    var today = new Date();
    var thisyear = today.getFullYear();
    // var mainYear = thisyear;
    var years = [];
    for (var x = thisyear; x <= thisyear + 10; x++) {
      var year = x + 1;
      years.push(year);
    }
    this.setState({ years: years });
  }
  handleSubmit(e) {
    e.preventDefault();
    let errors = {};
    console.log("****");

    if (this.state.emailId === "" || this.state.emailId === undefined) {
      errors.this.state.emailId = "Email cannot be empty";
    }
    if (this.state.exp_month === "" || this.state.exp_month === undefined) {
      errors.exp_month = "Expiry month cannot be empty";
    }
    if (this.state.exp_year === "" || this.state.exp_year === undefined) {
      errors.exp_year = "Expiry year cannot be empty";
    }
    if (this.state.cvc === "" || this.state.cvc === undefined) {
      errors.cvc = "CVC cannot be empty";
    }
    if (this.state.car_number === "" || this.state.car_number === undefined) {
      errors.car_number = "Card number cannot be empty";
    } else {
      if (this.state.car_number === "" || this.state.car_number.length > 16) {
        errors.car_number = "Length cannot be more than 16";
      } else if (
        this.state.car_number === "" ||
        this.state.car_number.length < 16
      ) {
        errors.car_number = "Length cannot be less than 16";
      }
    }
    if (
      this.state.car_holder_name === "" ||
      this.state.car_holder_name === undefined ||
      this.state.car_holder_name.trim() === ""
    ) {
      errors.car_holder_name = "Card holder name cannot be empty";
    }
    if (
      this.state.address_country === "" ||
      this.state.address_country === undefined ||
      this.state.address_country.trim() === ""
    ) {
      errors.address_country = "Country name cannot be empty";
    }
    if (
      this.state.address_state === "" ||
      this.state.address_state === undefined ||
      this.state.address_state.trim() === ""
    ) {
      errors.address_state = "State name cannot be empty";
    }
    if (
      this.state.address_city === "" ||
      this.state.address_city === undefined ||
      this.state.address_city.trim() === ""
    ) {
      errors.address_city = "City name cannot be empty";
    }
    if (
      this.state.address_zip === "" ||
      this.state.address_zip === undefined ||
      this.state.address_zip.trim() === ""
    ) {
      errors.address_zip = "Zip code cannot be empty";
    }
    if (
      this.state.address_line1 === "" ||
      this.state.address_line1 === undefined ||
      this.state.address_line1.trim() === ""
    ) {
      errors.address_line1 = "Address line 1  cannot be empty";
    }

    this.setState({ errors });
    const isValid = Object.keys(errors).length === 0;
    console.log("**** out: " + JSON.stringify(errors));
    if (isValid) {
      const {
        emailId,
        exp_month,
        exp_year,
        cvc,
        car_number,
        car_holder_name,
        address_country,
        address_state,
        address_city,
        address_zip,
        address_line1,
        address_line2,
      } = this.state;

      this.props
        .UpdateAccountInfo({
          emailId,
          exp_month,
          exp_year,
          cvc,
          car_number,
          car_holder_name,
          address_country,
          address_state,
          address_city,
          address_zip,
          address_line1,
          address_line2,
        })
        .then((res) => {
          // console.log("Component")
          if (
            res &&
            res !== null &&
            res !== undefined &&
            res.status &&
            res.status !== null &&
            res.status === 1
          ) {
            this.setState({
              successmessage:
                "Successfully added the payement configuration details",
              errorMessage: "",
            });
          } else {
            this.setState({ errorMessage: res.message, successmessage: "" });
          }
        });
    } else {
      console.log("**** else: " + isValid);
    }
  }

  isRole(roleToCheck, toRender) {
    const userRole = this.props.cookies.get("user").role;
    if (userRole === roleToCheck) {
      return toRender;
    }
    return false;
  }
  userMenu() {
    return <SidebarMenuUser />;
  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors);

      delete errors[e.target.name];
      this.setState({
        [e.target.name]: e.target.value,
        errors,
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">Update Account Info</li>
      </ol>
    );
  }

  clearInput(e) {
    e.preventDefault();
    this.setState({
      exp_year: "",
      exp_month: "",
      car_number: "",
      address_country: "",
      address_state: "",
      address_city: "",
      address_zip: "",
      car_holder_name: "",
      cvc: "",
      address_line1: "",
      errors: {},
    });
  }

  render() {
    return (
      <div>
        <div className="session-page">
          <div className="container">
            <div className="row">
              {this.breadcrumb()}
              <div className="wrapper-sidebar-page">
                <div className="row row-offcanvas row-offcanvas-left">
                  {this.isRole("User", this.userMenu())}
                  <div className="column col-sm-9 col-xs-11" id="main">
                    <div id="pageTitle">
                      {this.state.successmessage &&
                        this.state.successmessage !== null &&
                        this.state.successmessage !== undefined &&
                        this.state.successmessage !== "" && (
                          <div className="alert alert-success">
                            {this.state.successmessage}
                          </div>
                        )}
                      {this.state.errorMessage &&
                        this.state.errorMessage !== null &&
                        this.state.errorMessage !== undefined &&
                        this.state.errorMessage !== "" && (
                          <div className="alert alert-danger">
                            {this.state.errorMessage}
                          </div>
                        )}
                    </div>

                    {this.state.role &&
                      this.state.role !== null &&
                      this.state.role !== undefined &&
                      this.state.role === "User" && (
                        <form id="" onSubmit={this.handleSubmit}>
                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Email</label>
                              <input
                                name="emailId"
                                readOnly
                                className="form-control"
                                value={this.state.emailId}
                                type="email"
                              />
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-4 form-group">
                              <label>Expiry Month</label>
                              {/*<input name="exp_month" className="form-control" value={this.state.exp_month} onChange={this.handleChange} type="number" min="1" max="12"/>*/}
                              <select
                                name="exp_month"
                                className="form-control"
                                value={this.state.exp_month}
                                onChange={this.handleChange}
                              >
                                {<option value="">Select</option>}
                                <option value="1">01 (Jan)</option>
                                <option value="2">02 (Feb)</option>
                                <option value="3">03 (March)</option>
                                <option value="4">04 (April)</option>
                                <option value="5">05 (May)</option>
                                <option value="6">06 (June)</option>
                                <option value="7">07 (July)</option>
                                <option value="8">08 (Aug)</option>
                                <option value="9">09 (Sep)</option>
                                <option value="10">10 (Oct)</option>
                                <option value="11">11 (Nov)</option>
                                <option value="12">12 (Dec)</option>
                              </select>
                              <span className="error">
                                {this.state.errors.exp_month}
                              </span>
                            </div>
                            <div className="col-md-4 form-group">
                              <label>Expiry Year</label>
                              <select
                                name="exp_year"
                                className="form-control"
                                value={this.state.exp_year}
                                onChange={this.handleChange}
                              >
                                {this.state.years.map((year, i) => (
                                  <option value={year} key={i}>{year}</option>
                                ))}
                              </select>
                              {/*<input name="exp_year" className="form-control" value={this.state.exp_year} onChange={this.handleChange} type="number" min="2017" max="2100"/> */}
                              <span className="error">
                                {this.state.errors.exp_year}
                              </span>
                            </div>
                            <div className="col-md-4 form-group">
                              <label>CVC</label>
                              <input
                                name="cvc"
                                className="form-control"
                                value={this.state.cvc}
                                onChange={this.handleChange}
                                type="number"
                              />
                              <span className="error">
                                {this.state.errors.cvc}
                              </span>
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-6 form-group">
                              <label>Card Number</label>
                              <input
                                name="car_number"
                                className="form-control"
                                value={this.state.car_number}
                                onChange={this.handleChange}
                                type="number"
                                min="0"
                              />
                              <span className="error">
                                {this.state.errors.car_number}
                              </span>
                            </div>
                            <div className="col-md-6 form-group">
                              <label>Card Holder Name</label>
                              <input
                                name="car_holder_name"
                                className="form-control"
                                value={this.state.car_holder_name}
                                onChange={this.handleChange}
                                type="text"
                                min="1"
                                max="10"
                              />
                              <span className="error">
                                {this.state.errors.car_holder_name}
                              </span>
                            </div>
                          </div>

                          <div className="row form-group">
                            <div className="col-md-3 form-group">
                              <label>Country</label>
                              <input
                                name="address_country"
                                className="form-control"
                                value={this.state.address_country}
                                onChange={this.handleChange}
                                type="text"
                              />
                              <span className="error">
                                {this.state.errors.address_country}
                              </span>
                            </div>

                            <div className="col-md-3 form-group">
                              <label>State</label>
                              <input
                                name="address_state"
                                className="form-control"
                                value={this.state.address_state}
                                onChange={this.handleChange}
                                type="select"
                              />
                              <span className="error">
                                {this.state.errors.address_state}
                              </span>
                            </div>

                            <div className="col-md-3 form-group">
                              <label>City</label>
                              <input
                                name="address_city"
                                className="form-control"
                                value={this.state.address_city}
                                onChange={this.handleChange}
                                type="select"
                              />
                              <span className="error">
                                {this.state.errors.address_city}
                              </span>
                            </div>
                            <div className="col-md-3 form-group">
                              <label>Zip Code</label>
                              <input
                                name="address_zip"
                                className="form-control"
                                value={this.state.address_zip}
                                onChange={this.handleChange}
                                type="select"
                              />
                              <span className="error">
                                {this.state.errors.address_zip}
                              </span>
                            </div>
                          </div>

                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Address Line 1</label>
                              {/*<input name="userBio" className="form-control" rows="3" value={this.state.userBio} onChange={this.handleChange} type="text" />*/}
                              <textarea
                                name="address_line1"
                                className="form-control"
                                rows="3"
                                value={this.state.address_line1}
                                onChange={this.handleChange}
                                type="text"
                              ></textarea>
                              <span className="error">
                                {this.state.errors.address_line1}
                              </span>
                            </div>
                          </div>

                          <div className="row form-group">
                            <div className="col-md-12">
                              <label>Address Line 2</label>
                              {/*<input name="userBio" className="form-control" rows="3" value={this.state.userBio} onChange={this.handleChange} type="text" />*/}
                              <textarea
                                name="address_line2"
                                className="form-control"
                                rows="3"
                                value={this.state.address_line2}
                                onChange={this.handleChange}
                                type="text"
                              ></textarea>
                              <span className="error">
                                {this.state.errors.address_line2}
                              </span>
                            </div>
                          </div>

                          <div className="row form-group">
                            <div className="col-md-12">
                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-default"
                                onClick={this.clearInput}
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, { UpdateAccountInfo, FetchAccountInfo })(
  withCookies(AccountInformation)
);
