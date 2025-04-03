// import { Button } from '@/components/ui/button'
// import React from 'react'

// function Hero() {
//     return (
//         <div className='p-10 flex flex-col items-center justify-center mt-24 md:px-20 lg:px-36 xl:px-48'>
//             <h2 className='font-bold text-6xl text-center'>AI Video Generator </h2>
//             <p className='mt-4 text-2xl text-center text-gray-700'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure pariatur repudiandae, harum et quo ut maxime nisi nulla minima eius.</p>

//             <div className='mt-7 flex gap-5'>
//                 <Button size='lg' variant='outline' >Explore</Button>
//                 <Button size='lg' variant='secondary'>Get Started</Button>
//             </div>

//         </div>
//     )
// }

// export default Hero



"use client"; // Required for hooks in Next.js 13+ (App Router)

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function Hero() {
    const router = useRouter();

    return (
        <div className="p-10 flex flex-col items-center justify-center mt-24 md:px-20 lg:px-36 xl:px-48">
            <h2 className="font-bold text-6xl text-center">AI Video Generator</h2>
            <p className="mt-4 text-2xl text-center text-gray-700">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure pariatur repudiandae, harum et quo ut maxime nisi nulla minima eius.
            </p>

            <div className="mt-7 flex gap-5">
                <Button size="lg" variant="outline">Explore</Button>
                <Button size="lg" variant="secondary" onClick={() => router.push("/create-complete-story")}>
                    Get Started
                </Button>
            </div>
        </div>
    );
}

export default Hero;
