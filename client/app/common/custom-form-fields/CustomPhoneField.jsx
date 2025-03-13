import React, { useRef } from 'react'
import { Controller } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const CustomPhoneField = ({
    name,
    control,
    rules = {},
    defaultValue = '',
    placeholder = '',
    isValidate = true,
    onChange,
    onBlur,
    disabled,
}) => {

    const selectedCountry = useRef(null)

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            rules={{
                validate: (value) => {
                    if (isValidate && value && selectedCountry.current?.format) {
                        const phoneNumberLength = value.length - selectedCountry.current.dialCode.length - 1
                        if (phoneNumberLength) {
                            const isValid = phoneNumberLength === selectedCountry.current.format.replace(/[^.]+/g, "").length;
                            return isValid || "Phone number is not valid"
                        }
                    }
                    if (rules.required) {
                        const phoneNumberLength = value.length - selectedCountry.current.dialCode.length - 1
                        if (phoneNumberLength < 1) return rules.required
                    }
                }
            }}
            render={({ field }) => (
                <PhoneInput
                    className="fu-phone-wrapper"
                    classNamePrefix="fu-phone-input"
                    defaultCountry="in"
                    name={field.name}
                    value={field.value}
                    onChange={(phone, { country, inputValue }) => {
                        if (phone === '+' + country.dialCode) phone = ''
                        selectedCountry.current = country
                        field.onChange(phone)
                        typeof onChange === 'function' && onChange(phone)
                    }}
                    ref={field.ref}
                    onBlur={(event) => {
                        field.onBlur();
                        typeof onBlur === 'function' && onBlur(event.target.value)
                    }}
                    disabled={disabled || field.disabled}
                    placeholder={placeholder}
                />
            )}
        />
    )
}

export default CustomPhoneField