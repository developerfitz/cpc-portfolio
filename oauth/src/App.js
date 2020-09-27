import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from "react-router-dom"
import Amplify, { Auth, Hub } from 'aws-amplify'

// import Login from 'login' // Home page need to sign in
// import Profile from 'profile' // protected require login


function Login() {
  return(
    <div>
      <h1>Examiner's Supplemental Tools</h1>
        <h2>The functionality we wanted, but they did not provide...</h2>
        <h3>Please Sign Up or Login to gain access to the functionality they did not provide.</h3>
        <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
    </div>
  )
}

function Logout() {

  return (
    <div>
      <h1>You have Logged Out.</h1>
      <button onClick={() => Auth.federatedSignIn()}>Sign Back In</button>
      <button onClick={() => <Redirect to='/' />} >Home Page</button>
    </div>
  )
}

// function signOut() {

// }


function Profile(props) {
  console.log(props)
  const { user } = props
  return(
    <div>
      <h1>Welcome Examiner {user ? user.attributes.name : ''}</h1>
        <button onClick={() => Auth.signOut()}>Sign Out</button>
    </div>
  )
}

function PrivateRoute(props) {
  const { component: Component, user, isAuthorized, ...rest } = props
  return (
    <Route
      {...rest}
      render={ () => {
        console.log(user)
        console.log(isAuthorized)
        return (isAuthorized 
        ? <Component {...props} /> 
        : <Redirect to={{pathname: '/'}} />
        )}
      }
    />
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [isAuthorized, setAuth] = useState(false)

  useEffect(() => {
    // local Pub/Sub pattern to share data between modules and components
    Hub.listen('auth', ({ payload: { event, data } }) => {
      // console.log(event,data)
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData))
          break
        case 'signOut':
          setUser(null)
          break
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data)
          break
      }
    });

    getUser().then(userData => setUser(userData))
  }, [])

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => {
        setAuth(!isAuthorized)
        return userData
      })
      .catch(() => console.log('Not signed in'))
  }
  console.log(user)
  // const info = Auth.currentUserInfo().then( data => console.log(data))
  // const info = Auth.userAttributes(user).then(data => console.log(data))
  // const info = Auth.currentUserInfo().then(data => console.log(data))
  // const info = Auth.userAttributes().then(data => console.log(data))
  // const { jwtToken, payload } = user.signInUserSession.idToken
  return (
    // { if (jwtToken && payload) {
    //     <Redirect to='/examiner' />
    //   }
    
    // }
    <Router>      
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <PrivateRoute exact isAuthorized path='/examiner' component={Profile} user={user}/>
        <Route exact path='/signed-out' >
          <Logout />
        </Route>
      </Switch>
    </Router>
    // <div>
    //   <h1>Welcome Examiner {user ? user.attributes.name : ''}</h1>
    //   {user ? (
    //     <button onClick={() => Auth.signOut()}>Sign Out</button>
    //   ) : (
    //     // <button onClick={() => Auth.signOut()}>Sign Out</button>
    //     <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
    //   )}
    // </div>
  )
}

export default App