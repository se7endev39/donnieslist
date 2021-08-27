import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import React, { Component } from "react";
import locationIcon from "../assets/images/location.png";

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { lat: 47.444, lng: -122.176 };
  }

  geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          title: "Seattle",
          state: "Washington",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/3/36/SeattleI5Skyline.jpg",
          message: "Foo",
          iconSize: [35, 35],
        },
        geometry: {
          type: "Point",
          coordinates: [-122.3320708, 47.6062095],
        },
      },
      {
        type: "Feature",
        properties: {
          title: "Los Angeles",
          state: "California",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/LA_Skyline_Mountains2.jpg/240px-LA_Skyline_Mountains2.jpg",
          message: "Bar",
          iconSize: [35, 35],
        },
        geometry: {
          type: "Point",
          coordinates: [-118.4108, 34.0194],
        },
      },
      {
        type: "Feature",
        properties: {
          title: "Chicago",
          state: "Illinois",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2008-06-10_3000x1000_chicago_skyline.jpg/240px-2008-06-10_3000x1000_chicago_skyline.jpg",
          message: "Baz",
          iconSize: [35, 35],
        },
        geometry: {
          type: "Point",
          coordinates: [-87.6818, 41.8376],
        },
      },
      {
        type: "Feature",
        properties: {
          title: "San Francisco",
          state: "California",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/San_Francisco_skyline_from_Coit_Tower.jpg/240px-San_Francisco_skyline_from_Coit_Tower.jpg",
          message: "Baz",
          iconSize: [35, 35],
        },
        geometry: {
          type: "Point",
          coordinates: [-122.4193, 37.7751],
        },
      },
      {
        type: "Feature",
        properties: {
          title: "Charlotte",
          state: "North Carolina",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Charlotte_skyline45647.jpg/222px-Charlotte_skyline45647.jpg",
          message: "Baz",
          iconSize: [35, 35],
        },
        geometry: {
          type: "Point",
          coordinates: [-80.8307, 35.2087],
        },
      },
    ],
  };

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.geojson.features.push({
          type: "Feature",
          properties: {
            title: "Your Location",
            state: "live location",
            image: locationIcon,
            message: "Baz",
            iconSize: [25, 35],
          },
          geometry: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        });

        this.setState({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      });
    } else {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
          } else if (result.state === "prompt") {
            console.log(result.state);
          } else if (result.state === "denied") {
            console.log("denied");
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    }
  }
  displayMarkers = () => {
    return this.geojson.features.map((locate, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: locate?.geometry.coordinates[1],
            lng: locate?.geometry.coordinates[0],
          }}
          style
        />
      );
    });
  };

  render() {
    const mapStyles = {
      width: "100%",
      height: "90vh",
    };
    return (
      <div className="map-container">
        <Map
          google={this.props.google}
          zoom={13}
          center={{ lat: this.state.lat, lng: this.state.lng }}
          style={mapStyles}
        >
          {this.displayMarkers()}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDNszdid48tnWp6LVgxpWwLS_FbFFZyj7Y",
})(MapContainer);
