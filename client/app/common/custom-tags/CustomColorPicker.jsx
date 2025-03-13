import React, { useEffect, useState } from 'react'
import { COLORS_CODES } from '../../constants/colorPicker.constant';

const CustomColorPicker = ({
    className = '',
    onClick,
    onChange,
    value,
    disabled = false
}) => {
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        setSelectedColor(value);
    }, [value]);

    const handleColorSelect = (color) => {
        if (onClick) onClick(color.name ? color.name : '');
        if (onChange) onChange(color.name ? color.name : '');
        setSelectedColor(color.name ? color.name : '')
        return;
    }
    return (
        <div className='color-selector'>
            <div className='color-box-container'>
                <div className='color-box'>
                    <i className="ph ph-prohibit" onClick={() => handleColorSelect('')}></i>
                    {!selectedColor && <i className={`ph-fill ph-check-circle ${!selectedColor ? 'active' : ''}`}></i>}
                </div>
                {COLORS_CODES.map((color) => (
                    <div key={color.name} className={`color-box bg-${color.name} ${className} ${selectedColor === color.name ? 'active' : ''}`}
                        onClick={() => handleColorSelect(color)} disabled={disabled}>
                        {selectedColor === color.name && <i className={`ph-fill ph-check-circle ${selectedColor === color.name ? 'active' : ''}`}></i>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomColorPicker