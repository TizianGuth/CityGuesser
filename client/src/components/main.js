import "./main.css"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar";
import Button from "./button";
import Map, { exp } from "./map";
import Logo from "./../CityGuesser.svg"

const Main = () => {
    const [loading, setLoading] = useState(false);
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
                {!loading ? <><div className="logo">
                    <img src={Logo} id="logo" alt="logo" />
                    <h1>City Guesser</h1>
                </div>
                    <div className="menue">
                        <div className="map">
                            <Map id="select-bounds" coords={[49, 11]} />
                        </div>
                        <Button onClick={Play} text="Play" />
                    </div></> : null}
            </div>
        </div>
    );
};
export default Main;