import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./googleMaps.css"
import {useEffect, useState} from "react";
import { AbortedDeferredError } from "react-router-dom";

function ServerMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}


function Map() {
  const[coordinates, setCoordinates] = useState([
    {
      orderid: "",
      latitude: '30.612497',
      longitude: '-96.340928'
    }
  ]);
  var center ={ lat: 30.612497, lng: -96.340928 };
  var mar = { lat: 30.612497, lng: -96.340928 };


 
  const getCoordinates = async () => {
    try{
      const response = await fetch ("http://localhost:4999/coordinates");
      const jsonData = await response.json();
      setCoordinates(jsonData);

    }catch (err){
      console.error("error in getCoordinates() in googlemaps");
      console.error(err.message);
    }
  };

  getCoordinates();
  mar = { lat: Number(coordinates[0].latitude), lng: Number(coordinates[0].longitude)};




  return (
    <div className="map-div">
        <h2 className="delivery_heading">Delivery Address</h2>
        <div className="map-inner">
            <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
                <MarkerF position={center} label={{text:"Rev's American Grill"}}/>
                <MarkerF position={mar} label = {{text: "Last Deliverable Order Placed"}}/>
            </GoogleMap>
        </div>    
    </div>
  );
}

export default ServerMap;