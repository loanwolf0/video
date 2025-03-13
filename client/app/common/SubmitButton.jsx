import React from 'react'

const SubmitButton = ({
    isSubmitting,
    disabled,
    children,
    className,
    onClick,
}) => {
    return (<button onClick={onClick} type="submit" className={className} disabled={disabled || isSubmitting}>
        {children}
        {isSubmitting && <i className="spinner ph ph-spinner-gap"></i>}
    </button>)
}

export default SubmitButton