import React, { Component } from "react";
import { Link } from "react-router-dom";

class SidebarMenuExpert extends Component {
  render() {
    return (
      <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">
        <span className="sidebar-caption">Expert Controls</span>
        <ul className="nav nav-sidebar" id="menu">
          <li>
            <Link to="/update-profile">
              <i className="fa fa-user"></i>
              <span className="collapse in hidden-xs"> Update Profile</span>
            </Link>
          </li>
          {/*<li><Link to="/dashboard/inbox"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Inbox</span></Link></li>*/}
          <li>
            <Link to="/dashboard/session-reviews">
              <i className="fa fa-commenting-o" aria-hidden="true"></i> Session
              Reviews
            </Link>
          </li>
          <li>
            <Link to="/mysession-list">
              <i className="fa fa-desktop"></i> Sessions History
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default SidebarMenuExpert;
