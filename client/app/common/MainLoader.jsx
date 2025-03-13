import React from 'react'
import LogoLoader from './LogoLoader'

const MainLoader = ({ isLoading = false, children }) => {

  return (
    <>
      {isLoading
        ? <LogoLoader />
        : children
      }
    </>
  )
}

export default MainLoader