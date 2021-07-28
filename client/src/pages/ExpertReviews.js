/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import { useDispatch } from "react-redux";
import { Collapse } from "react-bootstrap";
import Moment from 'moment';

import { getExpertReviews } from '../actions/expert';

let _isMounted = false;

const ExpertReviews = props => {
  const _default = {
    expertSlug: props.expertSlug,
    expertReviews: []
  };

  const [state, setState] = useState(_default);
  const dispatch = useDispatch();

  useEffect(() => {
    _isMounted = true;
    let expertSlug = state.expertSlug;
    _isMounted && dispatch(getExpertReviews({expertSlug}))
      .then((response) => {
        _isMounted && setState(state => ({...state, expertReviews: response.reviews}));
        
      })
      .catch(err => {
          console.log(err);
        // err.response.json().then(({errors}) => {
        //   console.log(errors);
        // })
      });
      return () => {
        _isMounted = false;
      }
  }, []);

  const expertReviewList = () => {
    var expertReviews = state.expertReviews;
    var firstExpertReviews = expertReviews.slice(0, 4);
    var secondExpertReviews = expertReviews.slice(4);
    if (expertReviews.length === 0) {
      return (
        <div className="review-outside">
          <h4 className="alert alert-warning">No reviews submitted yet.</h4>
        </div>
      );
    }
    return (
      <div className="review-outside">
        {firstExpertReviews.map((review, index) => (
          <div className="review-section-wrap" key={index}>
            <div className="review-star">
              <span>
                
                {review.rating}t
                <span>★</span>
              </span>
              <h3>
                <strong>{review.userFullName}</strong>
                <p className="time-review">
                  {Moment(review.createdAt).fromNow() }
                </p>
              </h3>
            </div>
            <div className="comment-review">
              <p>{review.review}</p>
            </div>
          </div>
        ))}

        <Collapse in={state.open} className="expert-reviews-collapse">
          <div>
            {secondExpertReviews.map((reviews, index) => (
              <div className="review-section-wrap" key={index}>
                <div className="review-star">
                  <span>
                    
                    {reviews.rating}
                    <span>★</span>
                  </span>
                  <h3>{reviews.title}</h3>
                </div>
                <div className="comment-review">
                  <p>{reviews.review}</p>
                </div>
              </div>
            ))}
          </div>
        </Collapse>

        <div
          className="view-all-wrap"
          style={{ display: secondExpertReviews.length ? "block" : "none" }}
        >
          <a
            onClick={() => setState({ ...state, open: !state.open })}
          >            
            {!state.open ? "View all reviews" : "View some reviews"}
          </a>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="col-sm-12">{expertReviewList()}</div>
    </div>
  );
}

export default ExpertReviews;