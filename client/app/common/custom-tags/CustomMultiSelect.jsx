import React from 'react'
import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated';

const CustomMultiSelect = ({
    options = [],
    placeholder = '',
    className = '',
    onChange,
    onBlur,
    value,
    disabled,
    ...rest
}) => {

    const animatedComponents = makeAnimated();

    return (
        <ReactSelect
            menuPosition="fixed"
            className={`fu-select-wrapper ${className}`}
            classNamePrefix="fu-select"
            value={value ?? (rest.isMulti ? [] : '')}
            options={options}
            placeholder={placeholder}
            components={animatedComponents}
            onChange={(value) => {
                typeof onChange === 'function' && onChange(value)
            }}
            onBlur={(e) => {
                typeof onBlur === 'function' && onBlur(value)
            }}
            isDisabled={disabled}
            {...rest}
        />
    )
}

export default CustomMultiSelect
