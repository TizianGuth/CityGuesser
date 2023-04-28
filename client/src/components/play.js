import "./play.css";

import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

import Map, { map, getImageCoords, focusOnCreatedMarker } from "./map";
import Button from "./button";
import Mapillary, { imgs, preloadImages } from "./../mapillary";
import Loading from "./loading";

let init = false;

let roundIndex = -1;

const Play = () => {

    // Seperate cause array too slow
    const [img1, setImg1] = useState();
    const [img2, setImg2] = useState();

    preloadImages(2).then(() => {
        RefreshImages();
    });
    const props = useLocation().state;

    console.log(getImageCoords(roundIndex));

    if (props == null || props.coords == null)
        window.location.href = "/cityguesser/";

    return (
        <div className="background">
            <div className="main">

                <div id="menue">
                    <div className="image-holder">
                        <img src={img1 != undefined ? img1 : ""} />
                        <img src={img2 != undefined ? img2 : ""} />
                    </div>
                    <div className="map">
                        <Map id="map" coords={props.coords} zoom={props.zoom == undefined ? 13 : props.zoom} />
                    </div>
                    <Button id="trigger" onClick={MakeGuess} text="Make your guess" />

                </div>
            </div>
        </div>
    );

    function MakeGuess() {
        init = false;
        RefreshImages();
        focusOnCreatedMarker(getImageCoords(roundIndex));
    }
    async function RefreshImages() {
        if (init) return;
        roundIndex++;
        //let imgs = await preloadImages(1);
        setImg1([imgs[roundIndex][0][0]]);
        setImg2([imgs[roundIndex][1][0]]);
        console.log("refreshed");
        // console.log(urls);


        init = true;
    }
};




export default Play;