/* global document */
import { render } from "react-dom";
import React, { Fragment } from "react";
import App from "./containers/App";
import "./style.css";
import CssBaseline from "@material-ui/core/CssBaseline";

render(
  <Fragment>
    <CssBaseline />
    <App />
  </Fragment>,
  document.getElementById("app")
);
