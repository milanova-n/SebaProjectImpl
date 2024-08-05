import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import { ErrorProvider } from "./context/ErrorContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </UserProvider>
  </React.StrictMode>
);
