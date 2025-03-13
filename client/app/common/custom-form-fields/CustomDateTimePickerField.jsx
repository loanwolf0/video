import React from 'react';
import { Controller } from 'react-hook-form';
import CustomDateTimePicker from '../custom-tags/CustomDateTimePicker';

const CustomDateTimePickerField = ({
    name,
    control,
    rules = {},
    disabled = false,
    onChange,
    onBlur,
    isTimeShow,
    minDate,
    maxDate,
    minTime,
    maxTime,
    placeholder,
    label,
    errorMessage = 'Invalid Date',
    ...rest
}) => {

    return (
        <Controller
            name={name}
            control={control}
            rules={
                {
                    validate: (value) => {
                        if (rules.required) {
                            if (value == "INVALID")
                                return errorMessage;
                            else if (!value)
                                return rules.required;
                        }
                        if (rules.validate instanceof Function) {
                            return rules.validate(value)
                        }
                        return true;
                    }
                }
            }
            render={({ field }) => (
                <CustomDateTimePicker
                    value={field.value}
                    onChange={(value) => {
                        field.onChange(value);
                        typeof onChange === 'function' && onChange(value)
                    }}
                    onBlur={(value) => {
                        field.onBlur(value);
                        typeof onBlur === 'function' && onBlur(value)
                    }}
                    disabled={disabled}
                    isTimeShow={isTimeShow}
                    minDate={minDate}
                    maxDate={maxDate}
                    minTime={minTime}
                    maxTime={maxTime}
                    placeholder={placeholder}
                    label={label}
                    {...rest}
                />
            )}
        />
    );
};

export default CustomDateTimePickerField;
