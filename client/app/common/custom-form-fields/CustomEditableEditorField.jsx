import React, { forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import CustomEditableEditor from '../custom-tags/CustomEditableEditor'

const CustomEditableEditorField = ({
    name,
    control,
    rules = {},
    defaultValue = '',
    placeholder = '',
    onChange,
    onBlur,
    disabled,
    labels = [],
    preventEnter,
}, ref) => {

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <CustomEditableEditor
                    placeholder={placeholder}
                    labels={labels}
                    value={field.value}
                    onChange={(e) => {
                        const innerText = e.target.innerText;
                        let value = e.target.innerHTML
                        if (!innerText.trim()) value = ''
                        field.onChange(value)
                        console.log('editor');
                        
                        typeof onChange === 'function' && onChange(value)
                    }}
                    onBlur={(e) => {
                        const innerText = e.target.innerText;
                        let value = e.target.innerHTML
                        if (!innerText.trim()) value = ''
                        field.onChange(value)
                        typeof onBlur === 'function' && onBlur(value)
                    }}
                    isDisabled={field.disabled || disabled}
                    preventEnter={preventEnter}
                    getInputRef={(el) => {
                        field.ref(el)
                    }}
                    ref={ref}
                />
            )}
        />
    )
}

export default forwardRef(CustomEditableEditorField)