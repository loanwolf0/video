import React from 'react'

function Logo({ height, width, viewBox }) {
    return (
        <svg className='logo-icon' xmlns="http://www.w3.org/2000/svg" width={width || "100"} height={height || "100"} viewBox={viewBox || "0 0 100 100"} fill="none">
            <path d="M40.9839 32.8584H70.1283C62.8422 46.3719 61.2661 48.8988 52.6349 48.8988H37.1659C32.4364 39.8619 36.7246 35.1176 40.9839 32.8584Z" fill="url(#paint0_linear_156_22478)" />
            <path d="M39.542 12.9771H77.1249C70.9182 23.8213 68.774 27.4829 61.3932 27.4829H38.021C33.0796 27.4829 26.3314 30.0013 23.2052 36.2469C19.0706 25.8711 26.4323 12.9771 39.542 12.9771Z" fill="url(#paint1_linear_156_22478)" />
            <path d="M24.33 60.6381C17.5399 48.8988 26.3421 32.8584 41.0127 32.8584C36.7243 35.1176 32.4361 39.862 37.1757 48.8988L44.3981 61.3244C48.3478 68.102 47.7037 71.2795 39.207 86.4016L24.33 60.6381Z" fill="url(#paint2_linear_156_22478)" />
            <defs>
                <linearGradient id="paint0_linear_156_22478" x1="39.8483" y1="30.8254" x2="33.474" y2="51.223" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D48E" />
                    <stop offset="1" stopColor="#129066" />
                </linearGradient>
                <linearGradient id="paint1_linear_156_22478" x1="71.9287" y1="7.10312" x2="46.2867" y2="27.436" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#01C851" />
                    <stop offset="1" stopColor="#00D58E" />
                </linearGradient>
                <linearGradient id="paint2_linear_156_22478" x1="34.366" y1="32.8584" x2="34.366" y2="86.4016" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#01C851" />
                    <stop offset="0.5" stopColor="#01C886" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default Logo