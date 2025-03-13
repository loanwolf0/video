import React from 'react';
import makeAnimated from 'react-select/animated';
import AsyncReactSelect from 'react-select/async';

const CustomAsyncMultiSelect = ({
    loadOptions = () => { },
    className = '',
    placeholder = '',
    onChange,
    value,
    disabled,
    ...rest
}) => {

    const animatedComponents = makeAnimated();

    return (
        <AsyncReactSelect
            menuPosition="fixed"
            className={`fu-select-wrapper ${className}`}
            classNamePrefix="fu-select"
            placeholder={placeholder}
            components={animatedComponents}
            loadOptions={loadOptions}
            cacheOptions
            value={value || []}
            defaultOptions
            onChange={(value) => {
                typeof onChange === 'function' && onChange(value)
            }}
            isDisabled={disabled}
            {...rest}
        />)
}

export default CustomAsyncMultiSelect