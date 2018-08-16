import React, { Component } from 'react';

class ConversationItem extends Component {
  render() {
    return (
        <a href={`/dashboard/conversation/view/${this.props.conversationId}`} className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{this.props.author}</h5>
            <small>{this.props.timestamp}</small>
          </div>
          <p className="mb-1">{this.props.message}</p>
        </a>
    );
  }
}


export default ConversationItem;
