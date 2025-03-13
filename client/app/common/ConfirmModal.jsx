import React, { useState } from 'react'
import Modal from './Modal'
import SubmitButton from './SubmitButton'

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmation',
    message = 'Are you sure you want to proceed?',
    icons = []
}) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        setIsLoading(true)
        if (onConfirm instanceof Function) await onConfirm()
        setIsLoading(false)
    }

    return (
        <Modal.Container isOpen={isOpen} className='type-confirm'>
            <Modal.Header></Modal.Header>
            <Modal.Body>
                <i className={icons.join(" ")}></i>
                <div className="d-flex flex-column gap-8">
                    <h3 className='text-center'>{title}</h3>
                    <p className="text-center">{message}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex align-items-center gap-12 m-auto' style={{ textAlign: 'end' }}>
                    {onClose && <button className='fu-btn fu-btn--light fu-btn-sm fu-btn-ms' onClick={onClose}>Cancel</button>}
                    <SubmitButton className='fu-btn fu-btn--primary fu-btn-sm fu-btn-ms' onClick={handleConfirm} isSubmitting={isLoading}>Confirm</SubmitButton>
                </div>
            </Modal.Footer>
        </Modal.Container>
    )
}

export default ConfirmModal
