import React, { Component } from 'react';

class LoginModal extends Component {
  render() {
    return (
      <div id={this.props.modalId} className="modal fade continueshoppingmodal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Message</h4>
            </div>
            <div className="modal-body">
                <div className="alert alert-danger">{this.props.modalMessage}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginModal;
