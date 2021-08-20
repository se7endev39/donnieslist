import React from 'react';
import MapComponent from './Map';

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