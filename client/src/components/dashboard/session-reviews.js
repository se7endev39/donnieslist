import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import * as actions from '../../actions/messaging';
const socket = actions.socket;
import { Modal, Button, Panel, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getExpertReviews } from '../../actions/expert';
import cookie from 'react-cookie';
import SidebarMenuExpert from './sidebar-expert';


class SessionReviews extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        sessionReviews: [],
        role:'',
    }
    
  }
  
  componentWillMount(){
    const expertCookie = cookie.load('user');
    const expertSlug = expertCookie.slug;

    const role = expertCookie.role
    console.log(role)

    this.props.getExpertReviews({expertSlug :expertSlug }).then(
            (response)=>{
                //console.log('**** get session reviews success  ****'+ JSON.stringify(response) );
                const sessionReviews = response.reviews;
                this.setState({
                    sessionReviews
                });
                
            },
            (err) => err.response.json().then(({errors})=> {
                //console.log('**** get session reviews error ****'+ JSON.stringify(errors) );
            })
        )
  }
  
  breadcrumb(){
    return(
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
        <li className="breadcrumb-item">My reviews</li>
      </ol>
    );
  }
  
  renderUserReview(){
      var sessionReviews = this.state.sessionReviews;
      
      if(sessionReviews.length == 0){
        return(
              <tr>
                <td colSpan='5' className="text-center">No reviews found!</td>
              </tr>
          );
      }
      
      return (
        sessionReviews.map((reviews, index) =>
            <tr>
                <td>{ index + 1 }</td>
                <td>{ reviews.userFullName }</td>
                <td>{ reviews.title }</td>
                <td>{ reviews.review }</td>
                <td>{ reviews.rating }</td>
            </tr>
        )
       );
  }
  
  render(){
    return (
      <div className="container my-reviews-wrapper">
        <div className="row">
           
            { this.breadcrumb() }
    
            <div className="wrapper-sidebar-page">
              <div className="row row-offcanvas row-offcanvas-left">
                  <SidebarMenuExpert/>
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
                                    { this.renderUserReview() }
                                </tbody>
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

export default connect(null, { getExpertReviews })(SessionReviews);


