// import React, { Component } from "react";
// // import Amplify, { Auth } from 'aws-amplify'
// // import config from './aws-exports'

// import { withAuthenticator } from 'aws-amplify-react'
// // import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

// // Amplify.configure(config)

// class App extends Component {


//   render() {
//     // const { name } = this.props;
//     return (
//       <>
//         <h1>
//           Hello Examiner Welcome to Supplemental Tools
//         </h1>
//         {/* <AmplifySignOut /> */}
//       </>
//     );
//   }
// }

// export default withAuthenticator(App, {includeGreetings: true});
// // // export default withAuthenticator(App);


// import React from 'react';
// import Amplify from 'aws-amplify';
// import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);

// const App = () => (
//   <AmplifyAuthenticator>
//     <div>
//       My App
//       <AmplifySignOut />
//     </div>
//   </AmplifyAuthenticator>
// );

// export default App
import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // local Pub/Sub pattern to share data between modules and components
    Hub.listen('auth', ({ payload: { event, data } }) => {
      // console.log(event,data)
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    // Auth.currentUserInfo().then(data => console.log(data), err => console.log(`error: ${err}`))
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
    // return Auth.currentUserInfo()
    //   .then(userData => userData)
    //   .catch(() => console.log('Not signed in'));
  }
  console.log(user)
  // const info = Auth.currentUserInfo().then( data => console.log(data))
  // const info = Auth.userAttributes(user).then(data => console.log(data))
  // const info = Auth.currentUserInfo().then(data => console.log(data))
  // const info = Auth.userAttributes().then(data => console.log(data))
  return (
    <div>
      <h1>Welcome Examiner {user ? user.attributes.name : ''}</h1>
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        // <button onClick={() => Auth.signOut()}>Sign Out</button>
        <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
      )}
    </div>
  );
}

// import Amplify, { Auth, Hub } from 'aws-amplify';
// import awsconfig from './aws-exports';
// Amplify.configure(awsconfig);

// class App extends Component {
//   state = { user: null, customState: null };

//   componentDidMount() {
//     Hub.listen("auth", ({ payload: { event, data } }) => {
//       switch (event) {
//         case "signIn":
//           this.setState({ user: data });
//           break;
//         case "signOut":
//           this.setState({ user: null });
//           break;
//         case "customOAuthState":
//           this.setState({ customState: data });
//       }
//     });

//     Auth.currentAuthenticatedUser()
//       .then(user => this.setState({ user }))
//       .catch(() => console.log("Not signed in"));
//   }

//   render() {
//     const { user } = this.state;

//     return (
//       <div className="App">
//         <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}>Open Facebook</button>
//         <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
//         <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
//         <button onClick={() => Auth.signOut()}>Sign Out {user.getUsername()}</button>
//       </div>
//     );
//   }
// }

export default App;