import React, { useState } from 'react'
import { Controller } from 'react-hook-form'

const CustomPasswordField = ({
    name,
    control,
    rules = {},
    defaultValue = '',
    placeholder = '',
    onChange,
    onBlur,
    disabled,
}) => {

    const [isPasswordShow, setIsPasswordShow] = useState(false);

    return (
        <>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                rules={rules}
                render={({ field }) => (
                    <input
                        className="pre-btn fu-input post-btn pswd"
                        type={isPasswordShow ? 'text' : 'password'}
                        placeholder={placeholder}
                        {...field}
                        disabled={field.disabled || disabled}
                        onChange={(event) => {
                            field.onChange(event);
                            typeof onChange === 'function' && onChange(event.target.value)
                        }}
                        onBlur={(event) => {
                            field.onBlur(event);
                            typeof onBlur === 'function' && onBlur(event.target.value)
                        }}
                    />
                )}
            />
            <button className='fu-input-btn input-post-btn' type='button' onClick={() => { setIsPasswordShow(old => !old) }}>
                <i className={`fu-icon icon-size-18  ${isPasswordShow ? 'ph ph-eye' : ' ph ph-eye-slash'}`}></i>
            </button>

            <div className='fu-input-btn input-pre-btn icon-btn-primary-ligh' >
                <i className='fu-icon ph-fill ph-key'></i>
            </div>
        </>
    )
}

export default CustomPasswordField