'use client'
import React, { useState } from 'react'
import Topic from './_components/Topic'
import { Input } from "@/components/ui/input"
import VideoStyle from './_components/VideoStyle'
import Voice from './_components/Voice'
import UploadFile from './_components/FileUpload'
import { Button } from '@/components/ui/button'
import axios from 'axios'


function createNewVideo() {
    const [formData, setFormData] = useState('')
    const [isShow, setIsShow] = useState(false)

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const generateCaption = async () => {
        // const filePath = "https://hjljlchbvhyrwzvfpcqj.supabase.co/storage/v1/object/public/uploads/uploads/1742809553808.wav";

        // const { data } = await axios.post('/api/generate-caption', { filePath })
        // console.log(data, "data");


        const prompt = "The fox stands proudly on a rock, with all the jungle animals cheering around her. Rabbits, deer, monkeys, and birds look happy and relieved. The jungle looks bright and peaceful, with the morning sun shining warmly.";
        
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        axios.get(url, { responseType: 'blob' })
            .then(response => {
                const imgUrl = URL.createObjectURL(response.data);
                document.getElementById("generatedImage").src = imgUrl;
            })
            .catch(error => console.error("Error:", error));

        
        setIsShow(true)

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

                    <UploadFile onHandleInputChange={onHandleInputChange} />

                    <Button className='mt-3' onClick={generateCaption}> Generate Caption</Button>

                    {isShow &&
                        <img id='generatedImage' />
                    }

                </div>
                <div className='col-span-1'>
                    <h2>Preview</h2>
                </div>
            </div>

        </div>
    )
}

export default createNewVideo