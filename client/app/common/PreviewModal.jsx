import React from 'react';
import CustomMediaPreview from './CustomMediaPreview';

const PreviewModal = ({ mimetype, src, title, text, isOpen, onClose }) => {
    const handleOnClose = () => {
        if (onClose instanceof Function) onClose()
    }
    return (
        isOpen
            ?
            <div class="preview-modal-overlay">
                <div class="preview-modal-content">
                    <div className="preview-modal-header d-flex align-items-center justify-content-between">
                        <h3 className="file-name ">filename.img</h3>
                        <div className='d-flex align-items-center gap-16'>
                            <i class="ph-fill ph-download-simple  preview-modal-download"></i>
                            {onClose && <span class="preview-modal-close">
                                <button type='button' onClick={handleOnClose} className="ph font-size-24 ph-x font-size-20 " />
                            </span>}

                        </div>
                    </div>

                    <div class="preview-modal-body">
                        <CustomMediaPreview mimetype={mimetype} src={src} title={title} text={text} />
                    </div>
                </div>
            </div>
            : <></>
    )
}

export default PreviewModal;