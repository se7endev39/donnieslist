import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';

import { setPage } from '../actions/setPage';
import { API_URL } from '../constants/api';
import {SAMPLE_DATA} from '../constants/sample-data';
import { withRouter } from 'react-router-dom';

const masonryOptions = {
  transitionDuration: 0,
};


class CommunityNews extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      category: '',
    };
  }

  componentDidMount() {
    const category = this.props.match.params.category;
    this.props.setPage(category);

    axios.get(`${API_URL}/getExpertStoriesBasedOnRole/${category}`)
      .then((res) => {
        // debugger
        const posts = res.data.map(obj => obj);
        this.setState({
          posts,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err,
        });
      });
  }

  renderLoading() {
    return <img alt="loading" className="loader-center" src="/img/ajax-loader.gif" />;
  }

  renderError() {
    return (
      <div className="error-message">
        Uh oh: {this.state.error.message}
      </div>
    );
  }

  gettime(uptime) {
    const today = new Date();
    const difference = Math.floor((today.getTime() - uptime) / 1000);
    console.log(difference);
    if (difference < 60) {
      return `${difference}s ago`;
    } else if (difference < 3600) {
      const diff = Math.floor(difference / 60);
      return `${diff}mins ago`;
    } else if (difference < 86400) {
      const diff = Math.floor(difference / 3600);
      return `${diff}hours ago`;
    } else if (difference < 2592000) {
      const diff = Math.floor(difference / 86400);
      return `${diff}days ago`;
    } else if (difference < 31536000) {
      const diff = Math.floor(difference / 2592000);
      return `${diff}months ago`;
    } else if (difference > 31536000) {
      const diff = Math.floor(difference / 31536000);
      return `${diff}years ago`;
    }
  }
  render() {
    const category = this.props.match.params.value;
    let count = -1;
    const imgsizes = ['302px', '302px'];
    const childElements = SAMPLE_DATA.map((blurb, index) => {
      count += 1;
      if (count === 2) {
        count = 0;
      }
      const profileURL = `/expert/${category}/${blurb.expertdetail[0].slug}`;
      return (
        <div className="image-element-class" key={`BLURB_${index}`}>
          <a href="blurb.video.videoURL"><img src={blurb.video.screenShotURL} alt="blurb" className="mas-image" width="170px" height={imgsizes[count]} /></a>
          <a href={profileURL} className="mas-profile"><img alt="P" src={blurb.expert.profileimage} className="mas-profile-image" /></a>
          <h5 className="mas-expert-name">{`${blurb.expert.name.firstname} ${blurb.expert.name.lastname}`}</h5>
          <p className="mas-time">{this.gettime(blurb.timestamp.uploadedAt)}</p>
        </div>
      );
    });
    return (
      <div className="container">
        <Masonry
          className={'my-gallery-class'}
          options={masonryOptions}
          disableImagesLoaded={false}
          updateOnEachImageLoad={false}
        >
          {childElements}
        </Masonry>
      </div>
    );
  }
}

export default connect(null, { setPage })(withRouter(CommunityNews));
