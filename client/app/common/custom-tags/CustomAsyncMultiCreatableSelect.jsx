import React from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import makeAnimated from 'react-select/animated';

const CustomAsyncMultiCreatableSelect = ({
    loadOptions = () => { },
    placeholder = '',
    className = '',
    onChange,
    disabled,
    isMulti,
    ...rest
}) => {

    const animatedComponents = makeAnimated();
    
    return (
        <AsyncCreatableSelect
            menuPosition="fixed"
            className={className}
            classNamePrefix="fu-select"
            placeholder={placeholder}
            components={animatedComponents}
            loadOptions={loadOptions}
            cacheOptions
            defaultOptions
            onChange={(value) => {
                typeof onChange === 'function' && onChange(value)
            }}
            isMulti
            isDisabled={disabled}
            {...rest}
        />
    )
}

export default CustomAsyncMultiCreatableSelect