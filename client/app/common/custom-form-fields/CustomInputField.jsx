import React from 'react'
import { Controller } from 'react-hook-form';
import CustomInput from '../custom-tags/CustomInput';

const CustomInputField = ({
    name,
    control,
    type = 'text',
    rules = {},
    defaultValue = '',
    placeholder = '',
    className = '',
    onChange,
    onBlur,
    disabled,
}) => {

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <CustomInput
                    type={type}
                    className={className}
                    name={field.name}
                    value={field.value}
                    placeholder={placeholder}
                    disabled={field.disabled || disabled}
                    onChange={(value) => {
                        field.onChange(value);
                        typeof onChange === 'function' && onChange(value)
                    }}
                    onBlur={(value) => {
                        field.onBlur(value);
                        typeof onBlur === 'function' && onBlur(value)
                    }}
                    getInputRef={field.ref}
                />
            )}
        />
    )
}

export default CustomInputField