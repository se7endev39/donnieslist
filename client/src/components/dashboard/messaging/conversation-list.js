import React, { Component } from "react";
import { Cookies, withCookies } from "react-cookie";
import moment from "moment";
import { instanceOf } from "prop-types";

import ConversationItem from "./conversation-item";

class ConversationList extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);

    this.userCookie = this.props.cookies.get("user");
  }

  render() {
    // const currentUser = this.userCookie._id;

    return (
      <div>
        {this.props.conversations.map((data) =>
          data.map((message) => (
            <ConversationItem
              key={message._id}
              message={message.body}
              authorId={message.author._id}
              conversationId={message.conversationId}
              author={`${
                message.author.profile.firstName
              } ${message.author.profile.lastName.substring(0, 1)}.`}
              timestamp={moment(message.createdAt).from(moment())}
            />
          ))
        )}
      </div>
    );
  }
}

export default withCookies(ConversationList);
