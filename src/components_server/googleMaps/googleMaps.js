import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./googleMaps.css"

function ServerMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 30.612497, lng: -96.340928 }), []);
  const mar = useMemo(() => ({ lat: 30.541764, lng: -96.288482 }), []);

  return (
    <div className="map-div">
        <h2 className="delivery_heading">Delivery Address</h2>
        <div className="map-inner">
            <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
                <MarkerF position={center} label={{text:"Rev's American Grill"}}/>
                <MarkerF position={mar} />
            </GoogleMap>
        </div>    
    </div>
  );
}

export default ServerMap;