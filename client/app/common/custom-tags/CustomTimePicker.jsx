import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PatternFormat } from 'react-number-format';
import moment from 'moment';
import OutsideClickHandler from '../OutsideClickHandler';

const CustomTimePicker = ({
    value,
    placeholder = '',
    isDisabled = false,
    onChange,
    onBlur,
    interval = 15,
    timeRef,
    className = '',
}) => {

    const [time, setTime] = useState(value)
    const [timeslots, setTimeslots] = useState([]);
    const [isShowTimeslot, setIsShowTimeslot] = useState(false);
    const [timeslotStyle, setTimeslotStyle] = useState({})

    const isValidTime = useRef(true)
    const timeslotRef = useRef(null)
    const timeInputRef = useRef(null)
    const isShowRef = useRef(false)

    useEffect(() => {
        setTimeslots(generateTimeSlots())

        timeInputRef.current?.addEventListener('positionChanged', handleClose);
        window.addEventListener('blur', handleClose);

        return () => {
            timeInputRef.current?.removeEventListener('positionChanged', handleClose, false);
            window.removeEventListener('blur', handleClose, false);
        }
    }, [])

    useEffect(() => {
        setTime(value)
    }, [value])

    useEffect(() => {
        isShowRef.current = isShowTimeslot
        if (isShowTimeslot) {
            let prevRect = timeInputRef.current.getBoundingClientRect();

            const checkPosition = () => {
                const rect = timeInputRef.current.getBoundingClientRect();
                if (rect.top !== prevRect.top || rect.left !== prevRect.left) {
                    timeInputRef.current.dispatchEvent(new Event('positionChanged'));
                    prevRect = rect;
                }
                isShowRef.current && requestAnimationFrame(checkPosition);
            };

            requestAnimationFrame(checkPosition);
        }
    }, [isShowTimeslot])

    useLayoutEffect(() => {
        if (isShowTimeslot) calculatePosition()
    }, [isShowTimeslot])

    const handleClose = () => setIsShowTimeslot(false);

    const calculatePosition = () => {
        const timeInputRect = timeInputRef.current.getBoundingClientRect()
        const timeslotRect = timeslotRef.current.getBoundingClientRect(); // Get button's position and size
        const viewportHeight = window.innerHeight;

        let top;
        const left = timeInputRect.left;
        if (timeInputRect.bottom + timeslotRect.height < viewportHeight) {
            top = timeInputRect.bottom
        } else if (timeInputRect.top - timeslotRect.height > 0) {
            top = timeInputRect.top - timeslotRect.height
        } else {
            top = timeInputRect.bottom
        }

        setTimeslotStyle({
            ...(top && { top: top + 'px' }),
            ...(left && { left: left + 'px' }),
            width: timeInputRect.width + 'px',
        })
    }

    const generateTimeSlots = () => {
        const times = [];
        let start = moment().startOf("day");
        const end = moment().endOf("day");
        while (start <= end) {
            times.push(start.format("HH:mm"));
            start = start.add(interval, "minutes");
        }
        return times;
    }

    const validateTime = (data) => {
        if (data.value.length !== 4) return
        const values = data.formattedValue.split(':')
        if (values.length === 2) {
            if (Number(values[0]) < 24 && Number(values[1]) < 60) return data.formattedValue
        } else return
    }

    return (
        <div className={`fu-time-picker fu-input ${className}`} ref={timeInputRef}>
            <i className='ph ph-clock' />
            <PatternFormat
                format={'##:##'}
                onClick={() => { setIsShowTimeslot(true) }}
                getInputRef={timeRef}
                value={time}
                disabled={isDisabled}
                onValueChange={(values) => {
                    setTime(values.formattedValue)
                    const value = validateTime(values) || ''
                    isValidTime.current = !!value
                    value && typeof onChange === 'function' && onChange(value)
                }}
                onBlur={(event) => {
                    if (!isValidTime.current) setTime('')
                    typeof onBlur === 'function' && onBlur(event.target.value)
                }}
                placeholder={placeholder}
            />
            {time && <button
                type='button'
                onClick={() => {
                    setTime('')
                    typeof onChange === 'function' && onChange('')
                }}
            >
                <i className='ph ph-x' />
            </button>}

            {isShowTimeslot && <OutsideClickHandler callback={() => { setIsShowTimeslot(false) }}>
                <div ref={timeslotRef} className={`timeslot`} style={timeslotStyle}>
                    {timeslots.map(timeslot => (
                        <button
                            onClick={(e) => {
                                setIsShowTimeslot(false);
                                setTime(timeslot)
                                typeof onChange === 'function' && onChange(timeslot)
                                typeof onBlur === 'function' && onBlur()
                            }}
                            type='button'
                            className={timeslot === time ? 'active' : ''}
                            key={timeslot}
                        >
                            {timeslot}
                        </button>
                    ))}
                </div>
            </OutsideClickHandler>}
        </div>
    )
}

export default CustomTimePicker