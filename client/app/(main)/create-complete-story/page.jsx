'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import Voice from './_components/Voice'
import axios from 'axios'

import { Player } from '@remotion/player';
import { RemotionVideo, MyVideo } from '@/app/utils/RemotionVideo'
import toasty from '@/app/utils/toasty.util'
import { Flag, Loader2Icon, SparkleIcon } from 'lucide-react'

function CreateNewVideo() {
    const [formData, setFormData] = useState({})
    const [isShow, setIsShow] = useState(false)
    const [images, setImages] = useState([])
    const [texts, setTexts] = useState([])
    const [loading, setLoading] = useState(false)

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const handleEditTexts = (index, newValue) => {
        setTexts(prevTexts => {
            const updatedTexts = [...prevTexts];
            updatedTexts[index] = newValue;
            return updatedTexts;
        });
    };


    const generateCaption = async () => {
        if (!formData.title) {
            toasty.info("Please enter a short info.")
            return;
        }
        setLoading(true)
        const { data } = await axios.post('/api/generate-cartoon-story', {
            title: formData.title || ''
        })


        const extractedImages = data
            .filter(item => item.image && item.image.trim() !== '') // Only keep non-empty images
            .map(item => item.image);

        // console.log(
        //     extractedImages.map((img, idx) =>
        //         img ? `Image ${idx}: ${img.substring(0, 50)}...` : `Image ${idx}: MISSING`
        //     ),
        //     "Extracted Images"
        // );

        const extractedTexts = data
            .filter(item => item.text && item.text.trim() !== '') // Only keep non-empty texts
            .map(item => item.text);


        setTexts(extractedTexts)

        setImages(extractedImages);
        setIsShow(true);
        setLoading(false)

    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">Create New Video</h1>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="col-span-6 border rounded-xl p-7 h-[70vh] overflow-auto">
                    {/* Title Input */}
                    <div className=" p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-300 mb-4">Example Inputs</h2>
                        <p className="text-gray-500 p-3 rounded-lg shadow-sm mb-2">
                            🐰 A rabbit who helps a baby lion. After some time when the rabbit is in danger the lion helps him.
                        </p>
                        <p className="text-gray-500 p-3 rounded-lg shadow-sm">
                            🐻 A bear who helps a baby lion. After some times when the bear is in danger the lion helps him.
                        </p>
                    </div>

                    <Input type="text" disabled={loading} placeholder="A rabbit who helps a baby lion after some times when rabbit in danger then lion helps him" onChange={(e) => onHandleInputChange('title', e.target.value)} />

                    {/* Voice Selection */}
                    {/* <Voice onHandleInputChange={onHandleInputChange} /> */}


                    <Button className='mt-3' disabled={loading} onClick={generateCaption}> {loading ? <Loader2Icon className='animate-spin' /> : <SparkleIcon />}Generate Story</Button>

                    {/* Image Preview */}
                    {isShow && images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                            {images.map((image, index) => (
                                <img key={index} src={`data:image/png;base64,${image}`}
                                    alt={`Generated Image ${index}`}
                                    className="w-full h-32 object-cover rounded-lg shadow-md"
                                />
                            ))}
                        </div>
                    )}


                    {/*  Texts Preview */}
                    {
                        isShow && texts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5" >
                                {
                                    texts.map((text, index) => (
                                        <textarea key={index} name={index} id={index} defaultValue={text}  // Use defaultValue instead of value
                                            onBlur={(event) => handleEditTexts(index, event.target.value.trim())}
                                            className="w-full p-2 border rounded-md"
                                            rows={Math.min(5, text.split("\n").length + 1)}
                                        >

                                        </textarea>
                                    ))
                                }
                            </div>
                        )
                    }

                    {/* Add this inside the return statement to preview the video */}
                    {isShow && images.length > 0 && (
                        <div className="mt-5">
                            <h2 className="text-xl font-semibold">Video Preview</h2>
                            <Player
                                component={MyVideo}
                                inputProps={{ images }} // Ensure images are passed
                                durationInFrames={images.length * 30} // Dynamic based on images
                                fps={30}
                                compositionWidth={1920} // Ensure set
                                compositionHeight={1080} // Ensure set
                                width={640} // Display width
                                height={360} // Display height
                                controls
                            />

                        </div>
                    )}
                </div>

                {/* <div className="col-span-1">
                    <h2 className="text-xl font-semibold">Preview</h2>
                </div> */}
            </div>
        </div>
    )
}

export default CreateNewVideo;
