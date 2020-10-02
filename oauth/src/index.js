import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";
// import "./styles.styl";
import regeneratorRuntime from 'regenerator-runtime'
// was another options relating to the regenerator error
// https://stephencharlesweiss.com/regenerator-runtime-not-defined/
// https://github.com/parcel-bundler/parcel/issues/1762
// https://www.npmjs.com/package/regenerator-runtime
//  "plugins": [
//     [
//       "@babel/plugin-transform-runtime",
//       {
//         "corejs": 2,
//         "regenerator": true
//       }
//     ]
//   ]



import Amplify from 'aws-amplify'
import config from './aws-exports'

Amplify.configure(config)
// Amplify.configure({
//     Auth: {
//         identityPoolId: "us-east-1:f7ad6ad9-9d49-4efb-b0ed-87b2cf817304",
//         region: 'us-east-1',
//         userPoolId: "us-east-1_MuFrMGcxi",
//         userPoolWebClientId: "4krgehlbq3hdtm3ts7lnlrje8v",
//     },
//     Storage: {
//         AWSS3: {
//             bucket: 'cpc-portfolios',
//             region: 'us-east-1'
//         },
//         customPrefix: {
//             private: 'post-processed/',
//             private: 'pre-processed/'
//         }
//     }
// })

// TODO: setup routes for a few pages
// SignIn Page
// User profile Page with access to app for excel upload
// SignOut Page after logging out

ReactDOM.render(
    <App />,
    document.getElementById('app')
)