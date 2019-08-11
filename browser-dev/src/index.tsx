import { render } from "react-dom";
import React, { Fragment } from "react";
import App from "./containers/App";
import "./index.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as serviceWorker from "./serviceWorker";

render(
  <Fragment>
    <CssBaseline />
    <App />
  </Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
