import React, { Component } from "react";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";

class MessageItem extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  render() {
    const currentUser = this.props.cookies.get("user");
    return (
      <div
        className={
          currentUser === this.props.author._id
            ? "message current-user"
            : "message"
        }
      >
        <span className="message-body">{this.props.message}</span>
        <br />
        <span className="message-byline">
          From {this.props.author.profile.firstName}
          {this.props.author.profile.lastName} | {this.props.timestamp}
        </span>
      </div>
    );
  }
}

export default withCookies(MessageItem);
