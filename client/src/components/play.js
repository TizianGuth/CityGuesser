import "./play.css";

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";

import Map, { map, getImageCoords, focusOnCreatedMarker, updateHeight, getDistanceFromMarker } from "./map";
import Button from "./button";
import Mapillary, { imgs, preloadImages } from "./../mapillary";
import Navbar from "./navbar";

let init = false;

let roundIndex = -1;
const inacuracy = 50;
const maxPoints = 5000;

const Play = () => {

    // Seperate cause array too slow
    const [img1, setImg1] = useState();
    const [img2, setImg2] = useState();

    const [result, setResult] = useState(false);
    const [distance, setDistance] = useState(0);
    const [score, setScore] = useState(0);


    preloadImages(2).then(() => {
        refreshImages();
    });
    const props = useLocation().state;

    console.log(getImageCoords(roundIndex));

    if (props == null || props.coords == null)
        window.location.href = "/";

    return (
        <div className="background">
            <div className="main">
                <Navbar />
                <div className="play">
                    <div id="play-text ">
                        <h2>Distance: {distance < inacuracy ? "<" + inacuracy : distance} m</h2>
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

        init = false;
        setResult(true);
        const c = getImageCoords(roundIndex)
        const d = Math.round(getDistanceFromMarker(c[0], c[1], 0));
        setDistance(d);
        setScore(score + Math.round(getScore(d)));
        console.log("Score: " + Math.round(getScore(d)));
        resizeMap(1000).then(() => {
            refreshImages();
            focusOnCreatedMarker(getImageCoords(roundIndex - 1));
        });

        console.log(c);

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
        // console.log(imgs);
        init = true;
    }
};




export default Play;