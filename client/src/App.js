import "./App.css";
import React from "react";
import OverallLayout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Classes from "./Classes";
import Plans from "./Plans";
import Login from "./Login";

const App = () => {
  return (
    <BrowserRouter>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
        rel="stylesheet"
      />
      <script src="path-to-the-file/splide.min.js"></script>

      <OverallLayout>
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/classes" element={<Classes />}></Route>
          <Route path="/plans" element={<Plans />}></Route>
          <Route path="/login" element={<Login />}></Route>
          {/* <Route path="*"></Route> */}
        </Routes>
      </OverallLayout>
    </BrowserRouter>
  );
};

export default App;
