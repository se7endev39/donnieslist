import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import * as actions from '../../actions/messaging';
const socket = actions.socket;

class MysessionList extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="mysession-list">
        <div className="container">
           <div className="row">
               <ol className="breadcrumb">
                 <li className="breadcrumb-item"><IndexLink to="/">Home</IndexLink></li>
                 <li className="breadcrumb-item">My Sessions</li>
               </ol>
           </div>
        </div>
        <div className="expert-list-wrap">
            <div className="container">
              <div className="row">
                <div className="expert-list-inner-wrap">
                   <div className="col-sm-12">
                        Session list comes here.
                   </div>
                 </div>
               </div>
             </div>
         </div>
      </div>
    );
  }
}

export default MysessionList;
