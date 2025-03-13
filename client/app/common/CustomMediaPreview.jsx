import React from 'react';

const CustomMediaPreview = ({ mimetype, src, title, text }) => {
    return (
        <>
            {mimetype.startsWith('image') && (
                <img src={src} alt='Image Preview' style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )}
            {mimetype.startsWith('video') && (
                <video src={src} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    Your browser does not support the video tag.
                </video>
            )}
            {mimetype.startsWith('audio') && (
                <audio src={src} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    Your browser does not support the audio tag.
                </audio>
            )}
            {mimetype === 'application/pdf' && (
                <iframe
                    src={src + '#toolbar=0&navpanes=0&scrollbar=0'} 
                    title={title}
                    width='595px'
                    height='100%'
                    style={{ border: 'none', backgroundColor: 'transparent', maxWidth: '100%' }}
                >
                    This browser does not support PDFs.
                </iframe>
            )}
            {mimetype === 'text/plain' && (
                <div dangerouslySetInnerHTML={{ __html: text }} />
            )}
        </>
    )
}

export default CustomMediaPreview;