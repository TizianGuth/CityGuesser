import "./play.css";

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";

import Map, { map, getImageCoords, focusOnCreatedMarker, updateHeight, getDistanceFromMarker, getMarkerSelectValid } from "./map";
import Button from "./button";
import Mapillary, { imgs, preloadImages } from "./../mapillary";
import Navbar from "./navbar";

let init = false;

let roundIndex = -1;
const inacuracy = 50;
const maxPoints = 5000;

let c = 0;
const Play = () => {

    preloadImages(1);

    // Seperate cause array too slow
    const [img1, setImg1] = useState();
    const [img2, setImg2] = useState();

    const [result, setResult] = useState(false);
    const [distance, setDistance] = useState(-1);
    const [score, setScore] = useState(0);

    refreshImages();

    const props = useLocation().state;

    if (props == null || props.coords == null)
        window.location.href = "/";

    return (
        <div className="background">
            <div className="main">
                <Navbar />
                <div className="play">
                    <div className="play-text ">
                        {
                            distance > 10000 ?
                                <h2>Distance: {Math.round(distance / 1000)}km</h2> :
                                distance > 0 ?
                                    <h2>Distance: {distance < inacuracy ? "<" + inacuracy : distance}m</h2> :
                                    <h2>Distance: {"-"}</h2>

                        }
                        <h2>Total score: {score} </h2>
                    </div>
                    <div className={result ? "image-holder-result" : "image-holder"}>
                        <img src={img1 != undefined ? img1 : ""} />
                        <img src={img2 != undefined ? img2 : ""} />
                    </div>
                    <div className={result ? "map result" : "map"}>
                        <Map id="select" coords={props.coords} zoom={props.zoom == undefined ? 13 : props.zoom} />
                    </div>
                    <Button id="trigger" onClick={makeGuess} text={result ? "Resume" : "Make your guess"} />

                </div>
            </div>
        </div>
    );

    function makeGuess() {
        if (result) {
            setResult(false);
            return;
        }

        if (!getMarkerSelectValid() || imgs[roundIndex + 1] == undefined) return;

        init = false;
        setResult(true);
        const c = getImageCoords(roundIndex)
        const d = Math.round(getDistanceFromMarker(c[0], c[1], 0));
        setDistance(d);
        setScore(score + Math.round(getScore(d)));
        resizeMap(1000).then(() => {
            refreshImages();
            focusOnCreatedMarker(getImageCoords(roundIndex - 1));
        });
    }

    function getScore(distance) {
        let p = 0;
        if (distance < inacuracy) {
            return maxPoints;
        }
        else {
            p = -((1) / (3802.5)) * Math.pow(distance - 50, 2) + 1000;
        }

        return p < 0 ? 0 : p * (maxPoints / 1000);
    }

    async function resizeMap(delay) {

        await sleep(delay);
        updateHeight();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function refreshImages() {
        if (init) return;
        roundIndex++;
        setImg1([imgs[roundIndex][0][0]]);
        setImg2([imgs[roundIndex][1][0]]);
        init = true;
    }
};




export default Play;