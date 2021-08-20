
import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import locationIcon from "../assets/images/location.png"

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
  
export default function Map() {

  const [viewport, setViewport] = useState({
    latitude: 37.773972,
    longitude: -122.431297,
    width: "100%",
    height: "100vh",
    zoom: 3
  });
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };

    if ("geolocation" in navigator) {
        console.log(navigator);
        navigator.geolocation.getCurrentPosition(function (position) {
            setViewport({longitude: position.coords.longitude, latitude: position.coords.latitude, width: "100%",
            height: "100vh",
            zoom: 13})
          });
      } else {
        console.log("Not Available");
      }
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

    
  return (
    <div>
      <ReactMapGL
        {...viewport}
              mapboxApiAccessToken={"pk.eyJ1IjoiZG9ubnlkZXkiLCJhIjoiY2pvcDU2eHMyMHU0cDN3bXNsZXp4NmFzdCJ9.wFzZqhxa1-_fRLOWQjyLxg"}
              mapStyle="mapbox://styles/donnydey/cjt3u70n00a0v1fmwq7scm1wv"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
          >
           
        {geojson.features.map((park, key) => (
          <Marker
            key={key}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
              <img onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }} src={park.properties.image} width={park.properties.iconSize[0]} height={park.properties.iconSize[1]} style={{borderRadius: "100px", objectFit: "cover"}} />
          </Marker>
        ))}
             

        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
                      <div>
                      <img width="100px" src={selectedPark.properties.image}/>
                          
              <h2>{selectedPark.properties.title}</h2>
                          <p>{selectedPark.properties.state}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
}