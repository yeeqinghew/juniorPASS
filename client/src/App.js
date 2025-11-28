import React, { useEffect } from "react";
import Routers from "./router";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./components/UserContext";

// ScrollToTop component - Official React Router solution
// Source: https://reactrouter.com/en/main/start/faq#how-do-i-scroll-to-the-top-when-the-route-changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <UserProvider>
        <Routers />
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
