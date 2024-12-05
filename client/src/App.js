import React from "react";
import Routers from "./router";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./components/UserContext";

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routers />
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
