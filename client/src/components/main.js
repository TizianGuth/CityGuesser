import "./main.css"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar";
import Button from "./button";
import Map, { exp } from "./map";

const Main = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    function Play() {
        setLoading(true);

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
                <h2>show your knowledge of YOUR home town based on 2 images</h2>
                <div className="menue">
                    <div className="map">
                        <Map id="select-bounds" coords={[49, 11]} />
                    </div>
                    <Button onClick={Play} text="Play" />
                </div>
            </div>
        </div>
    );
};
export default Main;