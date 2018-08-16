'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getExpertReviews } from '../../actions/expert';
import { Collapse, Well, Button } from 'react-bootstrap';
import Moment from 'react-moment';

class ExpertReviews extends Component {

    constructor(props, context){
        super(props, context);

        this.state = {
            expertSlug: this.props.expertSlug,
            expertReviews: []
        }

    }

    componentDidMount(){
        var expertSlug = this.state.expertSlug;
        this.props.getExpertReviews({expertSlug}).then(
            (response)=>{
                this.setState({
                    expertReviews: response.reviews
                });

            },
            (err) => err.response.json().then(({errors})=> {
                // console.log('**** getExpertReviews error ****'+ JSON.stringify(errors));
            })
        )
    }

    expertReviewList(){

        var expertReviews = this.state.expertReviews;
        var firstExpertReviews = expertReviews.slice(0, 4);
        var secondExpertReviews = expertReviews.slice(4);

        if(expertReviews.length == 0){
            return (
                <div className="review-outside">
                    <h4 className="alert alert-warning">No reviews submitted yet.</h4>
                </div>
            );
        }

        return (
            <div className="review-outside">
                { firstExpertReviews.map((reviews, index) =>
                    <div className="review-section-wrap">
                        <div className="review-star">
                            <span> { reviews.rating }<span>★</span></span>
                            <h3><strong>{ reviews.userFullName }</strong><p className="time-review"><Moment>{reviews.createdAt}</Moment></p></h3>
                        </div>
                        <div className="comment-review">
                            <p>{ reviews.review }</p>
                        </div>
                    </div>
                )}

                <Collapse in={this.state.open} className="expert-reviews-collapse">
                    <div>
                        { secondExpertReviews.map((reviews, index) =>
                    <div className="review-section-wrap">
                        <div className="review-star">
                            <span> { reviews.rating }<span>★</span></span>
                            <h3>{ reviews.title }</h3>
                        </div>
                        <div className="comment-review">
                            <p>{ reviews.review }</p>
                        </div>
                    </div>


                )}
                  </div>
                </Collapse>

                <div className="view-all-wrap" style={ { display: (secondExpertReviews.length ? 'block' : 'none' ) } } >
                    <a href="javascript: void(0)" onClick={ ()=> this.setState({ open: !this.state.open })} >  {  !this.state.open ? 'View all reviews' : 'View some reviews' }</a>
                </div>








            </div>
         );
    }


  render() {
    return (
      <div>
        <div className="col-sm-12">
           { this.expertReviewList() }
        </div>
      </div>
    );
  }
}


export default connect(null, { getExpertReviews })(ExpertReviews);
