'use client'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Loader2Icon, SparkleIcon } from 'lucide-react'
import { api } from '@/app/config'
import axios from 'axios'


function Topic({ onHandleInputChange }) {
    const [selectedTopic, setSelectedTopic] = useState('')
    const [script, setScript] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedScript, setSelectedScript] = useState('')


    const suggestions = [
        'History Battle',
        'Latest movie',
        'Health',
        'News',
        'Cricket',
        'Kids Story',
        'Instagram reels'
    ]

    const generateScript = async () => {
        console.log("script making ..");
        setLoading(true)
        const { data } = await axios.post('/api/generate-script', {
            topic: selectedTopic
        })
        setLoading(false)
        setScript(data?.scripts[0])
        setSelectedScript(data?.scripts[0])
    }

    return (
        <div>
            <h3>Topic </h3>
            {/*  input  */}
            <div className='mt-5'>
                <h2>Video Topic</h2>
                <p className='text-sm text-gray-400'>Select Video topic</p>
                <div className='mt-3' >
                    <Tabs defaultValue="suggestion" className="w-full">
                        <TabsList>
                            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
                            <TabsTrigger value="Your_Topic">Your Topic</TabsTrigger>
                        </TabsList>
                        <TabsContent value="suggestion">
                            {
                                suggestions.map((suggestion, index) => (
                                    <Button variant='outline' key={index} className={`m-2 ${suggestion === selectedTopic && 'bg-secondary'}`} onClick={() => { setSelectedTopic(suggestion), onHandleInputChange('topic', suggestion) }}
                                    >{suggestion}</Button>
                                ))
                            }
                        </TabsContent>
                        <TabsContent value="Your_Topic">Change your Your Topic here.</TabsContent>
                    </Tabs>
                </div>

            </div>

            {script && script.length > 1 &&
                <div className='grid grid-cols-2 gap-5 mt-5 p-2 '>
                    {
                        script.map((item, index) => (
                            <div key={index} className='text-sm text-gray-300 line-clamp-4'>
                                <h2>{item.content}</h2>
                            </div>
                        ))
                    }
                </div>
            }

            {
                !script && !script.length &&
                <Button className='mt-3' disabled={loading} onClick={generateScript}> {loading ? <Loader2Icon className='animate-spin' /> : <SparkleIcon />}Generate Script</Button>
            }


        </div>
    )
}

export default Topic