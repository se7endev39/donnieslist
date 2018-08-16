'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

class SidebarMenuUser extends Component {
  render() {
    return (
      <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">
          <span className="sidebar-caption">User Controls</span>
          <ul className="nav nav-sidebar" id="menu">
            <li><Link to="/update-profile"><i className="fa fa-pencil"></i> <span className="collapse in hidden-xs"> Update Profile</span></Link></li>
            <li><Link to="/account-info"><i className="fa fa-suitcase"></i> <span className="collapse in hidden-xs"> Account Information</span></Link></li>
            <li><Link to="/profile"><i className="fa fa-user"></i> <span className="collapse in hidden-xs"> Profile</span></Link></li>
            <li><Link to="/dashboard/my-reviews"><i className="fa fa-commenting-o"></i> <span className="collapse in hidden-xs"> My Reviews</span></Link></li>
          </ul>
      </div>
    );
  }
}

export default SidebarMenuUser;
