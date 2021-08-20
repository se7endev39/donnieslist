/* eslint-disable no-useless-concat */
import React from 'react';
// import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZG9ubnlkZXkiLCJhIjoiY2pvcDU2eHMyMHU0cDN3bXNsZXp4NmFzdCJ9.wFzZqhxa1-_fRLOWQjyLxg';

var geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "title":"Seattle",
        "state":"Washington",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/36/SeattleI5Skyline.jpg",
        "message": "Foo",
        "iconSize": [35, 35]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.3320708,
          47.6062095
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title":"Los Angeles",
        "state":"California",
        "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/57/LA_Skyline_Mountains2.jpg/240px-LA_Skyline_Mountains2.jpg",
        "message": "Bar",
        "iconSize": [35, 35]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -118.4108,
          34.0194
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title":"Chicago",
        "state":"Illinois",
        "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2008-06-10_3000x1000_chicago_skyline.jpg/240px-2008-06-10_3000x1000_chicago_skyline.jpg",
        "message": "Baz",
        "iconSize": [35, 35]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -87.6818,
          41.8376
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title":"San Francisco",
        "state":"California",
        "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/San_Francisco_skyline_from_Coit_Tower.jpg/240px-San_Francisco_skyline_from_Coit_Tower.jpg",
        "message": "Baz",
        "iconSize": [35, 35]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.4193,
          37.7751
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title":"Charlotte",
        "state":"North Carolina",
        "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Charlotte_skyline45647.jpg/222px-Charlotte_skyline45647.jpg",
        "message": "Baz",
        "iconSize": [35, 35]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -80.8307,
          35.2087
        ]
      }
    }
  ]
};

export default class MapComponent extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			lng: 5,
			lat: 34,
			zoom: 1.5
		};
	}

	componentDidMount(){
		const { lng, lat, zoom } = this.state;

		var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/donnydey/cjt3u70n00a0v1fmwq7scm1wv',
        center: [lng, lat], // starting position [lng, lat]
        zoom // starting zoom
        });

    if ("geolocation" in navigator) { 
      navigator.geolocation.getCurrentPosition(position => { 
          console.log(position.coords.latitude, position.coords.longitude); 
          new mapboxgl.Marker()
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .setPopup(new mapboxgl.Popup({ offset: 0 }) // add popups
              .setHTML("You are here")
            ).addTo(map);  
      }); 
    }

  
	}

	render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }

}