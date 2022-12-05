import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./googleMaps.css"
import {useEffect, useState} from "react";
import { AbortedDeferredError } from "react-router-dom";

function CustomerMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}


function Map() {
  // const [myLocation, setMylocation] = useState(null);
  // const [status, setStatus] = useState(null);
  // const[coordinates, setCoordinates] = useState([
  //   {
  //     orderid: "",
  //     latitude: '30.612497',
  //     longitude: '-96.340928'
  //   }
  // ]);
  var center ={ lat: 30.612497, lng: -96.340928 };
  // var mar;

//   function getLocation() {
//     if (!navigator.geolocation) {
//          setStatus('Geolocation is not supported by your browser');
//     } else {
//          setStatus('Locating...');
//          navigator.geolocation.getCurrentPosition((position) => {
//               setStatus(null);  
//               setMylocation({
//                    lat: position.coords.latitude,
//                    lng: position.coords.longitude
//               })
//               mar = { lat: position.coords.latitude, lng: position.coords.longitude };
//               // console.log(mar);
//          }, () => {
//               setStatus('Unable to retrieve your location');
//          });
//     }
    
// }

 
  // const getCoordinates = async () => {
  //   try{
  //     const response = await fetch ("http://localhost:4999/coordinates");
  //     const jsonData = await response.json();
  //     setCoordinates(jsonData);

  //   }catch (err){
  //     console.error("error in getCoordinates() in googlemaps");
  //     console.error(err.message);
  //   }
  // };
  const [myLocation, setMylocation] = useState(null);
  const [status, setStatus] = useState(null);
  var [mark, setMark] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
           setStatus(null);  
           setMylocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
           })
           mark = { lat: position.coords.latitude, lng: position.coords.longitude };
           setMark(mark);
      }, () => {
           setStatus('Unable to retrieve your location');
      });
    }
}, [mark]);

// console.log(mark)
  // getCoordinates();
  // mar = { lat: Number(coordinates[0].latitude), lng: Number(coordinates[0].longitude)};




  return (
    <div className="map-div">
        <h2 className="delivery_heading">Location</h2>
        <div className="map-inner">
            <GoogleMap zoom={13} center={center} mapContainerClassName="map-container">
                <MarkerF position={center} label={{text:"Rev's American Grill"}}/>
                <MarkerF position={mark} label = {{text: "Your location"}}/>
            </GoogleMap>
        </div>    
    </div>
  );
}

export default CustomerMap;