import React from 'react'
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const CustomMultiCreatableSelect = ({
    options = [],
    placeholder = '',
    onChange,
    disabled,
    ...rest
}) => {

    const animatedComponents = makeAnimated();

    return (
        <CreatableSelect
            menuPosition="fixed"
            placeholder={placeholder}
            components={animatedComponents}
            options={options}
            onChange={(value) => {
                typeof onChange === 'function' && onChange(value)
            }}
            isDisabled={disabled}
            {...rest}
        />
    )
}

export default CustomMultiCreatableSelect