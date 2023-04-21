import React, { useState, useEffect } from "react";
import "./App.css";

var map = require('./mapillary.js');

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    map.GetImageUrl().then(url => {
      console.log(url);
      setMessage(url);

    });
  }, []);

  return (
    <div className="App">
      <img src={message} width="960" ></img>
    </div>
  );
}

export default App