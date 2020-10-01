import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from "react-router-dom"
import Amplify, { Auth, Hub, Storage } from 'aws-amplify'

// import Login from 'login' // Home page need to sign in
// import Logout from 'logout' 
// import PrivateRoute from 'privateRoute' 
// import Profile from 'profile' // protected require login


function Login(props) {
  const { login } = props

  // useEffect(() => {
  //   // local Pub/Sub pattern to share data between modules and components
  //   Hub.listen('auth', ({ payload: { event, data } }) => {
  //     console.log(event,data)
  //     switch (event) {
  //       case 'signIn':
  //       case 'cognitoHostedUI':
  //         getUser().then(userData => setUser(userData))
  //         break
  //       case 'signOut':
  //         setUser(null)
  //         break
  //       case 'signIn_failure':
  //       case 'cognitoHostedUI_failure':
  //         console.log('Sign in failure', data)
  //         break
  //     }
  //   });

  //   getUser().then(userData => setUser(userData))
  // }, [])

  // function getUser() {
  //   // Auth.currentUserInfo().then( user => console.log(user))

  //   return Auth.currentAuthenticatedUser()
  //     .then(userData => {
  //       setAuth(!isAuthorized)
  //       return userData
  //     })
  //     .catch(() => console.log('Not signed in'))
  // }

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


function Profile(props) {
  const { user } = props
  const [file, setFile] = useState({raw: ''})
  const uploadFile = document.getElementById('#upload_input')
  const uploadButton = useRef()
  const fileInput = useRef()

  const handleChange = e => {
    if(e.target.files) {
      console.log(e.target.files)
      setFile({raw: e.target.files})
    }
  }

  const uploadFileButton = e => {
    e.preventDefault()
    const { name, type } = file.raw[0]
    console.log(name, type)
    // useEffect( () => {

    // }, [])
    const uploadToS3 = Storage.put(name, file.raw[0], {
      level: 'private',
      contentType: type
    })
    .then( res => console.log(res))
    .catch( err => console.log(err))
    console.log(uploadToS3)

    // TODO: Call Lambada function to process
    // TODO: update the Lambda with new buckets
    // Call Lambda to process uploaded file and then download from S3
    const processFileRequest = new Request(PROCESS_DOWNLOAD, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify({
        filename: name,
        contentType: type,
        message: 'Request - please process the file.'
      })
    })
    // const processFileResponse = async () => {
    //   await fetch(processFileRequest)
    //     .then( 
    //       resolve => resolve.json(), 
    //       reject => `No url given --> ${reject}`
    //     )
    // }
  
    const downloadFromS3 = Storage.vault.get('SmallSampleCPC.xlsx')
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
        {/* <UploadButton /> */}
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
      console.log(event,data)
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
    // Auth.currentUserInfo().then( user => console.log(user))

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
          <Login user={user} isAuthorized/>
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