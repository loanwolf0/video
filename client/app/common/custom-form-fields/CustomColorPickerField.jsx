import React from 'react';
import { Controller } from 'react-hook-form';
import CustomColorPicker from '../custom-tags/CustomColorPicker';

const CustomColorPickerField = ({
    name,
    control,
    disabled,
    onChange,
    className = '',
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <CustomColorPicker
                    className={className}
                    onChange={(value) => {
                        field.onChange(value);
                        typeof onChange === 'function' && onChange(value)
                    }}
                    disabled={disabled}
                    value={field.value}
                />
            )}
        />
    );
};

export default CustomColorPickerField;
