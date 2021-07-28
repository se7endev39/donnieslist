import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";

import App from "./App";
// import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.querySelector(".wrapper")
);

// reportWebVitals(console.log);