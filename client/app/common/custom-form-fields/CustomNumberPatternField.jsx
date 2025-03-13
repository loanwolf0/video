import React from 'react';
import { PatternFormat } from 'react-number-format';
import { Controller } from 'react-hook-form';

const CustomNumberPatternField = ({
    name,
    control,
    rules = {},
    defaultValue = '',
    format,
    placeholder = '',
    onChange,
    onBlur,
    disabled,
}) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
                <PatternFormat
                    format={format}
                    mask="_"
                    name={name}
                    value={field.value}
                    getInputRef={field.ref}
                    disabled={field.disabled || disabled}
                    onValueChange={(values) => {
                        field.onChange(values.value);
                        typeof onChange === 'function' && onChange(values.value)
                    }}
                    onBlur={(event) => {
                        field.onBlur(event);
                        typeof onBlur === 'function' && onBlur(event.target.value)
                    }}
                    customInput={TextField}
                    placeholder={placeholder}
                />
            )}
        />
    );
};

const TextField = React.forwardRef(({ onBlur, onChange, ...rest }, ref) => (
    <input
        {...rest}
        onBlur={onBlur}
        onChange={onChange}
        ref={ref}
    />
));

export default CustomNumberPatternField;