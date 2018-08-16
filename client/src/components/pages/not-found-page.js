import React, { Component } from 'react';

class NotFoundPage extends Component {

  render() {
    return (
        <div id="experts-list" className="experts-list">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>404 - Page Not Found</h1>
                <p>I'm sorry, the page you were looking for cannot be found!</p>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default NotFoundPage;
