'use client'
import React, { useState } from 'react'
import Topic from './_components/Topic'
import { Input } from "@/components/ui/input"
import VideoStyle from './_components/VideoStyle'
import Voice from './_components/Voice'


function createNewVideo() {
    const [formData, setFormData] = useState('')

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    console.log(formData, "???PPPPP");

    return (
        <div>
            <h1 className='text-3xl'>Create New Video</h1>


            <div className='grid grid-cols-1 md:grid-cols-4'>
                <div className='col col-span-3 border rounded-xl p-7 h-[70vh] overflow-auto'>
                    {/* title Project */}
                    <Input type="text" placeholder="Title" onChange={(event) => onHandleInputChange('title', event.target.value)} />

                    {/*  Topic selection  */}
                    <Topic onHandleInputChange={onHandleInputChange} />

                    {/* Video Style Selection */}
                    <VideoStyle onHandleInputChange={onHandleInputChange} />

                    {/* Voice Selection */}
                    <Voice onHandleInputChange={onHandleInputChange} />
                </div>
                <div className='col-span-1'>
                    <h2>Preview</h2>
                </div>
            </div>

        </div>
    )
}

export default createNewVideo