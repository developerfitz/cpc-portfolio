import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";
// import "./styles.styl";


import Amplify from 'aws-amplify'
import config from './aws-exports'

Amplify.configure(config)

const mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);