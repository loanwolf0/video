import React, { useEffect, useRef } from 'react'
import toasty from '../../utils/toasty.util';

function DropZone({
    maxSize = '',
    allowedTypes = [],
    onFileDrop,
    isMultipleSelect = false,
    classList = [],
    message = ''
}) {
    const inputRef = useRef(null)

    const handleDrop = (event) => {
        event.preventDefault();
        const files = [...event.dataTransfer.files];
        validateFileSizeAndType(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileSelect = (event) => {
        const files = [...event.target.files];
        validateFileSizeAndType(files);
    };

    const validateFileSizeAndType = (files) => {
        try {
            if (!files.length) return;
            let totalSize = 0
            // filesType = []
            files.forEach(file => {
                totalSize += file.size
                // filesType.push(file.type)
            });
            if (maxSize && totalSize > maxSize) {
                toasty.error(`File size exceeds the allowed limit of ${maxSize / 1024 / 1024} MB.`);
                return;
            }

            let allowedFiles = [];
            
            if(allowedTypes[0] !== '*'){
                allowedFiles = files.filter((file) => allowedTypes.includes(file.type));
            }else{
                allowedFiles = files;
            }
            
            if (typeof onFileDrop === 'function') {
                onFileDrop(allowedFiles);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            inputRef.current.value = null;
        }
    };

    return (

        <div className={"drop-container fu-input-group " + classList.join(' ')} onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className='drag-drop-box '>
                <div>
                    <i className='ph-fill ph-plus-circle'></i>
                </div>
                <div className='d-flex flex-column gap-4'>
                    <h5>Upload File</h5>
                    <p>Drop your file here or click to select</p>
                    <p>{message}</p>
                </div>
            </div>
            <input ref={inputRef}
                type="file"
                accept={allowedTypes?.length ? allowedTypes.join(',') : '*'}
                onChange={handleFileSelect}
                multiple={isMultipleSelect}
            />
        </div>


    );
}

export default DropZone

