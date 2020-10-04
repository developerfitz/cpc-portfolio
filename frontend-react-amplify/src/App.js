import Amplify, { Auth, Hub, Storage } from 'aws-amplify'
import { Box, Button, Heading, Flex, Input, InputGroup, InputRightAddon, Text, useTheme } from '@chakra-ui/core'
import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from "react-router-dom"

import Footer from '../components/Footer'
import Header from '../components/Header'
// import Home from 'Home' // Home page need to sign in
// import Logout from 'logout' 
// import PrivateRoute from 'privateRoute' 
// import Profile from 'profile' // protected require login

// Lambda Urls
const BASE_URL = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev'
const UPLOAD_PORTFOLIO = `${BASE_URL}/examiner-portfolio`
const PROCESS_PORTFOLIO = `${BASE_URL}/get-processed-excel-sheet`



function Home(props) {
  const { user, isAuthorized } = props
  return(
    <Box>
      <Header user={user}/>
      <Flex m={3}
        // w='75%'
        direction='column'
        justify='center'
        align='center'
      >
        <Text w='50%' fontSize='lg'>
          A toolbox built by an Examiner for Examiners. We all know how important our examining time is, so this toolbox will reduce the time spent evaluating your portfolio and allow you to focus on examining.
        </Text>
        { user 
          ? (<Link to='/examiner' replace>
              <Button variantColor='teal' m={4}>Toolbox</Button>
             </Link>)
          : (<>
              <Text mt={6} w='50%'>
                Login or sign up to start using the Portfolio Toolbox and focus on Examining! 😎 
              </Text>
              <Button 
                variantColor={'teal'}
                m={2}
                onClick={() => Auth.federatedSignIn()}
              >
                Sign Up/In
              </Button>
            </>
          )
        }
      </Flex>
      <Footer />
    </Box>
  )
}

function Logout() {

  return (
    <Box>
      <Header />
      <Box m='10px'>
      <h1>You have Logged Out.</h1>
      {/* <button onClick={() => Auth.federatedSignIn()}>Sign Back In</button> */}
      {/* FIX: redirect after logout does not seem to work */}
        <Link to='/'>
          <Button 
            variantColor='teal'
            mt='5px' 
            // onClick={() => <Redirect to='/' />} 
          >
            Home Page
          </Button>
        </Link>
      </Box>
      <Footer />
    </Box >
  )
}


function Profile(props) {
  const { user, id } = props
  const [file, setFile] = useState({raw: ''})
  const uploadFile = document.getElementById('upload_input')
  // useEffect( () => {
  // }, [])
  let label = document.getElementById('input_label')
  // label
  const labelRef = useRef()
  const responseDiv = document.getElementById('#response')
  const uploadButton = useRef()
  const fileInput = useRef()

  // const theme = useTheme()

  const handleChange = e => {
    if (e.target.files) {
      setFile({raw: e.target.files})
      // input.addEventListener('change', function (e) {
      // let fileName = ''
      const fileName = e.target.files[0].name
      console.log(fileName)
      console.log(e.target.files[0])
      // ! FIX: upload does not work when navigate to home then back to toolbox. needs to be fixed
      label.innerHTML = fileName
      // })
    }
  }

  const handleClick = e => {
    if (e.target) {
      console.log(e.target)
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
    
    // Notify user of progress
    responseDiv.innerText = `File: ${name} is being processed. Please wait.`
    
    const processFileResponse = await fetch(processFileRequest)
      .then( resolve => resolve.json() )
      .catch( error => console.log('File not processed: ', error) )

    responseDiv.innerText = `Now downloading File...`
    const { processedFilename } = processFileResponse
    await Storage.vault
      .get(`post-processed/${processedFilename}`, {
        expires: 60, 
        identityId: id})
      .then( res => window.open(res, '_blank'))
      .catch( err => console.log(err))

    responseDiv.innerText = `Thank you for using the Portfolio Toolbox!`
  }


  return(
    <Flex direction='column'>
      <Header user={user} />
      {/* <h1>Welcome Examiner {user ? user.attributes.name : ''}</h1>
      <button onClick={() => Auth.signOut()}>Sign Out</button> */}
      <Box m={'1rem'} className='main'>
        <Heading as='h2' size='md'>Populate CPC Titles</Heading>
        <Text>Upload an excel file of your portfolio and generate a new file with CPC titles populated.</Text>
        <Flex
          w='50%'
        >
        {/* https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */}
            <input 
              ref={fileInput} 
              onChange={handleChange} 
              // placeholder='Upload File'
              id='upload_input'  
              type='file' 
              name='file' 
              accept='.xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            />
            <label 
              ref={labelRef} id='input_label' 
              htmlFor='upload_input'
            >
              Choose File...
            </label>
            <Button
              variantColor='teal' 
              mt={2} variant='solid'  ml='1rem'
              ref={uploadButton} onClick={uploadFileButton} id='#upload_button'
            >Upload</Button>
            {/* <Input onClick={handleClick} placeholder='Upload' /> */}
        </Flex>     
        <h3 id='#response'></h3>
      </Box>
      <Footer />
    </Flex>
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
          <Home user={user} isAuthorized/>
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