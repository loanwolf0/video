import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import moment from "moment";
import { PatternFormat } from 'react-number-format';
import Select from 'react-select';
import { generateYears } from "../../../utils/date-format.util";

const CustomDateTimePicker = ({
    onChange,
    onBlur,
    disabled = false,
    isTimeShow = true,
    value,
    interval = 15,
    minDate = "",
    maxDate = "",
    minTime = "",
    maxTime = "",
    placeholder = "DD/MM/YYYY HH:MM",
    label = "Date",
    customElement,
}) => {
    const initialDate = moment(new Date()).format("YYYY-MM");
    const initialTime = moment(new Date()).format("HH:mm");

    const [date, setDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate); // only for checks
    const [time, setTime] = useState(initialTime);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const [inputValue, setInputValue] = useState(null);
    const [inputFormat, setInputFormat] = useState("##/##/#### ##:##");
    const [fieldValue, setFieldValue] = useState(null)

    const pickerRef = useRef(null);
    const inputFieldRef = useRef(null);
    const patternFieldRef = useRef(null);
    const containerRef = useRef(null);

    const [containerPosition, setContainerPosition] = useState({});
    const isPickerOpenRef = useRef(false)

    const months = [
        { label: "Jan", value: "01" },
        { label: "Feb", value: "02" },
        { label: "Mar", value: "03" },
        { label: "Apr", value: "04" },
        { label: "May", value: "05" },
        { label: "Jun", value: "06" },
        { label: "Jul", value: "07" },
        { label: "Aug", value: "08" },
        { label: "Sep", value: "09" },
        { label: "Oct", value: "10" },
        { label: "Nov", value: "11" },
        { label: "Dec", value: "12" }
    ];

    useLayoutEffect(() => {
        if (containerRef.current && inputFieldRef.current) {
            calculatePosition()
        }
    }, [isPickerOpen])

    useEffect(() => {
        if (!isTimeShow) {
            setInputFormat("##/##/####")
        }

        // handle picker close on clicking somewhere outside of the main div
        const handleClickOutside = (event) => {
            if (
                customElement &&
                (inputFieldRef.current && !inputFieldRef.current.contains(event.target)) &&
                (containerRef.current && !containerRef.current.contains(event.target))
            ) {
                handleClose();
            }
            if (
                !customElement &&
                (patternFieldRef.current && !patternFieldRef.current.contains(event.target)) &&
                (containerRef.current && !containerRef.current.contains(event.target))
            ) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        //...................................................................

        // handle picker close on clicking outside of the current window itself................
        inputFieldRef.current?.addEventListener('positionChanged', handleClose);
        window.addEventListener('blur', handleClose);
        //...................................................................

        return () => {
            inputFieldRef.current?.removeEventListener('positionChanged', handleClose, false);
            window.removeEventListener('blur', handleClose, false);
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    useEffect(() => {
        let format = "DD/MM/YYYY HH:mm";

        if (!isTimeShow) {
            format = "DD/MM/YYYY"
        }

        if (value && moment(new Date(value)).isValid()) {
            // workaround for handeling DST................
            let formattedValue;
            if (!isTimeShow && String(value).length > 16) {
                const val = new Date(value).toISOString().split("T");
                formattedValue = new Date(val[0].split('-')[0], val[0].split('-')[1] - 1, val[0].split('-')[2])
            } else
                formattedValue = new Date(value);
            // .........................
            setInputValue(moment(formattedValue).format(format))
            const initialDate = moment(formattedValue).format("YYYY-MM-DD");
            const initialTime = moment(formattedValue).format("HH:mm");

            setDate(initialDate);
            setSelectedDate(initialDate)
            setTime(initialTime);
        }
        else if (!value) setInputValue("")
    }, [value])

    useEffect(() => {
        isPickerOpenRef.current = isPickerOpen
        if (isPickerOpen) {
            let prevRect = inputFieldRef.current.getBoundingClientRect();

            const checkPosition = () => {
                const rect = inputFieldRef.current.getBoundingClientRect();
                if (rect.top !== prevRect.top || rect.left !== prevRect.left) {
                    inputFieldRef.current.dispatchEvent(new Event('positionChanged'));
                    prevRect = rect;
                }
                isPickerOpenRef.current && requestAnimationFrame(checkPosition);
            };

            requestAnimationFrame(checkPosition);
        }
    }, [isPickerOpen])

    const handleClose = () => {
        setIsPickerOpen(false);
        if (onBlur instanceof Function) onBlur()
    }

    function generateDaysInMonth(year, month) {
        const daysInMonth = moment().set({ year: year, month: parseInt(month) - 1, date: 1 }).endOf('month').date(); // Get total days in the month
        const firstDayOfMonth = moment().set({ year: year, month: parseInt(month) - 1, date: 1 }).day(); // Get the day of the week for the first day of the month
        const daysArray = [];

        // Add empty spots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push(i);
        }

        return daysArray;
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
    };

    const handleDateChange = (year, month, day, hidePicker = false, changeInputValue = false) => {
        let newDate = `${year}-${month.toString().padStart(2, "0")}`;
        if (day) newDate = newDate + `-${day.toString().padStart(2, "0")}`

        if (maxDate && new Date(newDate) > maxDate) {
            return;
        }
        if (minDate && new Date(newDate) <= minDate) {
            return;
        }

        setDate(newDate);

        if (changeInputValue) updateSelectedValue(newDate, time);

        if (hidePicker) {
            updateSelectedValue(newDate, time);
            if (!isTimeShow) handleClose();
        }
    };

    const getDayClass = (_year, _month, _day) => {
        let newDate = `${year}-${month.toString().padStart(2, "0")}`;
        if (_day) newDate = newDate + `-${_day.toString().padStart(2, "0")}`

        if (maxDate && new Date(newDate) > maxDate) {
            return 'disabled';
        }
        if (minDate && new Date(newDate) < minDate) {
            return 'disabled';
        }

        if (_day === parseInt(day) && selectedMonth === month && selectedYear === year)
            return "selected"

        if (_day === new Date().getDate() && _month == (new Date().getMonth() + 1) && _year == new Date().getFullYear())
            return 'today'

        return ""
    }

    const handleTimeChange = (newTime) => {
        if (minTime && moment(newTime, "HH:mm").isBefore(moment(minTime, "HH:mm"))) {
            return;
        }
        if (maxTime && moment(newTime, "HH:mm").isAfter(moment(maxTime, "HH:mm"))) {
            return;
        }

        setTime(newTime);
        updateSelectedValue(date, newTime);
        handleClose();
    };

    const updateSelectedValue = (newDate, newTime) => {
        const formattedValue = moment(`${newDate}T${newTime}`).format("YYYY/MM/DD HH:mm");
        let formattedInputValue;

        if (inputFormat === "##/##/####") {
            formattedInputValue = moment(`${newDate}T${newTime}`).format("YYYY/MM/DD");
        } else {
            formattedInputValue = formattedValue;
        }

        setInputValue(formattedInputValue);
        if (onChange instanceof Function) onChange(formattedValue);
    };

    const handleInputChange = () => {
        if (!fieldValue) return
        const { formattedValue } = fieldValue;
        const newValue = formattedValue;

        let dateTime;
        // Determine the format based on input value
        if (inputFormat == "##/##/####") {
            // Date only format
            dateTime = moment(newValue, "DD/MM/YYYY", true);
        } else {
            // Check for date/time format
            dateTime = moment(newValue, "DD/MM/YYYY HH:mm", true);
        }

        if (dateTime.isValid()) {
            const formattedDate = dateTime.format("YYYY-MM-DD");
            const formattedTime = dateTime.format("HH:mm");

            if ((maxDate && dateTime.isAfter(maxDate)) ||
                (minDate && dateTime.isBefore(minDate)) ||
                (minTime && formattedTime < minTime) ||
                (maxTime && formattedTime > maxTime)) {
                return;
            }

            // Update state based on the format
            if (inputFormat == "##/##/####") {
                setDate(formattedDate);
                setSelectedDate(formattedDate)
                updateSelectedValue(formattedDate, time);
            }
            else {
                setTime(formattedTime);
                setDate(formattedDate);
                setSelectedDate(formattedDate)
                updateSelectedValue(formattedDate, formattedTime);
            }

        } else {
            if (onChange instanceof Function) onChange('');
            setInputValue('')
        }
        setFieldValue(null)
        if (onBlur instanceof Function) onBlur()
    };

    const [year, month, day] = date.split("-");
    const [selectedYear, selectedMonth] = selectedDate.split("-");

    const daysArray = generateDaysInMonth(year, month);
    const timeSlots = generateTimeSlots();

    const calculatePosition = () => {
        const inputFieldRect = inputFieldRef.current.getBoundingClientRect(); // Get button's position and size
        const containerRect = containerRef.current.getBoundingClientRect(); // Get button's position and size
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = customElement ? inputFieldRect.bottom : inputFieldRect.bottom - 20, left = inputFieldRect.left;
        let _horizontalPosition, _verticlePosition;

        // Determine the best position based on available space
        if (inputFieldRect.bottom + containerRect.height > viewportHeight) {
            _horizontalPosition = 'top'
        } else if (top + containerRect.height < viewportHeight) {
            _horizontalPosition = 'down'
        } else {
            _horizontalPosition = 'down'
        }

        if (inputFieldRect.right + containerRect.width > viewportWidth) {
            _verticlePosition = 'left'
        } else if (left + containerRect.width < viewportWidth) {
            _verticlePosition = 'right'
        } else {
            _verticlePosition = 'right'
        }

        if (_horizontalPosition === 'top') {
            top = inputFieldRect.top - containerRect.height
        }

        if (_verticlePosition === 'left') {
            left = inputFieldRect.right - containerRect.width
        }

        setContainerPosition({
            ...(top && { top: top + 'px' }),
            ...((left) && { left: left + 'px' }),
        })
    };

    const navigateMonth = (direction) => {
        const currentMonth = parseInt(month);
        const currentYear = parseInt(year);

        if (direction === 'forward') {
            if (currentMonth === 12) {
                handleDateChange(currentYear + 1, '01', day, false, false);
            } else {
                handleDateChange(year, currentMonth + 1, day, false, false);
            }
        } else if (direction === 'backward') {
            if (currentMonth === 1) {
                handleDateChange(currentYear - 1, '12', day, false, false);
            } else {
                handleDateChange(year, currentMonth - 1, day, false, false);
            }
        }
    };

    return (
        <div className="fu-input-wrap w-100" ref={pickerRef}>
            {customElement
                ? <div className="d-inline-block" ref={inputFieldRef} onClick={() => setIsPickerOpen(old => !old)}>
                    {customElement}
                </div>
                : <div className="fu-input-group" ref={inputFieldRef}>
                    <PatternFormat
                        className='fu-input post-btn'
                        format={inputFormat}
                        mask="_"
                        value={inputValue}
                        onValueChange={(value) => { setFieldValue(value) }}
                        onBlur={handleInputChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        key={inputValue}
                        getInputRef={patternFieldRef}
                        onClick={() => setIsPickerOpen(true)}
                    />
                    <button className='fu-input-btn input-post-btn' type="button" onClick={() => setIsPickerOpen(!isPickerOpen)} disabled={disabled}>
                        <i className={`fu-icon icon-size-18 ph ph-calendar  ${isPickerOpen ? ' ' : ' text-placeholder'}`}></i>
                    </button>
                    <label className="fu-label">{label}</label>
                </div>
            }
            {isPickerOpen && (
                <div className="picker-container" ref={containerRef} style={containerPosition}>
                    <div className='picker'>
                        <div className="calendar-picker">
                            <div className="calendar-header">
                                <button className="" type="button" onClick={() => navigateMonth("backward")}><i className="ph ph-less-than" /></button>
                                <Select
                                    value={{ label: year || new Date().getFullYear(), value: year || new Date().getFullYear() }}
                                    onChange={(selectedOption) =>
                                        handleDateChange(selectedOption.value, month || "01", day || "01")
                                    }
                                    isDisabled={disabled}
                                    options={generateYears()}
                                    isSearchable={false}
                                />
                                <Select
                                    value={{ label: months.find(el => el.value == month).label || 1, value: parseInt(month) || 1 }}
                                    onChange={(selectedOption) =>
                                        handleDateChange(year, selectedOption.value, day || "01")
                                    }
                                    isDisabled={disabled}
                                    options={months}
                                    isSearchable={false}
                                />
                                <button className="" type="button" onClick={() => navigateMonth("forward")}><i className="ph ph-greater-than" /></button>
                                <button type="button" onClick={() => handleDateChange(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), true)}>Today</button>
                            </div>
                            <div className="calendar-grid">
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                                    <div key={d} className="calendar-day-header">
                                        {d}
                                    </div>
                                ))}
                                {daysArray.map((d, i) => (
                                    <div
                                        key={"daysArray" + i}
                                        className={`calendar-day ${getDayClass(year, month, d)}`}
                                        onClick={() => d && handleDateChange(year, month, d, true)}
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    {isTimeShow && (
                        <div className="picker p-0">
                            {time && <div className={`time-select overview`}>
                                {time}
                            </div>}
                            <div className="time-picker time fu-scroll-body">
                                {timeSlots.map((slot) => (
                                    <div key={slot} onClick={() => handleTimeChange(slot)} className={`time-select ${time === slot ? 'selected' : ''}`}>
                                        {slot}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomDateTimePicker;
