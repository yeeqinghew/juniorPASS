import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="358693379766-fr1mpfjmdspj5qpji8o9r5eiak3nuddm.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);

reportWebVitals();
