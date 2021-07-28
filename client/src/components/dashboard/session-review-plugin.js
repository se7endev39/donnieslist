import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// import * as actions from '../../actions/messaging';
import { Panel, Table} from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import { connect } from "react-redux";

import { getExpertReviews } from "../../actions/expert";
import SidebarMenuExpert from "./sidebar-expert";

// const socket = actions.socket;

class SessionReviews extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      sessionReviews: [],
      role: "",
    };
  }
  
  componentDidMount() {
    const expertCookie = this.props.cookies.get("user");
    const expertSlug = expertCookie.slug;

    this.props.getExpertReviews({ expertSlug: expertSlug }).then(
      (response) => {
        const sessionReviews = response.reviews;
        this.setState({
          sessionReviews,
        });
      },
      (err) =>
        err.response.json().then(({ errors }) => {
        })
    );
  }

  breadcrumb() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="breadcrumb-item">My reviews</li>
      </ol>
    );
  }

  renderUserReview() {
    var sessionReviews = this.state.sessionReviews;

    if (sessionReviews.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center">
            No reviews found!
          </td>
        </tr>
      );
    }

    return sessionReviews.map((reviews, index) => (
      <tr key={`TR_${index}`}>
        <td>{index + 1}</td>
        <td>{reviews.userFullName}</td>
        <td>{reviews.title}</td>
        <td>{reviews.review}</td>
        <td>{reviews.rating}</td>
      </tr>
    ));
  }

  render() {
    return (
      <div className="container my-reviews-wrapper">
        <div className="row">
          {this.breadcrumb()}
          <div className="wrapper-sidebar-page">
            <div className="row row-offcanvas row-offcanvas-left">
              <SidebarMenuExpert />
              <div className="column col-sm-9 col-xs-11">
                <Panel header={<h3>Session reviews</h3>} bsStyle="primary">
                  <Table striped bordered condensed hover>
                    <thead>
                      <tr>
                        <th width="6%">#</th>
                        <th width="15%">User Name</th>
                        <th width="15%">Title</th>
                        <th width="60%">Review</th>
                        <th width="4%">Rating</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderUserReview()}</tbody>
                  </Table>
                </Panel>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { getExpertReviews })(withCookies(SessionReviews));
