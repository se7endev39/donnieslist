import React, { Component } from 'react';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import axios from 'axios';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';
import { setpage } from '../../actions/setpage';


const masonryOptions = {
  transitionDuration: 0,
};


class CommunityNews extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      category: '',
      sampledata: [
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [
            {
              slug: 'mohit-rv',
            },
          ],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [
            {
              slug: 'mohit-rv',
            },
          ],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },
        {
          id: '1',
          video: {
            videoURL: 'http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg',
            duration: 5,
            screenShotURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
            size: 1024,
          },
          expert: {
            name: {
              firstname: 'test',
              lastname: 'test',
            },
            email: 'test@gmail.com',
            profileimage: 'https://www.gstatic.com/webp/gallery/5.jpg',
          },
          status: 'available',
          timestamp: {
            createdAt: '1540366745150',
            uploadedAt: '1540366745150',
          },
          expertdetail: [{
            slug: 'mohit-rv',
          }],
        },

      ],
    };
  }

  componentDidMount() {
    const category = this.props.params.value;
    this.props.setpage(category);

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
    return <img alt="loading" className="loader-center" src="/src/public/img/ajax-loader.gif" />;
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
    const category = this.props.params.value;
    let count = -1;
    const imgsizes = ['302px', '302px'];
    const childElements = this.state.sampledata.map((blurb) => {
      count += 1;
      if (count === 2) {
        count = 0;
      }
      const profileURL = `/expert/${category}/${blurb.expertdetail[0].slug}`;
      return (
        <div className="image-element-class">
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

export default connect(null, { setpage })(CommunityNews);
