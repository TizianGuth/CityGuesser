import { imgs } from "../mapillary";
import "./map.css"

import React, { useState, useEffect, Component } from "react";

let markers = [];
var L = window.L;
let bound_line;

let map;

export let exp;

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            zoom: props.zoom != undefined ? props.zoom : 13,
            coords: props.coords,
            bounds: []
        }
        this.createMap = this.createMap.bind(this);

        exp = this;
    }
    componentDidMount() {
        this.createMap();
    }

    createMap() {
        map = L.map(this.state.id).setView([this.state.coords[0], this.state.coords[1]], this.state.zoom);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(map);

        map.on("click", this.clickHandler);
    }

    clickHandler = (e) => {
        if (this.props.id == 'select-bounds') {
            this.onClickSelectBounds(e);
        } else {
            this.onClickDefault(e);
        }

    };


    // OnClick default
    onClickDefault(e) {
        this.removeAllMarkers(map);
        markers.push(L.marker([e.latlng.lat, e.latlng.lng]).addTo(map));
    }

    // OnClick select bounds
    onClickSelectBounds(e) {
        if (markers.length >= 2)
            this.removeAllMarkers(map);

        markers.push(L.marker([e.latlng.lat, e.latlng.lng]).addTo(map));

        if (markers.length == 2) {
            const coords = [[markers[0]._latlng.lat, markers[0]._latlng.lng], [markers[0]._latlng.lat, markers[1]._latlng.lng],
            [markers[1]._latlng.lat, markers[1]._latlng.lng], [markers[1]._latlng.lat, markers[0]._latlng.lng], [markers[0]._latlng.lat, markers[0]._latlng.lng]];

            this.state.coords = this.getCenter(markers[0]._latlng.lat, markers[0]._latlng.lng, markers[1]._latlng.lat, markers[1]._latlng.lng);
            //marker.push(L.marker(centerCoords).addTo(map));
            bound_line = L.polyline(coords).addTo(map);
            this.state.bounds.push([markers[0]._latlng.lat, markers[0]._latlng.lng], [markers[1]._latlng.lat, markers[1]._latlng.lng]);
            map.setView([this.state.coords[0], this.state.coords[1]], map.getZoom());
        }
    }

    removeMap() {
        map.off();
        map.remove();
    }

    render() {
        return (
            <div id={this.state.id} style={{ height: "100%", width: "100%" }}>
            </div>
        );
    }
}

function getCenter(minX, minY, maxX, maxY) {
    return [(minX + maxX) / 2, (minY + maxY) / 2];
}

function removeAllMarkers() {
    for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    if (markers.length != 0) markers.splice(0, markers.length);
    if (bound_line != undefined) map.removeLayer(bound_line);
}

export function getImageCoords(index) {
    if (index < 0 || imgs == undefined) { return; }


    let coords1 = imgs[index][0][1]["coordinates"];
    let coords2 = imgs[index][1][1]["coordinates"];

    return (getCenter(coords1[1], coords1[0],
        coords2[1], coords2[0]));
}

export function focusOnCreatedMarker(coords) {
    removeAllMarkers();
    markers.push(L.marker([coords[0], coords[1]]).addTo(map));
    map.setView([coords[0], coords[1]], map.getZoom());
}

export default Map;