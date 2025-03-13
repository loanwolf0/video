import React from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

const CustomNumberInputField = ({
    name,
    control,
    className = '',
    rules = {},
    defaultValue = '',
    placeholder = '',
    onChange,
    onBlur,
    disabled,
    prefix = '',
    suffix = '',
    allowNegative = false,
    thousandSeparator = ',',
    decimalScale = 2,
    decimalSeparator = '.',
    fixedDecimalScale,
    thousandsGroupStyle = 'lakh', // none, thousand, wan, lakh
}) => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <NumericFormat
                    prefix={prefix}
                    suffix={suffix}
                    getInputRef={(el) => {
                        field.ref(el)
                    }}
                    allowNegative={allowNegative}
                    thousandSeparator={thousandSeparator}
                    decimalScale={decimalScale}
                    decimalSeparator={decimalSeparator}
                    fixedDecimalScale={fixedDecimalScale}
                    thousandsGroupStyle={thousandsGroupStyle}
                    placeholder={placeholder}
                    className={className}
                    name={field.name}
                    value={field.value}
                    disabled={field.disabled || disabled}
                    onChange={(event) => {
                        const { value } = event.target;
                        const regex = new RegExp('[' + prefix + thousandSeparator + suffix + ']', 'g')
                        event.target.value = value ? Number(value.replace(regex, '')) : "";

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
    )
}

export default CustomNumberInputField
