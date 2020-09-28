import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";
// import "./styles.styl";


import Amplify from 'aws-amplify'
import config from './aws-exports'

Amplify.configure(config)

// TODO: setup routes for a few pages
// SignIn Page
// User profile Page with access to app for excel upload
// SignOut Page after logging out

ReactDOM.render(
    <App />,
    document.getElementById('app')
)