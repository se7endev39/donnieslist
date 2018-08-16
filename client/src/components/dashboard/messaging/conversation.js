import React, { Component } from 'react';
import { Link,IndexLink } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../actions/messaging';

import MessageList from './message-list';
import ReplyMessage from './reply-message';

const socket = actions.socket;

class Conversation extends Component {
  constructor(props) {
    super(props);

    const { params, fetchConversation } = this.props;
    // Fetch conversation thread (messages to/from user)
    fetchConversation(params.conversationId);
    socket.emit('enter conversation', params.conversationId);

    // Listen for refresh messages from socket server
    socket.on('refresh messages', (data) => {
      console.log('refresh messages called');
      fetchConversation(params.conversationId);
    });

  }

  componentWillUnmount() {
    socket.emit('leave conversation', this.props.params.conversationId);
  }

  renderInbox() {
    if (this.props.messages) {
      return (
        <MessageList displayMessages={this.props.messages} />
      );
    }
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
      <div className="conversation-list-page">
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
                    <div className="title">Conversation with {this.props.params.conversationId}</div>
                  </div>
                  <div className="conversation-list-section">
                    { this.renderInbox() }
                  </div>
                  <div className="conversation-reply-section">
                    <ReplyMessage replyTo={this.props.params.conversationId} />
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
    messages: state.communication.messages,
  };
}

export default connect(mapStateToProps, actions)(Conversation);
