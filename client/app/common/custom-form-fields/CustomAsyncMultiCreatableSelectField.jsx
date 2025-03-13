import React from 'react'
import { Controller } from 'react-hook-form'
import CustomAsyncMultiCreatableSelect from '../custom-tags/CustomAsyncMultiCreatableSelect'

const CustomAsyncMultiCreatableSelectField = ({
    name,
    control,
    rules = {},
    loadOptions = () => { },
    placeholder = '',
    className = '',
    onChange,
    disabled,
    isMulti,
    ...rest
}) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <CustomAsyncMultiCreatableSelect 
                    loadOptions={loadOptions}
                    placeholder={placeholder}
                    className={className}
                    onChange={(value) => {
                        field.onChange(value);
                        typeof onChange == 'function' && onChange(value);
                    }}
                    disabled={disabled}
                    isMulti
                    {...rest}
                />
            )}
        />
    )
}

export default CustomAsyncMultiCreatableSelectField;