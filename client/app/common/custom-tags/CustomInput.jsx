import React, { useEffect, useState } from 'react'

const CustomInput = ({
    name,
    type='text',
    className = '',
    placeholder = '',
    disabled,
    onChange,
    value,
    onBlur,
    getInputRef,
}) => {

    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        if (value != inputValue)
            setInputValue(value)
    }, [value])

    const handleInputRef = (ref) => {
        if (getInputRef instanceof Function) getInputRef(ref)
    }

    return (
        <input
            name={name}
            ref={handleInputRef}
            type={type}
            className={className}
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => {
                setInputValue(event.target.value)
                typeof onChange === 'function' && onChange(event.target.value.trim())
            }}
            onBlur={(event) => {
                typeof onBlur === 'function' && onBlur(event.target.value.trim())
            }}
        />
    )
}

export default CustomInput