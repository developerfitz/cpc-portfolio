import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from "react-router-dom"
import Amplify, { Auth, Hub, Storage } from 'aws-amplify'

// import Login from 'login' // Home page need to sign in
// import Logout from 'logout' 
// import PrivateRoute from 'privateRoute' 
// import Profile from 'profile' // protected require login

// Lambda Urls
const BASE_URL = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev'
const UPLOAD_PORTFOLIO = `${BASE_URL}/examiner-portfolio`
const PROCESS_PORTFOLIO = `${BASE_URL}/get-processed-excel-sheet`



function Login(props) {
  const { login } = props

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
      {/* FIX: redirect after logout does not seem to work */}
      <button onClick={() => <Redirect to='/' />} >Home Page</button>
    </div>
  )
}


function Profile(props) {
  const { user, id } = props
  const [file, setFile] = useState({raw: ''})
  const uploadFile = document.getElementById('#upload_input')
  const uploadButton = useRef()
  const fileInput = useRef()

  const handleChange = e => {
    if(e.target.files) {
      setFile({raw: e.target.files})
    }
  }
  const uploadFileButton = async e => {
    e.preventDefault()
    // ! assuming only one file uploaded
    const { name, type } = file.raw[0]

    await Storage.put(`pre-processed/${name}`, 
      file.raw[0], 
      {
        level: 'private',
        contentType: type
      })
      .then( res => console.log(res))
      .catch( err => console.log(err))
    
    const processFileRequest = new Request(PROCESS_PORTFOLIO, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify({
        filename: name,
        cognitoId: id,
        contentType: type,
        message: 'Request - please process the file.'
      })
    })

    const processFileResponse = await fetch(processFileRequest)
      .then( resolve => resolve.json() )
      .catch( error => console.log('File not processed: ', error) )

    const { processedFilename } = processFileResponse
    await Storage.vault
      .get(`post-processed/${processedFilename}`, {
        expires: 60, 
        identityId: id})
      .then( res => window.open(res, '_blank'))
      .catch( err => console.log(err))
  }


  return(
    <div>
      <h1>Welcome Examiner {user ? user.attributes.name : ''}</h1>
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      <main>
        <h2>Supplemental Portfolio Tool</h2>
          <input ref={fileInput} onChange={handleChange} id='#upload_input' type='file' name='file' accept='.xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' />
          <button ref={uploadButton} onClick={uploadFileButton} id='#upload_button'>Upload</button>
          <h3 id='#response'></h3>
      </main>
    </div>
  )
}

function PrivateRoute(props) {
  const { component: Component, user, isAuthorized, ...rest } = props
  return (
    <Route
      {...rest}
      render={ () => {
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
  const [id, setId] = useState(null)
  const [isAuthorized, setAuth] = useState(false)

  useEffect(() => {
    // local Pub/Sub pattern to share data between modules and components
    Hub.listen('auth', ({ payload: { event, data } }) => {
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
    Auth.currentUserInfo()
      .then( user => {
        setId(user.id)
    })
    .catch(() => console.log('User Id not set.'))

    return Auth.currentAuthenticatedUser()
      .then(userData => {
        setAuth(!isAuthorized)
        return userData
      })
      .catch(() => console.log('Not signed in'))
  }
  // * possible to use JWT for login 
  // const { jwtToken, payload } = user.signInUserSession.idToken
  return (
    <Router>      
      <Switch>
        <Route exact path='/'>
          <Login user={user} isAuthorized/>
        </Route>
        <PrivateRoute exact isAuthorized path='/examiner' component={Profile} user={user} id={id}/>
        <Route exact path='/signed-out' >
          <Logout />
        </Route>
      </Switch>
    </Router>
  )
}

export default App