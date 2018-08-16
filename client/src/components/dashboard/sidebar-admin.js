'use strict';
import React, { Component } from 'react';
import { Link } from 'react-router';

class SidebarMenuAdmin extends Component {
  render() {
    return (
      <div className="column col-sm-3 col-xs-1 sidebar-offcanvas" id="sidebar">
        <span className="sidebar-caption">Admin Controls</span>
        <ul className="nav nav-sidebar" id="menu">
            <li>
                <a href="javascript:void(0)" data-target="#item1" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Users Management <span className="caret"></span></span></a>
                <ul className="nav nav-stacked collapse" id="item1">
                    <li><Link to="/dashboard/userslist">List Users</Link></li>
                    <li><Link to="/dashboard/create-expert">Create Expert</Link></li>
                </ul>
            </li>
            <li>
                <a href="javascript:void(0)" data-target="#item2" data-toggle="collapse"><i className="fa fa-list"></i> <span className="collapse in hidden-xs">Session Management <span className="caret"></span></span></a>
                <ul className="nav nav-stacked collapse" id="item2">
                    <li><Link to="/dashboard/sessionsList">List Active Sessions</Link></li>
                </ul>
            </li>
            <li><Link to="/update-profile"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Edit Profile</span></Link></li>
            {/*<li><Link to="/dashboard/inbox"><i className="glyphicon glyphicon-list-alt"></i> <span className="collapse in hidden-xs"> Inbox</span></Link></li>*/}
        </ul>
      </div>
    );
  }
}

export default SidebarMenuAdmin;
