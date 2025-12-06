import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  
    <Provider store={store}>
      <Auth0Provider
        domain="dev-3mwkeaoizd8nney2.us.auth0.com"
        clientId="Ead2bjpz8EatwOqvpjaiUUllikgcv4Ag"
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <App />
      </Auth0Provider>
    </Provider>
 
);
