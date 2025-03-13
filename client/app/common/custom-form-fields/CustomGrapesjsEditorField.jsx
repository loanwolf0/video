import React from 'react'
import CustomGrapesjsEditor from '../custom-tags/CustomGrapesjsEditor'
import { Controller } from 'react-hook-form';

const CustomGrapesjsEditorField = ({
    name,
    control,
    rules = {},
    onChange,
    labels,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <CustomGrapesjsEditor
                    labels={labels}
                    value={field.value}
                    onChange={(event) => {
                        field.onChange(event);
                        typeof onChange === 'function' && onChange(event.target.value)
                    }}
                />
            )}
        />
    )
}

export default CustomGrapesjsEditorField