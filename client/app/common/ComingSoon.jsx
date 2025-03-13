import React from 'react'

const ComingSoon = ({ component }) => {
  return (
    component
      ? <div className="h-100 d-flex justify-content-center align-items-center">
        <div className='text-center'>
          <h2 className='mb-2'>Coming Soon</h2>
          <p>We will be celebrating the launch of <br /> our new site very soon!</p>
        </div>
      </div>
      : <div className="container fu-body">
        <div className='fu-content-body '>
          <div className="fu-scroll-body height-lg d-flex justify-content-center align-items-center">
            <div className='text-center'>
              <h1 className='mb-2'>Coming Soon</h1>
              <p>We're working hard to bring you something amazing. Stay tuned!</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ComingSoon