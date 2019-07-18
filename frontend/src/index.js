import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app";

document.body.style =
  "background: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);"; //set color for all pages
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,

  document.getElementById("root")
);
