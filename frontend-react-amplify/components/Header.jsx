import React from 'react'
import { Flex, Heading, Box } from "@chakra-ui/core"
import { Link } from 'react-router-dom'
import { SignInButton, SignOutButton } from './authButtons'

const Header = props => {
  const { user } = props
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  const buttonAction = 
  console.log(user)

  return (
    <Box>
      <Flex
        align='center'
        justify='space-between'
        wrap='wrap'
        padding='1.5rem'
        bg='teal.500'
        color='white'
        {...props}
      >
        <Flex align='center' mr={5}>
          <Heading as='h1' size='lg' >
            <Link to='/'>Portfolio Toolbox</Link>
          </Heading>
        </Flex>

        <Box
          display={{ sm: show ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          <Flex 
            justify='space-between'
            align='center'    
            padding='0.5'    
          >
            { user 
              ? (
                <>
                <Heading as='h3' size='sm' mr={'1rem'}>
                  Examiner {user ? user.attributes.name : ''}
                </Heading>
                <SignOutButton />
                </>
                )
              : <SignInButton />
            }
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
} 

export default Header