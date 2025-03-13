import React from 'react'

// size value can be sm, md, lg
const ModalContainer = ({ children, isOpen, customSize, className = '' }) => {
    return (
        isOpen
            ? <div className="modal">
                <div className={`modal-content modal-${customSize || 'sm'} type-regular ${className}`}>
                    {children}
                </div>
            </div>
            : <></>
    )
}

const ModalHeader = ({ children, onClose }) => {

    const handleOnClose = () => {
        if (onClose instanceof Function) onClose()
    }

    return (
        <div className="modal-header">
            {children}
            {onClose && <button type='button' onClick={handleOnClose} className="ph ph-x font-size-20 text-icon"></button>}
        </div>
    )
}

const ModalTitle = ({ children }) => {
    return (
        <span className="modal-title">
            {children}
        </span>
    )
}

const ModalBody = ({ children }) => {
    return (
        <div className="modal-body">
            {children}
        </div>
    )
}

const ModalFooter = ({ children }) => {
    return (
        <div className="modal-footer">
            {children}
        </div>
    )
}

const Modal = {
    Container: ModalContainer,
    Title: ModalTitle,
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
}

export default Modal