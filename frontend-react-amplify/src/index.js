import Amplify from 'aws-amplify'
import App from "./App";
import config from './aws-exports'
import React from "react";
import ReactDOM from "react-dom";
import regeneratorRuntime from 'regenerator-runtime'

import "./styles.css";
// import "./styles.styl";

Amplify.configure(config)
ReactDOM.render(
    <App />,
    document.getElementById('app')
)