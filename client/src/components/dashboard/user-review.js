import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler, tokBoxApikey } from '../../actions/index';
import $ from 'jquery'
import { Modal, Button, Panel } from 'react-bootstrap';
var Rating = require('react-rating');
import axios from 'axios';
import { saveUserReview } from '../../actions/expert';
var moment = require('moment');

class UserReview extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          userRating: 0,
          userReview: '',
          reviewTitle: '',
          expertInfo: '',
          userInfo: '',
          redirectAlert: false,
          reviewBy:"",
          currentDate: moment().format('LLLL')

        };
        
        this.ratingChange = this.ratingChange.bind(this);
        this.reviewChange = this.reviewChange.bind(this);
        this.reviewTitleChange = this.reviewTitleChange.bind(this);
        this.submitReview = this.submitReview.bind(this);
        
    }
    
    componentDidMount(){
        var slug = this.props.expertSlug;
        // this.setState({reviewBy:this.props.reviewBy})

        axios.get(`${API_URL}/getExpertDetail/${slug}`).then(res => {
            const expertInfo = res.data[0];
            this.setState({expertInfo})
        }).catch(err => {});
        
        var userInfo = cookie.load('user');
        if(userInfo){
            // console.log('*** userCookie *** '+ JSON.stringify(userInfo));
            this.setState({
                userInfo
            });
        }
        
    }
    
    ratingChange(rate){
        var userRating = rate;
        this.setState({
            userRating
        });
    }
    
    reviewChange(e){
        var userReview = e.target.value;
        this.setState({
            userReview
        });
    }
    
    reviewTitleChange(e){
        var reviewTitle = e.target.value;
        this.setState({
            reviewTitle
        });
    }
    
    submitReview(e){
        var rating = this.state.userRating;
        var review = this.state.userReview;
        var title = this.state.reviewTitle;
        var expertEmail = this.state.expertInfo.email;
        var expertFullName = this.state.expertInfo.profile.firstName + ' ' +this.state.expertInfo.profile.lastName;
        var userEmail = this.state.userInfo.email;
        var userFullName = this.state.userInfo.firstName + ' '+ this.state.userInfo.lastName;
        var expertSlug = this.props.expertSlug;
        var reviewBy = this.props.reviewBy;
        
        this.props.saveUserReview({ rating, review, title, expertEmail, expertFullName, userEmail, userFullName, expertSlug, reviewBy }).then(
        	(response)=>{
                        console.log(JSON.stringify(response));
                        this.setState({
                            redirectAlert: true
                        });
                        this.props.onSubmitReview();
                        
                
        	},
        	(err) => err.response.json().then(({errors})=> {
                        console.log('errors: '+JSON.stringify(errors));
                })
        )
        
        
        console.log('*** user rating ***' + rating);
        console.log('*** user review ***' + review );
        console.log('*** expert full Name *** '+ this.state.expertInfo.profile.firstName + ' ' +this.state.expertInfo.profile.lastName);
        console.log('*** expertInfo *** '+ JSON.stringify(this.state.expertInfo));
    }
    
    render(){
        return(
            <div>
            {/* Expert review modal : START  */}   
            <Modal className="modal-container user-review-modal Your-Receipt-modal" show={this.props.showUserReviewModal} onHide={this.close} animation={true} bsSize="">
               <Modal.Header>
                   <div className="Your_receipt">
                        <h1>{ this.props.reviewBy == 'User' ? 'Your Receipt' : 'Your Review' }</h1>
                        <h3>{ this.state.currentDate }</h3>
                    </div>
               </Modal.Header>
               <Modal.Body>
               
                    <div className="alert alert-info" style={ { display: ( this.state.redirectAlert ? 'block' : 'none' ) } }>
                        { this.props.reviewBy == 'User' &&  'Thank you for submitting your review for your session with ' + this.props.reviewModalData.name + ', your review will be visible on Expert\'s profile soon.'}
                        { this.props.reviewBy == 'Expert' &&  'Thank you for submitting your review.'}
                        <p>Redirecting you to home page <i className="fa fa-spinner"></i></p>
                        
                    </div>
                    
                    { this.props.reviewBy == 'User' &&  <div className="Rate_price">
                        <h1>${ this.props.reviewModalData.sessionPaymentAmount +'.00'}</h1>
                    </div> }
                    
            
                    <div className="Name_and_details_area">
                        <div className="man_img"><img src={ this.props.reviewModalData.image } /></div>
                        <span>{ this.props.reviewModalData.name }</span>
                            <i className={ this.props.reviewModalData.icon_classname } aria-hidden="true"></i>
                    </div>
            
                    { this.props.reviewBy == 'User' &&  <div className="need-help">
                        <a href="">need-help?</a>
                    </div> }
                    
            
                    <div className="Rate_ride">
                        <span>{ this.props.reviewModalData.rate_your_text }</span>
                    </div>

                    <div className="Review_star">
                        <Rating onChange={ (rate) =>  this.ratingChange(rate) } initialRate={ this.state.userRating } empty="fa fa-star-o fa-2x" full="fa fa-star fa-2x" />
                    </div>
            
                     <form className="leave_comment">
                        <textarea  onChange={this.reviewChange} placeholder="Leave a Comment"></textarea>
                     </form>   
                </Modal.Body>
               <Modal.Footer>
                   <Button className="Submit_comment" bsStyle="success" onClick={this.submitReview}>Submit</Button>
               </Modal.Footer>
            </Modal> 
            {/* Expert review modal : END  */}
            </div>
        );
    }
}

export default connect(null, { saveUserReview })(UserReview);