import React, { Component } from "react";
// import { Link, NavLink } from "react-router-dom";

class HowItWorks extends Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
    });
  }

  renderLoading() {
    return (
      <img
        className="loader-center"
        src="/img/ajax-loader.gif"
        alt=""
      />
    );
  }

  renderError() {
    return (
      <div className="error-message">Uh oh: {this.state.error.message}</div>
    );
  }

  renderPosts() {
    if (this.state.error) {
      return this.renderError();
    }

    return (
      <div id="how-it-works-wrapper" className="how-it-works-wrapper">
        <div className="container">
          <div className="page-title text-center">
            <h2>how it works</h2>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="steps-section">
                  <div className="number-step-box step1-color">
                    1
                    <span className="number-step-box-caption">
                      
                      Choose your subject
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    className="w100"
                    src="/img/how-it-works/Screenshot1.png"
                    alt=""
                  />
                </div>
                <div className="col-md-6">
                  <p>
                    Choose from a list of the world's most prestigious experts
                    in any subject.
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="steps-section">
                  <div className="number-step-box step2-color">
                    2
                    <span className="number-step-box-caption">
                      
                      Find an expert
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  {/*<p>With Donnie's list you are always connected to our professionals on your time. Find a tutor and simply contact them to start a session or schedule one at a later time.</p>*/}
                  <p>
                    All of our experts go through an extensive screening process
                    to ensure the safety of our members and also to ensure that
                    they are indeed the best the world has to offer. They range
                    from top college professors to everyday people who have
                    dedicated their life to knowledge on a specific subject.
                    Simply choose the educator that fits your needs and contact
                    them to start a video education session or schedule one for
                    a later time.
                  </p>
                </div>
                <div className="col-md-6">
                  <img
                    className="w100"
                    src="/img/how-it-works/Screenshot2.png"
                    alt=""
                  />
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="steps-section">
                  <div className="number-step-box step3-color">
                    3
                    <span className="number-step-box-caption">
                      
                      Contact your expert
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    className="w100"
                    src="/img/how-it-works/contact-expert.jpg"
                    alt=""
                  />
                </div>
                <div className="col-md-6">
                  <p>
                    You can contact our educators and professionals using
                    various features provided in Donnie’s List. Text, Call, or
                    video session to communicate with available professionals
                    instantly.
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="steps-section">
                  <div className="number-step-box step4-color">
                    4
                    <span className="number-step-box-caption">
                      
                      Rate your experience
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <p>
                    Donnie's List wants to make sure every experience is a
                    quality experience. Your reviews are important to us. Let us
                    know how they did by leaving your educator a quick rating
                    after your session.
                  </p>
                </div>
                <div className="col-md-6">
                  <img
                    className="w100"
                    src="/img/how-it-works/Screenshot4.png"
                    alt=""
                  />
                </div>
              </div>
              <div className="row">&nbsp;</div>
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
        {this.state.loading ? this.renderLoading() : this.renderPosts()}
      </div>
    );
  }
}

export default HowItWorks;
