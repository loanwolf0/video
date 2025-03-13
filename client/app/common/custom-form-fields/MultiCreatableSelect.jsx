import React from 'react'
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const MultiCreatableSelect = ({
    name,
    control,
    rules = {},
    options = [],
    placeholder = '',
    onChange,
    disabled,
    isMulti,
    ...rest
}) => {

    const animatedComponents = makeAnimated();

    return (       
            <CreatableSelect
                menuPosition="fixed"
                placeholder={placeholder}
                components={animatedComponents}
                options={options}  
                isMulti = {isMulti}  
                onChange={(value) => {
                    typeof onChange === 'function' && onChange(value)
                }}
                isDisabled={disabled}
                {...rest}
            />         
    )
}

export default MultiCreatableSelect