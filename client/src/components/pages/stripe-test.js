import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import axios from 'axios';

class StripeTest extends Component {

  	/**
   	* Class constructor.
   	*/
	constructor(props, context) {
		super(props, context);
	}

  render() {
		return (
			 <div id="experts-list" className="experts-list">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
								<div id="stipe-test">
									<p>Stripe Payment Page</p>
								</div>
						</div>
					</div>
				</div>
			</div>
		);
  }
}


export default StripeTest;
