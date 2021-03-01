import React from 'react';
// import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { MapContainer ,TileLayer } from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "../util";

function Map({countries,casesType,center, zoom}) {
    return (
        <div className="map">
    
            {/* <LeafletMap center={center} zoom={zoom}> */}
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* loop through and draw ciecles according to casese */}
                {showDataOnMap(countries,casesType)}
            
            {/* </LeafletMap> */}
            </MapContainer>
            
        </div>
    );
}

export default Map;

