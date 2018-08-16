import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link,IndexLink } from 'react-router';
import { fetchConversations } from '../../../actions/messaging';

import ConversationList from './conversation-list';

class Inbox extends Component {
  componentWillMount() {
    // Fetch inbox (conversations involving current user)
    this.props.fetchConversations();
  }

  renderInbox() {
    if (this.props.conversations && this.props.conversations.length > 0) {
      return (
        <ConversationList conversations={this.props.conversations} />
      );
    }

    return <div className="alert alert-danger">You do not have any active conversations.</div>;
  }

  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
        <li className="breadcrumb-item">Inbox</li>
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

  render() {
    return (
      <div className="session-page">
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
                    <div className="title">Inbox <Link className="btn btn-primary right" to="/dashboard/conversation/new">Compose Message</Link></div>
                  </div>
                  <div className="list-group">
                    {this.renderInbox()}
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

function mapStateToProps(state) {
  return {
    conversations: state.communication.conversations,
  };
}

export default connect(mapStateToProps, { fetchConversations })(Inbox);
