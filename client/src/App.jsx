import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./components/UserContext";
import Routers from "./router";

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
