import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import { connect } from 'react-redux';
import { Modal, Button, Panel } from 'react-bootstrap';

class ErrorExpertNotActive extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }
    
    render(){
        return(
            <div>
            <Modal className="modal-container" show={this.props.showErrorExpertNotActiveModal} onHide={this.close} animation={true} bsSize="">
               <Modal.Header>
                   <div>Expert <b>{this.props.expertSlug}</b> Offline</div>
               </Modal.Header>
               <Modal.Body>
                    <div className="alert-error">{this.props.errorExpertNotActiveModalData}</div>
                </Modal.Body>
               <Modal.Footer>
                   <Button onClick={this.handleClose}>Close and Go Back</Button>
               </Modal.Footer>
            </Modal> 
            </div>
        );
    }
}

export default connect(null, {  })(ErrorExpertNotActive);