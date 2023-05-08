import "./main.css"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Mapillary, { preloadImages } from "./../mapillary";

import Popup from "./popup";
import Navbar from "./navbar";
import Button from "./button";
import Map, { exp } from "./map";

const Main = () => {
    const [Lat, setLat] = useState(0);
    const [Lon, setLon] = useState(0);

    const [loading, setLoading] = useState(false);
    const [boundsSelected, setBoundsSelected] = useState(true);
    const navigate = useNavigate();

    async function loadLonLat() {
        //Havent found API that supports enough requests and is HTTPS

        /* const myJson = await fetch("http://ip-api.com/json/").then(function (response) {
             return response.json();
         });
 
         console.log(myJson);
 
         setLat(myJson.lat);
         setLon(myJson.lon);
 
         exp.updateMap(myJson.lat, myJson.lon); */
    }

    async function Play() {


        let b = (exp.state.bounds != undefined && exp.state.bounds.length != 0);
        setBoundsSelected(b);
        if (!b) return;

        setLoading(true);

        await preloadImages(3);

        navigate("/play", {
            state: {
                coords: exp.state.coords,
                zoom: exp.state.zoom,
                bounds: exp.state.bounds
            }
        });
    }

    return (
        <div className="background">
            <div className="main">
                <Navbar />
                {!loading ? <><div className="logo">
                </div></> : null}
                <h1>CITY GUESSER</h1>
                <h2>show your knowledge of YOUR favourite city based on 2 images</h2>
                <div className="menue">
                    <div className="map">
                        <Map id="select-bounds" coords={[Lat, Lon]} zoom={2} />
                    </div>
                    <Button onClick={Play} text="Play" />
                    <h3 style={{ color: boundsSelected ? "#646464" : "#646464" }}>Please select 2 points on the map  {"(doesn't do anything yet.)"} </h3>
                    {loading ? <Popup /> : null}
                </div>
            </div>
        </div>
    );
};

export default Main;