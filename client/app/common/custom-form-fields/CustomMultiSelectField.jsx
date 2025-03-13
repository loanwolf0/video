import React from 'react'
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated';

const CustomMultiSelectField = ({
    name,
    control,
    rules = {},
    options = [],
    placeholder = '',
    onChange,
    disabled,
    ...rest
}) => {

    const animatedComponents = makeAnimated();

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <ReactSelect
                    menuPosition="fixed"
                    className="fu-select-wrapper"
                    classNamePrefix="fu-select"
                    options={options}
                    placeholder={placeholder}
                    components={animatedComponents}
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

export default CustomMultiSelectField
