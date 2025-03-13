import React from 'react'
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const CustomMultiCreatableSelectField = ({
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
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <CreatableSelect
                    className={`fu-select-wrapper `}
                    classNamePrefix="fu-select"
                    menuPosition="fixed"
                    placeholder={placeholder}
                    components={animatedComponents}
                    options={options}
                    isMulti = {isMulti}
                    {...field}
                    onChange={(value) => {
                        field.onChange(value);
                        typeof onChange === 'function' && onChange(value)
                    }}
                    isDisabled={field.disabled || disabled}
                    {...rest}
                />
            )}
        />
    )
}

export default CustomMultiCreatableSelectField
