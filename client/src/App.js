import React, { useEffect, useState } from "react";
import OverallLayout from "./Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Classes from "./components/Classes";
import Plans from "./components/Plans";
import Login from "./components/Login";
import Register from "./components/Register";
import UserContext from "./components/UserContext";
import MainPage from "./components/User/MainPage";
import "mapbox-gl/dist/mapbox-gl.css";
import Profile from "./components/Profile";
import Class from "./components/Classes/Class";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = {};

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {
          token: JSON.parse(localStorage.user).token,
          method: JSON.parse(localStorage.user).method,
        },
      });

      const parseRes = await response.json();
      parseRes === true ? setAuth(true) : setAuth(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <BrowserRouter>
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"></script>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css"
        rel="stylesheet"
      />
      <script src="path-to-the-file/splide.min.js"></script>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap')
      </style>
      <OverallLayout isAuthenticated={isAuthenticated} setAuth={setAuth}>
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/classes" element={<Classes />}></Route>
          <Route path="/class/:classId" element={<Class />}></Route>
          <Route path="/plans" element={<Plans />}></Route>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate replace to="/profile" />
              )
            }
          ></Route>
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register setAuth={setAuth} />
              ) : (
                <Navigate replace to="/profile" />
              )
            }
          ></Route>
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate replace to="/login" />
            }
          ></Route>
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
