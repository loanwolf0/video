import React from 'react'

const Loader = ({ isLoading, children, message = "Loading... Please hold on!", extraClass = '' }) => {

  return (
    <>
      {isLoading &&
        <div className={`h-100 w-100 d-flex loader-main flex-column gap-8 align-items-center justify-content-center ${extraClass}`}>
          {/* <div className='loader'></div>
          <h4>{message}</h4> */}
          <div className="fu-loader-new">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>}
      {children}
    </>
  )
}

export default Loader