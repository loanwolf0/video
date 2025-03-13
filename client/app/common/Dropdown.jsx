import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import OutsideClickHandler from './OutsideClickHandler'

const DropdownContainer = ({
    children,
    toggle,
    closeOnClick,
    horizontalPosition = 'down',
    verticlePosition = 'right',
    disabledDynamicPosition,
    showOnHover,
    draggable = false,
    onTouchStart,
    onClick,
    onDragStart,
}) => {

    const [isShow, setIsShow] = useState(false)
    const dropdownRef = useRef(null)
    const dropdownContentRef = useRef(null)
    const [dropdownPosition, setDropdownPosition] = useState({})

    const isShowRef = useRef(false)

    useEffect(() => {
        dropdownRef.current?.addEventListener('positionChanged', handleClose);
        window.addEventListener('blur', handleClose);

        return () => {
            dropdownRef.current?.removeEventListener('positionChanged', handleClose, false);
            window.removeEventListener('blur', handleClose, false);
        }
    }, [])

    useEffect(() => {
        isShowRef.current = isShow
        if (isShow) {
            let prevRect = dropdownRef.current.getBoundingClientRect();

            const checkPosition = () => {
                if (!dropdownRef.current) return; // Add this check

                const rect = dropdownRef.current.getBoundingClientRect();
                if (rect.top !== prevRect.top || rect.left !== prevRect.left) {
                    dropdownRef.current.dispatchEvent(new Event('positionChanged'));
                    prevRect = rect;
                }
                isShowRef.current && requestAnimationFrame(checkPosition);
            };

            requestAnimationFrame(checkPosition);
        }
    }, [isShow])

    useLayoutEffect(() => {
        if (isShow) calculatePosition();
    }, [isShow]);

    const handleClose = () => setIsShow(false);
    const handleToggle = () => setIsShow(old => !old);

    const handleOpenOnHover = () => showOnHover && setIsShow(true);
    const handleCloseOnHover = () => showOnHover && setIsShow(false);

    const handleCloseOnClick = () => closeOnClick && setIsShow(false);

    const calculatePosition = () => {

        const dropdownRect = dropdownRef.current.getBoundingClientRect(); // Get button's position and size
        const dropdownContentRect = dropdownContentRef.current.getBoundingClientRect(); // Get button's position and size
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = dropdownRect.bottom, left = dropdownRect.left;
        let _horizontalPosition = horizontalPosition, _verticlePosition = verticlePosition

        if (!disabledDynamicPosition) {
            // Determine the best position based on available space
            if (dropdownRect.bottom + dropdownContentRect.height > viewportHeight) {
                _horizontalPosition = 'top'
            } else if (top + dropdownContentRect.height < viewportHeight) {
                _horizontalPosition = 'down'
            } else {
                _horizontalPosition = 'down'
            }

            if (dropdownRect.right + dropdownContentRect.width > viewportWidth) {
                _verticlePosition = 'left'
            } else if (left + dropdownContentRect.width < viewportWidth) {
                _verticlePosition = 'right'
            } else {
                _verticlePosition = 'right'
            }
        }

        if (_horizontalPosition === 'top') {
            top = dropdownRect.top - dropdownContentRect.height
        }

        if (_verticlePosition === 'left') {
            left = dropdownRect.right - dropdownContentRect.width
        }

        setDropdownPosition({
            ...(top && { top: top + 'px' }),
            ...(left && { left: left + 'px' }),
        })
    };

    const handleOnDragStart = (e) => {
        if (onDragStart instanceof Function) onDragStart(e)
    }

    const handleOnTouchStart = (e) => {
        if (onTouchStart instanceof Function) onTouchStart(e)
    }

    const handleOnClick = (e) => {
        if (onClick instanceof Function) onClick(e)
    }

    return (
        <OutsideClickHandler callback={handleClose}>
            <div
                ref={dropdownRef}
                className='dropdown'
                draggable={draggable}
                onMouseEnter={handleOpenOnHover}
                onMouseLeave={handleCloseOnHover}
                onDragStart={handleOnDragStart}
                onTouchStart={handleOnTouchStart}
                onClick={handleOnClick}
            >
                <button type='button' className='dropdown-button' onClick={handleToggle} >
                    {toggle}
                </button>
                {isShow && <div ref={dropdownContentRef} className={`dropdown-content`} style={dropdownPosition} onClick={handleCloseOnClick}>
                    {children}
                </div>}
            </div>
        </OutsideClickHandler>
    )
}

const DropdownItem = ({ children, onClick }) => {

    const handleOnClick = () => {
        if (onClick instanceof Function) onClick()
    }

    return (
        <div className='dropdown-item' onClick={handleOnClick}>{children}</div>
    )
}

const Dropdown = {
    Container: DropdownContainer,
    Item: DropdownItem,
}
export default Dropdown