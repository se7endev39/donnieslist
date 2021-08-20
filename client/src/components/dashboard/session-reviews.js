/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Panel, Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import { getExpertReviews } from "../../actions/expert";
import SidebarMenuExpert from "./sidebar-expert";

let _isMounted = false;

const SessionReviews = (props) => {
  const default_props = {
    sessionReviews: [],
    role: "",
  };
  const dispatch = useDispatch();
  const [state, setState] = useState(default_props);
  const [cookies] = useCookies();

  useEffect(() => {
    _isMounted = true;
    const expertCookie = cookies.user;
    const expertSlug = expertCookie.slug;
    _isMounted && dispatch(getExpertReviews({ expertSlug: expertSlug }))
      .then((response) => {
        setState({ ...state, sessionReviews: response.reviews });
      })
      .catch((err) => {
        console.log(err);
      });
      return  () => {
        _isMounted = false;
      }
  }, []);


  return (
    <div className="container my-reviews-wrapper">
      <div className="row">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item">My reviews</li>
        </ol>
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
                  <tbody>
                    {state.sessionReviews.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No reviews found!
                        </td>
                      </tr>
                    ) : (
                      <>
                        {state.sessionReviews.map((reviews, index) => (
                          <tr key={`TR_${index}`}>
                            <td>{index + 1}</td>
                            <td>{reviews.userFullName}</td>
                            <td>{reviews.title}</td>
                            <td>{reviews.review}</td>
                            <td>{reviews.rating}</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </Table>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReviews;
