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
            <Modal className="modal-container user-review-modal" show={this.props.showUserReviewModal} onHide={this.close} animation={true} bsSize="">
               <Modal.Header>
                   <Modal.Title>Give your review</Modal.Title>
               </Modal.Header>
               <Modal.Body>
               
                    <div className="alert alert-info" style={ { display: ( this.state.redirectAlert ? 'block' : 'none' ) } }>
                        You will be redirecting to home page in 2 secs.
                    </div>
            
            
                    <form id="user-review-form" >
                        <input type="hidden" value={ this.state.userRating } />
                        
                        <div className="row form-group">
                            <div className="col-md-12 col-sm-12 col-lg-12">
                                <input type="text" onChange={ this.reviewTitleChange } className="form-control" name="review_title" placeholder="title" />
                            </div>
                        </div>
                        
                        <div className="row form-group">
                            <div className="col-md-12 col-sm-12 col-lg-12">
                                <textarea onChange={ this.reviewChange } row="5" className="form-control" name="review" placeholder="write your review here..."></textarea>
                            </div>
                        </div>
                    </form>
            
                    <div className="row form-group review_column">
                        <div className="col-md-12 col-sm-12 col-lg-12">
                            <Rating onChange={ (rate) =>  this.ratingChange(rate) } initialRate={ this.state.userRating } empty="fa fa-star-o fa-2x" full="fa fa-star fa-2x" />
                        </div>
                    </div>
                    
                    
                </Modal.Body>
               <Modal.Footer>
                   <Button bsStyle="success" onClick={this.submitReview}>Submit</Button>
               </Modal.Footer>
            </Modal> 
            {/* Expert review modal : END  */}
            </div>
        );
    }
}

export default connect(null, { saveUserReview })(UserReview);