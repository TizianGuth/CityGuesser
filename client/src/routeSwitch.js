import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Main from "./components/main"
import Play from "./components/play"


const RouteSwitch = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="." element={<Main />} />
        <Route path="/" element={<Main />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </Router>
  );
};

export default RouteSwitch;
