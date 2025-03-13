import React, { useState, useRef, useEffect } from 'react'
import Modal from './Modal'
import SignatureCanvas from 'react-signature-canvas'
import DropZone from './DropZone'
import toasty from '../../utils/toasty.util';

const SignatureModal = ({ isOpen, onClose, onConfirm }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [showSignature, setShowSignature] = useState(true)
    const [showUploadImage, setShowUploadImage] = useState(false)
    const [tab, setTab] = useState('signature');
    const [signatureImage, setSignatureImage] = useState()
    const sigCanvasReference = useRef(null);
    const [isError, setIsError] = useState()

    const handleConfirm = async () => {
       try {
         setIsLoading(true)
            if (tab == 'signature') {
                // Check if the canvas is empty
                if (sigCanvasReference.current.isEmpty()) {
                    setIsError(true);
                    return;
                }
                // Get base64-encoded image data from the signature canvas
                const signatureDataUrl = sigCanvasReference.current.getTrimmedCanvas().toDataURL('image/png');
    
                // Convert base64 data to a Blob
                const blob = await (await fetch(signatureDataUrl)).blob();
                const imageFile = new File([blob], 'signature.png', { type: 'image/png' });
                if (onConfirm instanceof Function) await onConfirm(imageFile)
            } else if (tab == 'image') {
                if (signatureImage) {
                    if (onConfirm instanceof Function) await onConfirm(signatureImage)
                } else {
                    setIsError(true);
                    return;
                }
            }
            setIsError(false);
       } catch (error) {
            toasty.error(error?.response?.data?.message || 'Something went wrong')
       }finally{
            setIsLoading(false)
       }
    }

    const clearSignature = () => {
        if (tab == 'signature') sigCanvasReference.current.clear();
        setSignatureImage()
    };

    const handleFileChange = async (files) => {
        const selectedFile = files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setIsError(false)
                setSignatureImage(selectedFile);
            };
            reader.readAsText(selectedFile);
            setIsLoading(false)
        }
    };

    const selectTab = (tab) => {
        setTab(tab);
        if (tab == 'signature') {
            setShowSignature(true)
            setShowUploadImage(false)
        } else if (tab == 'image') {
            setShowSignature(false)
            setShowUploadImage(true)
        }
        setSignatureImage()
    }

    return (
        <Modal.Container isOpen={isOpen}>
            <Modal.Header onClose={onClose}>
                <Modal.Title>Signature</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='fu-tab-container mb-2'>
                    <div className="fu-tabs">
                    <button className={`fu-tab   ${tab == 'signature' && 'active'}`} type='button' onClick={() => selectTab('signature')}>
                    <i class="ph ph-scribble-loop"></i> Draw Signature</button>
                    <button className={`fu-tab  ${tab == 'image' && 'active'}`} type='button' onClick={() => selectTab('image')}>
                    <i class="ph ph-cloud-arrow-up"></i>Upload Image</button>
                    </div>
                </div>
                { showSignature &&
                    <div>
                        <div className="signature-pad">
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
                                ref={sigCanvasReference}
                            />
                        </div>
                        <div className='d-flex gap-12 my-2'>
                            <div className='signature-actions'>
                                <button className='fu-btn fu-btn--light fu-btn-sm' type='button' onClick={clearSignature}>Clear</button>
                            </div>
                        </div>
                    </div>
                }
                { showUploadImage &&
                    <div className='fu-input-wrap'>
                        <DropZone allowedTypes={['image/jpeg', 'image/png', 'image/jpeg']} onFileDrop={handleFileChange} classList={['drop-sm']} 
                        message='Only image files (e.g., .jpg, .png and .jpeg) are allowed.'/>
                        {isError && <small className="text-error">{isError}</small>}
                    </div>
                }
                {isError && <small className='text-error'>Signature is required.</small>}
                { signatureImage &&
                    <div className='d-flex flex-column gap-12 mt-3'>
                        <div className='drop-upload' >
                            <img src={URL.createObjectURL(signatureImage)} alt="Signature preview" width={200} />
                        </div>
                        <div className='d-flex align-items-center gap-12'>
                            <span> {signatureImage?.originalName || signatureImage?.name}</span>
                            <button type='button' onClick={() => clearSignature()}><i className="fu font-size-14 icon-btn-xs  fu-btn--danger ph ph-trash"></i></button>
                        </div>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                {onClose && <button className='fu-btn fu-btn--light fu-btn-sm' onClick={onClose}>Cancel</button>}
                <button className='fu-btn fu-btn--primary fu-btn-sm' onClick={handleConfirm} disabled={isLoading}>Confirm</button>
            </Modal.Footer>
        </Modal.Container>

    )
}

export default SignatureModal