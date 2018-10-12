import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import axios from 'axios';
import Masonry from 'react-masonry-component';

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
      error: null
    };
  }

  componentDidMount() {
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
      return <Link to={`/${categorySlug}`}>{categoryName} {(expertNumbers > 0) ? '('+expertNumbers+')' : ''}</Link>;
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
                            <Link to={'community-news'} className={'community-news-link'}>
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
    return (
      <div>
        {this.state.loading ?
          this.renderLoading()
          : this.renderPosts()}
      </div>
    );
  }
}

export default HomePage;
