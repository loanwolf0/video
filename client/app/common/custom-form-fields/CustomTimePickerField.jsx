import React from 'react'
import { Controller } from 'react-hook-form';
import CustomTimePicker from '../custom-tags/CustomTimePicker';

const CustomTimePickerField = ({
    name,
    control,
    rules = {},
    placeholder = '',
    onChange,
    onBlur,
    disabled,
    ...rest
}) => {

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <CustomTimePicker
                    placeholder={placeholder}
                    name={field.name}
                    timeRef={field.ref}
                    value={field.value}
                    isDisabled={field.disabled || disabled}
                    onChange={(value) => {
                        field.onChange(value);
                        typeof onChange === 'function' && onChange(value)
                    }}
                    onBlur={(value) => {
                        field.onBlur(value);
                        typeof onBlur === 'function' && onBlur(value)
                    }}
                    {...rest}
                />
            )}
        />
    )
}

export default CustomTimePickerField
