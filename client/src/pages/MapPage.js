import React from 'react';
import MapComponent from './MapComponent';

class MapPage extends React.Component{
	render() {
    	return (
      		<div id='map'>
        		<MapComponent/>
      		</div>
    	);
  	}
}

export default MapPage;