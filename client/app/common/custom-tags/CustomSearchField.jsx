import React from 'react'

const CustomSearchField = ({
    placeholder = '',
    onChange,
    onBlur,
    value,
    type,
    className,
    disabled,

}) => {
    return (
        <div className={` ${className} d-flex position-relative input-search`}>
            <i className="ph ph-magnifying-glass search-icon"></i>
            <input
                className={`fu-input-search fu-search-marg`}
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(event) => {
                    typeof onChange === 'function' && onChange(event.target.value)
                }}
                onBlur={(event) => {
                    typeof onBlur === 'function' && onBlur(event.target.value)
                }}
            />
            {value &&
                <button className='x-btn' type='button' >
                    <i id='reset' className='ph ph-x ' onClick={() => onChange('')}></i>
                </button>
            }
        </div>
    )
}

export default CustomSearchField
