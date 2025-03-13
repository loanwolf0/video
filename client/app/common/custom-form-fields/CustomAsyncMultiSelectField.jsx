import React from 'react';
import { Controller } from 'react-hook-form';
import makeAnimated from 'react-select/animated';
import AsyncReactSelect from 'react-select/async';

const CustomAsyncMultiSelectField = ({
    name,
    control,
    rules = {},
    loadOptions = () => { },
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
                <AsyncReactSelect
                    menuPosition="fixed"
                    className="fu-select-wrapper"
                    classNamePrefix="fu-select"
                    placeholder={placeholder}
                    components={animatedComponents}
                    loadOptions={loadOptions}
                    cacheOptions
                    defaultOptions
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

export default CustomAsyncMultiSelectField
