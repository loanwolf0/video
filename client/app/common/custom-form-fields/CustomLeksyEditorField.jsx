import React from 'react'
import { Controller } from 'react-hook-form';
import CustomLeksyEditor from '../custom-tags/CustomLeksyEditor';

const CustomLeksyEditorField = ({
    name,
    control,
    labels,
    type,
    rules = {},
    defaultValue = '',
    placeholder = '',
    onChange,
    onBlur,
    onAttachment,
    disabled,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <CustomLeksyEditor
                    type={type}
                    labels={labels}
                    placeholder={placeholder}
                    value={field.value}
                    onChange={(event) => {
                        field.onChange(event);
                        typeof onChange === 'function' && onChange(event)
                    }}
                    onBlur={(event) => {
                        field.onBlur(event);
                        typeof onBlur === 'function' && onBlur(event)
                    }}
                    getInputRef={field.ref}
                    disabled={field.disabled || disabled}
                    onAttachment={onAttachment}
                />
            )}
        />)
}

export default CustomLeksyEditorField
