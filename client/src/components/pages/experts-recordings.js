import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import * as actions from '../../actions/messaging';
const socket = actions.socket;
import { Modal, Button, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getExpertRecordings, playRecordedAudio, deleteRecordedAudio } from '../../actions/expert';
import cookie from 'react-cookie';


class Recordings extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        recordings: [],
        currentUser: cookie.load('user'),
        showRecordingDeleteModal: false
    }
  }
  
  componentDidMount() {
        var expertEmail = this.state.currentUser.email;
        
        this.props.getExpertRecordings({expertEmail}).then(
            (response)=>{
                this.setState({
                    recordings: response.recordings
                });
                console.log('**** getExpertRecordings success  ****'+ JSON.stringify(this.state.recordings) );
                
            },
            (err) => err.response.json().then(({errors})=> {
                console.log('**** getExpertRecordings error ****'+ JSON.stringify(errors) );
            })
        )
        
    }
    
    openRecordingDeleteModal() {
        this.setState({ showRecordingDeleteModal: true });
    };
    
    closeRecordingDeleteModal() {
        this.setState({ showRecordingDeleteModal: false });
    }
    
    playRecordedAudio(archiveId){
        this.props.playRecordedAudio({archiveId}).then(
            (response)=>{
                console.log('**** playRecordedAudio success  ****'+ response.archive_url);
                var url = response.archive_url;
                var win = window.open(url, '_blank');
                win.focus();
                //window.location = response.archive_url;
                
            },
            (err) => err.response.json().then(({errors})=> {
                console.log('**** playRecordedAudio error ****'+ JSON.stringify(errors) );
            })
        )
        
    }
    
    deleteRecordedAudio(index, archiveId, id){
        var recordings = [...this.state.recordings];
        recordings.splice(index, 1);
        this.setState({recordings});
        
        this.props.deleteRecordedAudio({archiveId, id }).then(
            (response)=>{
                console.log('**** deleteRecordedAudio success  ****'+ JSON.stringify(response));
                this.closeRecordingDeleteModal();
            },
            (err) => err.response.json().then(({errors})=> {
                console.log('**** deleteRecordedAudio error ****'+ JSON.stringify(errors));
            })
        )
        
        
    }
    
    recordingsList(){
        
        if(this.state.recordings.length == 0){
            return (
                   <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sent by </th>
                            <th>Duration</th>
                            <th>Sent at</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="5">No Recordings Found</td>
                                </tr>
                            </tbody>
                          </table> 
            
            );
        }
        
        
        return (
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sent by </th>
                            <th>Duration</th>
                            <th>Sent at</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                            <tbody>
                                { this.state.recordings.map((recording, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{recording.senderName}</td>
                                        <td>{recording.duration + ' seconds'}</td>
                                        <td>{ new Date(Number(recording.updatedAt) ).toUTCString()}</td>
                                        <td>
                                            <button type="button" onClick={ this.playRecordedAudio.bind(this, recording.archiveId) } className="btn btn-info btn-sm" title="play"><i className="fa fa-play" aria-hidden="true"></i></button>
                                            <button type="button" onClick={ this.openRecordingDeleteModal.bind(this)  } className="btn btn-danger btn-sm"><i className="fa fa-trash" aria-hidden="true"></i></button>
                                            
                                            <Modal bsSize="small" show={this.state.showRecordingDeleteModal} onHide={this.closeRecordingDeleteModal.bind(this)}>
                                                <Modal.Header closeButton>
                                                  <Modal.Title>Recording Delete</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <strong>Are you sure to delete ?</strong>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                  <Button bsStyle="danger" onClick={ this.deleteRecordedAudio.bind(this, index, recording.archiveId, recording._id) }>Delete</Button>
                                                  <Button onClick={this.closeRecordingDeleteModal.bind(this)}>Close</Button>
                                                </Modal.Footer>
                                              </Modal>
                                            
                                            
                                        </td>
                                    </tr>
                                   
                                    )
                                }
                            </tbody>
                          </table>
        );
    }

  render(){
    return (
      <div className="recordings-wrapper">
        <div className="container">
           <div className="row">
               <ol className="breadcrumb">
                 <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                 <li className="breadcrumb-item">Recordings</li>
               </ol>
           </div>
        </div>
        <div className="expert-list-wrap">
            <div className="container">
              <div className="row">
                <div className="expert-list-inner-wrap">
                   <div className="col-sm-12">
                    
                    <Panel header={ "Recordings" }  bsStyle="primary" >
                    
                        { this.recordingsList() }
                    
                           
                
                        

                    </Panel>
                   
                   </div>
                 </div>
               </div>
             </div>
         </div>
 
    </div>
    );
  }
}

export default connect(null, { getExpertRecordings, playRecordedAudio, deleteRecordedAudio })(Recordings);
