import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import axios from 'axios';
import Masonry from 'react-masonry-component';
import {connect} from 'react-redux';
import CommunityNews from './CommunityNews';
import cookie from 'react-cookie';
import { setpage } from '../../actions/setpage';

const masonryOptions = {
    transitionDuration: 0
};

class HomePage extends Component {

    /**
    * Class constructor.
    */
  constructor(props, context) {
    super(props, context);
    this.state = {
      category :"",
      posts: [],
      loading: true,
      error: null,
      searchval: false,
      displaysearch: false,
    };
  }

  componentDidMount() {
    this.props.setpage('HOME');
    axios.get(`${API_URL}/getExpertsCategoryList`)
      .then(res => {
        // debugger
        const posts = res.data.map(obj => obj);
        this.setState({
          posts,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  getStars(rating) {
    const size = Math.max(0, (Math.min(5, rating))) * 16;
    return Object.assign(
      { width: size },
    );
  }

  selectVideoSessionMinutes(item, e) {
    this.setState({ selectedExpertSlug: item.slug });
    $('.notification-modal').trigger('click');
  }

  redirectToLogin(e) {
    e.preventDefault();
    browserHistory.push('/login');
    cookie.save('requiredLogin_for_session', 'Please login to start video session', { path: '/' });
  }
  
  getOnlineStatus(onlineStatus) {
    return (onlineStatus === 'ONLINE');
  }

  selectVideoSessionMinutes(item, e) {
    this.setState({ selectedExpertSlug: item.slug });
    $('.notification-modal').trigger('click');
  }

  getsearchitem() {
    const imageStyle = {
      background: '#ffffff',
      padding: 15,
    };
    const currentUser = cookie.load('user');
    return (
      <div id="experts-list" className="experts-list">
      <div className="expertise-tab-wrap">
        <div className="expertise-inner">
          <div className="container">
          <div className="expertise-all-detail-wrap">

        {this.props.searchvalue.map(post => <div>
          <div className="expertise-detail-only">
            <div className="row">
              <div className="col-sm-8">
                <div className="row">
                  <div className="col-sm-2" style={imageStyle}>
                    <div className="img-exper">
                      {post.profileImage !== '' ? <img width="100" src={`${Image_URL}${post.profileImage}`} /> : <img src="/src/public/img/pro1.png" /> }
                      {this.getOnlineStatus(post.onlineStatus) && <i data-toggle="title" title="Online" className={'user-online-o fa fa-circle'} aria-hidden="true" />}
                    </div>
                  </div>
                  <div className="person-per-info">
                    <p>University: {post.university}</p>
                    <p>Area of Expertise: {post.expertCategories}</p>

                    <p>Focus of Expertise: {post.expertFocusExpertise}</p>
                    <p>Years of Expertise: {post.yearsexpertise}</p>
                    <p>Rating: {post.expertRating && post.expertRating != null && post.expertRating != undefined && post.expertRating != '' ? post.expertRating : 'No Ratings Available Yet'} {post.expertRating && post.expertRating != '' && <i className="fa fa-star" aria-hidden="true" />}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="stars-review">
                  <span className="stars right">
                    <span style={this.getStars(post.rating)} />
                  </span>
                </div>
                {currentUser ? <Link data-toggle="modal" title="Start Video Session" data-target="#notificationModal" to="javascript:;" onClick={this.selectVideoSessionMinutes.bind(this, post)} data-slug={post.slug} className="Start-Session btn-strt-session btn btn-primary pull-right">Connect</Link> : <div><Link title="Start Video Session" to="#" onClick={this.redirectToLogin.bind(this)} className="Start-Session btn-strt-session btn btn-primary pull-right">Connect</Link></div>}
              </div>
            </div>
          </div>
        </div>,
        )}
      </div>
      </div>
      </div>
      </div>
      </div>

    );
  }

  renderLoading() {
     return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
  }

  renderError() {
    console.log(this.state)
      return (
        <div className="error-message">
          Uh oh: {this.state.error.message}
        </div>
      );
  }

  getClassName(categoryName) {
      /*if(categoryName == 'Music Lessons' || categoryName == 'Computer Skills' || categoryName == 'Academic Tutoring' || categoryName == 'Academic Advising/ Career Advice'){
        return 'col-md-3 cat-visible';
      }else{
        return 'col-md-3 ';
      }*/

      return 'col-md-3 cat-visible';
  }

  getCategoryLink(categorySlug, categoryName, expertNumbers){
    if(categorySlug == 'forum'){
      return <Link to={`/${categoryName}`}>{categoryName} {(expertNumbers > 0) ? '('+expertNumbers+')' : ''}</Link>;
    }else{
      return <Link to={`/list/${categorySlug}`}>{categoryName} {(expertNumbers > 0) ? '('+expertNumbers+')' : ''}</Link>;
    }
  }

  renderPosts() {
      if(this.state.error) {
        return this.renderError();
      }

      const imagesLoadedOptions = { background: '.my-bg-image-el' }

      return (
        <div id="experts-list" className="experts-list">
          <div className="container">
            <div className="row">
              {/*<div className="row">
                  <div className="col-md-12">
                    <div className="text-center text-choose">Choose your subject</div>
                  </div>
                </div>*/
              }
              <div className="col-md-12">
                <Masonry
                  className={'my-gallery-class'}
                  elementType={'div'}
                  options={masonryOptions}
                  disableImagesLoaded={false}
                  updateOnEachImageLoad={false}
                  imagesLoadedOptions={imagesLoadedOptions}>
                  {
                    this.state.posts.map((post, index) => (
                      <div key={ post.id } className={this.getClassName(post.name)}>
                        <h4 className="center_h4">
                          <a href="javascript:void()">{post.name}</a>
                          <span className="long-dash"></span>
                          <span className="short-dash"></span>
                          <span className="short-dash"></span>
                        </h4>
                        <h4 className={'community-news-parent'}>
                            <Link to={'community-news/'+post.slug} className={'community-news-link'}>
                                Community
                            </Link>
                        </h4>
                        <ul className="topics">
                          { post.subcategory.map((subcat, index) =>
                            <li key={ subcat.id }>
                              {this.getCategoryLink(subcat.slug, subcat.name, post.subcategory_experts[index].length)}
                            </li>
                          )}
                        </ul>
                      </div>
                    ))
                  }
                </Masonry>
              </div>
            </div>
          </div>
        </div>
      );
    }

  /**
   * Render the component.
   */
  render() {
    let x = 0;

    try {
      x = this.props.searchvalue[0].slug.length;
    } catch (err) {
      x = 0;
    }

    if (x > 0) {
      console.log(x);
      return this.getsearchitem();
    }

    if (this.state.loading) {
      return this.renderLoading();
    }

    return this.renderPosts();
  }
}

function mapStateToProps(state) {
  const val = state.searchvalue.searchval;
  return {
    searchvalue: val,
  };
}

export default connect(mapStateToProps, { setpage })(HomePage);