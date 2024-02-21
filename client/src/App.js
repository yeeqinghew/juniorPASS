import "./App.css";
import React from "react";
import OverallLayout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Classes from "./components/Classes";
import Plans from "./components/Plans";
import Login from "./Login";
import UserContext from "./components/UserContext";
import MainPage from "./components/User/MainPage";
import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
  const user = {};
  return (
    <BrowserRouter>
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"></script>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css"
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
          {/* Authenticated Routes */}
        </Routes>
      </OverallLayout>
      {/* <Routes>
        <UserContext.Provider value={{ user }}>
          <Route path="/mainpage" element={<MainPage />}></Route>
        </UserContext.Provider>
      </Routes> */}
    </BrowserRouter>
  );
};

export default App;
