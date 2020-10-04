import React from 'react'
import { Box } from '@chakra-ui/core'


const Footer = (props) => {
  // {  } = props
  return(
    <Box display='flex' justifyContent='center' className='footer'>
      {/* <Box> */}
        <p>©2020 Portfolio Toolbox</p>
      {/* </Box> */}
    </Box>
  )
}

export default Footer