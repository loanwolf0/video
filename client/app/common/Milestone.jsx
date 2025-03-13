import React from 'react'

function Milestone({step}) {
  return (
<>
  {/* <div className='timeline-container'>
    <div className='timeline'>
      <div className='step flow'>
        <div className='text d-flex gap-8 align-items-center'>
          <div className='state'>
            1
          </div>
          <div>
            Import
          </div>
        </div>
      </div>
      
      <div className='step flow'>
        <div className='text d-flex gap-8 align-items-center'>
          <div className='state'>
            2
          </div>
          <h4>
            Header Binding
          </h4>
        </div>
      </div>

      <div className='step flow'>
        <div className='text d-flex gap-8 align-items-center'>
          <div className='state'>
            3
          </div>
          <h4>
            Field Binding
          </h4>
        </div>
      </div>

      <div className='step last'>
        <div className=' d-flex gap-8 align-items-center'>
          <div className='state'>
            4
          </div>
          <h4>
            Complete
          </h4>
        </div>
      </div>




    </div>



  </div> */}
  <div className='status-container  p-0 import-box'>
      <div className='status-tab gap-12 complete'>
        <i className='check ph ph-checks'></i>
        Import
         <i className="ph ph-caret-right ms-2 ps-2 border-left-grey"></i>
      </div>
      <div className={`status-tab gap-12 ${step>=2 ? 'complete': ''}`}>
        <i className={`check ph ${step>=2 ? 'ph-checks' : 'ph-clock'}`}></i>
        Header Binding
         <i className="ph ph-caret-right ms-2 ps-2 border-left-grey"></i>
      </div>
      <div className={`status-tab gap-12 ${step>=3 ? 'complete' : ''}`}>
        <i className={`check ph ${step>=3 ? 'ph-checks' : 'ph-clock'}`}></i>
        Field Binding
         <i className="ph ph-caret-right ms-2 ps-2 border-left-grey"></i>
      </div>
      <div className={`status-tab gap-12 ${step>=4 ? 'complete' : ''}`}>
        <i className={`check ph ${step>=4 ? 'ph-checks' : 'ph-clock'}`}></i>
        Complete
         <i className="ph ph-caret-right ms-2 ps-2 border-left-grey"></i>
      </div>
  </div>
</>

  )
}

export default Milestone