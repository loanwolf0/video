'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function VideoStyle({ onHandleInputChange }) {

  const [selectedStyle, setSelectedStyle] = useState('')

  const styles = [
    'Cinematic',
    'Horror',
    'Funny',
    'Cartoon',
    'Real',
  ]
  return (

    <div className='mt-5 '>
      <h2>Video Style </h2>
      <p className='text-sm text-gray-400'>Select Video Style for Your Video.</p>
      <div className='mt-3'>
        {
          styles.map((style, index) => (
            <Button variant='outline' key={index} className={`m-2 ${style === selectedStyle && 'bg-secondary'}`} onClick={() => { setSelectedStyle(style), onHandleInputChange('videoStyle', style) }}
            >{style}</Button>
          ))
        }
      </div>

    </div>
  )
}

export default VideoStyle