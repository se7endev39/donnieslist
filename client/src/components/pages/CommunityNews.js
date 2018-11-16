import React, {Component} from 'react';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import axios from 'axios';
import {connect} from 'react-redux';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 0
};



class CommunityNews extends Component {

    constructor(props, context) {
        super(props, context);
    
    this.state = {
        category :"",
        sampledata: [
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"2",
            uploadedAt:"4"
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        },
        {id:"1",
          video:{
            videoURL:"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg",
            duration: 5,
            screenShotURL: "https://www.gstatic.com/webp/gallery/1.jpg",
            size: 1024, 
          },
          expert:{
            name:{
              firstname:"test",
              lastname:"test"
            },
            email:"test@gmail.com",
            profileimage:"https://www.gstatic.com/webp/gallery/5.jpg"
          },
          status:"available",
          timestamp:{
            createdAt:"",
            uploadedAt:""
          },
          expertdetail:[]
        }
        
      ]
      };
    }

    componentDidMount() {
        var category = this.props.params.value;
        const data = {page: category};
        this.props.dispatch({type:"UPDATE", data});

        axios.get(`${API_URL}/getExpertStoriesBasedOnRole/${category}`)
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

       renderLoading() {
        return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
     }
   
     renderError() {
         return (
           <div className="error-message">
             Uh oh: {this.state.error.message}
           </div>
         );
     }
   
    gettime(uptime){
      // let today = new Date();
      // let difference = today.getTime() - uptime;

      // let daysDifference = Math.floor(difference/1000/60/60/24);
      // difference -= daysDifference*1000*60*60*24

      // let hoursDifference = Math.floor(difference/1000/60/60);
      // difference -= hoursDifference*1000*60*60

      // let minutesDifference = Math.floor(difference/1000/60);
      // difference -= minutesDifference*1000*60

      // let secondsDifference = Math.floor(difference/1000);

      // return daysDifference + ' days ' + hoursDifference + ' hours ' + minutesDifference + ' minutes ' + secondsDifference + ' seconds ' + 'ago';
      return "1hour ago"
    }
    render() {
        let count=-1
        let imgsizes = ["302px", "302px"]
        const childElements = this.state.sampledata.map((blurb)=>{
        count+=1
        if(count == 2){
            count = 0
        }
        return (
             <div className="image-element-class">
                 <a href="blurb.video.videoURL"><img src={blurb.video.screenShotURL} className="mas-image" width="170px" height={imgsizes[count]}/></a>
                 <img src={blurb.expert.profileimage} className="mas-profile"/>
                 <h5 className="mas-expert-name">{`${blurb.expert.name.firstname} ${blurb.expert.name.lastname}`}</h5>
                 <p className="mas-time">{this.gettime(blurb.timestamp.uploadedAt)}</p>
             </div>
         );
     });
        return (
          <div className="container">
          <Masonry
          className={'my-gallery-class'} // default 
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      >
          {childElements}
      </Masonry>
      </div>
        );
    }
}

export default connect()(CommunityNews);
