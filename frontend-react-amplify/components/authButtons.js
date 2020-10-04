import React from 'react'
import { Auth } from 'aws-amplify'
import { Button } from "@chakra-ui/core"



export const SignInButton = () => {
  return (
    <Button 
      bg='transparent'
      variantColor='teal'
      border='1px' 
      size='xs' 
      spacing={2}
      onClick={() => Auth.federatedSignIn()}
    >
      Sign In
    </Button>
  )
}

export const SignOutButton = () => {
  
  return (
    <Button 
      bg='transparent'
      variantColor='teal'
      border='1px' 
      size='xs' 
      spacing={2}
      onClick={() => Auth.signOut()}
    >
      Sign Out
    </Button>
  )
}

