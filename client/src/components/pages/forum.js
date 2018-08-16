import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import $ from 'jquery';

class Forum extends Component {
	constructor(props, context) {
		super(props, context);
		
		var disqus_config = function () {
			this.page.url = "https://www.donnieslist.com/forum";
			this.page.identifier = "donnieslist";
		};
		(function() { // DON'T EDIT BELOW THIS LINE
		var d = document, s = d.createElement('script');
		s.src = 'https://donnieslist.disqus.com/embed.js';
		s.setAttribute('data-timestamp', +new Date());
		(d.head || d.body).appendChild(s);
		})();
	}

	render() {
        return (
        	<div id="experts-list" className="experts-list">
	            <div className="container">
	                <div className="row">
	                	<div className="col-md-12">
			                <div id="disqus_thread"></div>
							<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
						</div>
					</div>
				</div>
			</div>
        );
    }
}

export default Forum;