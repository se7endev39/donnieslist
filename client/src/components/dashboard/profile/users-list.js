import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";

import { protectedTest } from "../../../actions/auth";
import { getUsersList } from "../../../actions/admin";
import SidebarMenuAdmin from "../sidebar-admin";
// import SidebarMenuExpert from '../sidebar-expert';
// import SidebarMenuUser from '../sidebar-user';

import { BanMe, UnBanMe, deleteMe } from "../../../actions/admin";

const color = function (x) {
  if (x && x !== null && x % 2 === 0) return "#c6c6c6";
  else return "white";
};

class UsersList extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      SuccessMessage: "",
      errorMessage: "",
      role: "",
    };
    this.props.protectedTest();
    this.BanMe = this.BanMe.bind(this);
    this.UnBanMe = this.UnBanMe.bind(this);
    this.deleteMe = this.deleteMe.bind(this);
  }

  adminMenu() {
    return <SidebarMenuAdmin />;
  }
  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">Users List</li>
      </ol>
    );
  }

  isRole(roleToCheck, toRender) {
    const userRole = this.props.cookies.get("user").role;
    if (userRole === roleToCheck) {
      return toRender;
    }
    return false;
  }
  UNSAFE_componentWillMount() {
    this.getList();
  }

  getList() {
    try {
      this.props.getUsersList().then(
        (response) => {
          const userRole = this.props.cookies.get("user").role;
          this.setState({ role: userRole });
          if (userRole === "Admin") {
            this.setState({ users: response.user });
          } else {
            this.setState({ users: [] });
            this.setState({
              errorMessage: "Sorry You Are Not Authorized To See This List",
            });
          }
        },
        (err) =>
          err.response.json().then(({ errors }) => {
            // console.log("err");
          })
      );
    } catch (e) {
      console.log("exception " + e);
    }
  }

  deleteMe(e) {
    e.preventDefault();

    this.props.deleteMe(e.target.value).then((response) => {
      if (
        response.SuccessMessage &&
        response.SuccessMessage !== null &&
        response.SuccessMessage !== undefined
      ) {
        if (
          response.state &&
          response.state !== null &&
          response.state !== undefined &&
          response.state === "Deleted"
        ) {
          this.setState({ SuccessMessage: response.SuccessMessage });
          this.getList();
        } else {
          this.setState({ SuccessMessage: response.SuccessMessage });
        }
      }
    });
  }

  BanMe(e) {
    e.preventDefault();

    var id = e.target.value;
    var confirm = false;
    var confirm2 = false;
    if (id == null || id === undefined || id === "") {
      id = e.target.parentNode.value;
      confirm2 = true;
    } else {
      confirm = true;
    }

    // console.log(id)
    // var confirm
    this.props.BanMe(id).then((response) => {
      if (
        response.SuccessMessage &&
        response.SuccessMessage !== null &&
        response.SuccessMessage !== undefined
      ) {
        // location.reload()
        if (
          response.state &&
          response.state !== null &&
          response.state !== undefined &&
          response.state === "Banned"
        ) {
          this.setState({ SuccessMessage: response.SuccessMessage });
        } else {
          this.setState({ SuccessMessage: response.SuccessMessage });
        }
      }
    });

    if (
      confirm &&
      confirm != null &&
      confirm !== undefined &&
      confirm === true &&
      confirm !== ""
    ) {
      console.log("Confirm 1");
      if (e.target.children[0].style.color === "red") {
        console.log("Confirm 1.a");
        console.log(e.target);
        e.target.children[0].style.color = "green";
        e.target.children[0].title = "Enable It";
        e.target.title = "Enable It";
        // e.target.title="Enable It"
        e.target.parentNode.parentNode.children[4].children[0].innerHTML = "No";
      } else {
        console.log("Confirm 1.b");
        console.log(e.target);
        e.target.children[0].style.color = "red";
        e.target.children[0].title = "Disable It";
        e.target.title = "Disable It";
        e.target.parentNode.parentNode.children[4].children[0].innerHTML =
          "Yes";
      }
    }
    if (
      confirm2 &&
      confirm2 != null &&
      confirm2 !== undefined &&
      confirm2 === true &&
      confirm2 !== ""
    ) {
      console.log("Confirm2");
      if (e.target.style.color === "red") {
        console.log("Confirm 2.a");
        console.log(e.target);
        e.target.title = "Enable It";
        e.target.parentNode.title = "Enable It";
        e.target.style.color = "green";
        e.target.parentNode.parentNode.parentNode.children[4].children[0].innerHTML =
          "No";
      } else {
        console.log("Confirm 2.b");
        console.log(e.target);
        e.target.title = "Disable It";
        e.target.parentNode.title = "Disable It";
        // console.log(e.target)
        // console.log(e.target.title)
        e.target.style.color = "red";
        e.target.title = "Disable";
        e.target.parentNode.parentNode.parentNode.children[4].children[0].innerHTML =
          "Yes";
      }
    }
  }

  UnBanMe(e) {
    e.preventDefault();
    var id = e.target.value;
    if (id === null || id === undefined || id === "") {
      id = e.target.parentNode.value;
    }

    this.props.UnBanMe(id).then((response) => {
      if (
        response.SuccessMessage &&
        response.SuccessMessage !== null &&
        response.SuccessMessage !== undefined
      ) {
        this.setState({ SuccessMessage: "Successfully Un-Baned The User" });
      }
    });
  }

  render() {
    const successM = (
      <div className="alert alert-success">{this.state.SuccessMessage}</div>
    );
    const errorsM = (
      <div className="alert alert-danger">{this.state.errorMessage}</div>
    );
    return (
      <div className="session-page">
        <div className="container">
          <div className="row">
            {this.breadcrumb()}
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                {this.isRole("Admin", this.adminMenu())}
                {/*                  {this.isRole('Expert', this.expertMenu())}
                  {this.isRole('User', this.userMenu())}*/}
                <div className="column col-sm-9 col-xs-11" id="main">
                  <div id="pageTitle">
                    <div className="title">User List</div>
                    {this.state.SuccessMessage &&
                    this.state.SuccessMessage != null &&
                    this.state.SuccessMessage !== undefined &&
                    this.state.SuccessMessage !== ""
                      ? successM
                      : ""}
                    {this.state.errorMessage &&
                    this.state.errorMessage != null &&
                    this.state.errorMessage !== undefined &&
                    this.state.errorMessage !== ""
                      ? errorsM
                      : ""}
                  </div>
                  <p>{this.props.content}</p>
                  <div>
                    {this.state.role === "Admin" && (
                      <table>
                        <tr>
                          <th
                            style={{ width: 20 + "%", paddingLeft: 10 + "px" }}
                          >
                            First Name
                          </th>
                          <th style={{ width: 20 + "%" }}>Second Name</th>
                          <th style={{ width: 40 + "%" }}>Email</th>
                          <th style={{ width: 10 + "%" }}>Role</th>
                          <th style={{ width: 50 + "%" }}>Enabled</th>
                          <th style={{ width: 50 + "%" }}>Action</th>
                        </tr>
                        {this.state.users &&
                        this.state.users !== null &&
                        this.state.users !== undefined
                          ? this.state.users.map((user, index) => (
                              <TableRow
                                key={index}
                                index={index}
                                data={user}
                                BanMe={this.BanMe}
                                UnBanMe={this.UnBanMe}
                                deleteMe={this.deleteMe}
                              />
                            ))
                          : "y"}
                      </table>
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

class TableRow extends React.Component {
  render() {
    // debugger
    return (
      <tr style={{ background: color(this.props.index) }}>
        <td>
          <h4 style={{ paddingLeft: 10 + "px" }}>
            {this.props.data.profile.firstName}
          </h4>
        </td>
        <td>
          <h4>
            {this.props.data.role &&
            this.props.data.role != null &&
            this.props.data.role !== undefined &&
            this.props.data.role === "Expert" ? (
              <a href={"/dashboard/userslist/" + this.props.data._id}>
                {this.props.data.profile.lastName}
              </a>
            ) : (
              this.props.data.profile.lastName
            )}
          </h4>
        </td>
        <td>
          <h4>{this.props.data.email}</h4>
        </td>
        <td>
          <h4>{this.props.data.role}</h4>
        </td>
        <td>
          <h4>{this.props.data.enableAccount === true ? "Yes" : "No"}</h4>
        </td>
        <td>
          {this.props.data.enableAccount === true ? (
            <button
              className="btn "
              dataToggle="tooltip"
              title="Disable"
              style={{
                borderColor: "white",
                height: 50 + "px",
                width: 72 + "px",
              }}
              onClick={this.props.BanMe}
              value={this.props.data._id}
            >
              <h4 value={this.props.data._id} style={{ color: "red" }}>
                X
              </h4>
            </button>
          ) : (
            <button
              className="btn "
              dataToggle="tooltip"
              title="Enable"
              style={{
                borderColor: "white",
                height: 50 + "px",
                width: 72 + "px",
              }}
              onClick={this.props.BanMe}
              value={this.props.data._id}
            >
              <h4 style={{ color: "green" }}>X</h4>
            </button>
          )}
        </td>
        <td title="Delete">
          <button
            className="btn btn-danger"
            onClick={this.props.deleteMe}
            value={this.props.data._id}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}
function mapStateToProps(state) {
  return { content: state.auth.content };
}

export default connect(mapStateToProps, {
  protectedTest,
  getUsersList,
  BanMe,
  UnBanMe,
  deleteMe,
})(withCookies(UsersList));
