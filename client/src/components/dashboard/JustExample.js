// JustExample
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';

import SidebarMenuAdmin from './sidebar-admin';


class JustExample extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:"",
      SuccessMessage:"",
      composedMessage:"",
      errors:{}
    }
    this.handleChange = this.handleChange.bind(this);
    // this.props.protectedTest();
    // this.BanMe = this.BanMe.bind(this);
    // this.UnBanMe = this.UnBanMe.bind(this);
  }

  componentWillMount(){
  	var self= this
  	console.log("SELF IN COMPONENT WILL MOUNT")
	console.log(self)
  	$(document).ready(function() {
	  $("#composedMessage").emojioneArea({
	  	pickerPosition: "left",
	    tonesStyle: "bullet",
		  events: {
		  	change (editor, event) {
			        console.log('event:click');
		    },
			keypress: function (editor, event) {
				console.log("__________________________")
				console.log(event)
				if(event.keyCode==13){
      				console.log('ENTER PRESSED');
      				console.log(this)
      				console.log("%%%%%%%%%")
      				console.log(self)
      				self.setState({})
				}
				console.log('event:keypress');
		    }
	        // events handlers 
	        // see below 
	      }
	  });

		// $("#emojionearea2").emojioneArea({
	 //  	pickerPosition: "bottom",
	 //    tonesStyle: "radio"
	 //  });
		// $("#emojionearea3").emojioneArea({
	 //  	pickerPosition: "left",
	 //  	filtersPosition: "bottom",
	 //    tonesStyle: "square"
	 //  });
		// $("#emojionearea4").emojioneArea({
	 //  	pickerPosition: "bottom",
	 //  	filtersPosition: "bottom",
	 //    tonesStyle: "checkbox"
	 //  });
		// $("#emojionearea5").emojioneArea({
	 //  	pickerPosition: "top",
	 //  	filtersPosition: "bottom",
	 //    tones: false,
	 //    autocomplete: false,
	 //    inline: true,
	 //    hidePickerOnBlur: false
	 //  });
	});
  }
  	handleChange = (e)=>{
  		console.log("HI " +e.target.value)
		// console.log(e.target.value)

			this.setState({
				[e.target.name] : e.target.value,
				
			});

	}

  render(){

  	return(

<div>
	HI
	<div className="row">
  	<div className="span6" style={{  float: "left",width: 48+"%",padding: 1+"%"}}>
	    <textarea name="composedMessage" id="composedMessage" value={this.state.composedMessage} onChange={this.handleChange} >Default :smile:</textarea >
	  </div>
	  <div className="span6" style={{  float: "left",width: 48+"%",padding: 1+"%"}}>
	    <input type="text" id="emojionearea2" value="inline :+1:"/>
	  </div>
	</div>
</div>

  		);
  }
}

export default connect(null, {})(JustExample);