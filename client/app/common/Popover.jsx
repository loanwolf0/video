import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import OutsideClickHandler from './OutsideClickHandler';

const Popover = ({
    toggle,
    toggleClassName,
    children,
    closeOnOutsideClick,
    closeOnClick,
    contentClassName,
    position = 'left', // top, bottom, left, right
}) => {

    const [isShow, setIsShow] = useState(false);
    const popoverButtonRef = useRef(null)

    const popoverContainerRef = useRef(null)
    const [containerPosition, setContainerPosition] = useState({})

    const isShowRef = useRef(false)

    useLayoutEffect(() => {
        if (isShow) calculatePosition();
    }, [isShow]);

    useEffect(() => {
        popoverButtonRef.current?.addEventListener('positionChanged', handleClose);
        window.addEventListener('blur', handleClose);

        return () => {
            popoverButtonRef.current?.removeEventListener('positionChanged', handleClose, false);
            window.removeEventListener('blur', handleClose, false);
        }
    }, [])

    useEffect(() => {
        isShowRef.current = isShow
        if (isShow) {
            let prevRect = popoverButtonRef.current.getBoundingClientRect();
            let prevContainerRect = popoverContainerRef.current.getBoundingClientRect();

            const checkPosition = () => {
                const rect = popoverButtonRef.current.getBoundingClientRect();
                if ((rect.top !== prevRect.top || rect.left !== prevRect.left)) {
                    popoverButtonRef.current.dispatchEvent(new Event('positionChanged'));
                    prevRect = rect;
                }
                if (popoverContainerRef.current) {
                    const containerRect = popoverContainerRef.current.getBoundingClientRect();
                    if (containerRect.top !== prevContainerRect.top || containerRect.left !== prevContainerRect.left) calculatePosition();
                }
                isShowRef.current && requestAnimationFrame(checkPosition);
            };

            requestAnimationFrame(checkPosition);
        }
    }, [isShow])

    const handleClose = () => setIsShow(false);

    const calculatePosition = () => {
        let newPosition = {};

        const popoverButtonRect = popoverButtonRef.current.getBoundingClientRect();

        const popoverContainerWidth = popoverContainerRef.current.offsetWidth;
        const popoverContainerHeight = popoverContainerRef.current.offsetHeight;

        const popoverButtonHeight = popoverButtonRef.current.offsetHeight;
        const popoverButtonWidth = popoverButtonRef.current.offsetWidth;

        switch (position) {
            case 'top':
                newPosition = {
                    top: popoverButtonRect.top - popoverContainerHeight,
                    left: (popoverButtonRect.left + popoverButtonWidth / 2) - (popoverContainerWidth / 2)
                };
                break;
            case 'right':
                newPosition = {
                    left: popoverButtonRect.right + 10,
                    top: (popoverButtonRect.top + (popoverButtonHeight / 2)) - (Math.floor(popoverContainerHeight / 2))
                };

                if (newPosition.left + popoverContainerWidth > window.innerWidth) {
                    newPosition = {
                        top: popoverButtonRect.bottom + 15,
                        left: (popoverButtonRect.left + popoverButtonWidth / 2) - (popoverContainerWidth / 2),
                    };
                    if (newPosition.top + popoverContainerHeight > window.innerHeight) {
                        newPosition = {
                            top: popoverButtonRect.top - popoverContainerHeight,
                            left: (popoverButtonRect.left + popoverButtonWidth / 2) - (popoverContainerWidth / 2)
                        };
                        if (newPosition.top < 0) {
                            newPosition = {
                                left: popoverButtonRect.left - (popoverContainerWidth + 10),
                                top: (popoverButtonRect.top + (popoverButtonHeight / 2)) - (Math.floor(popoverContainerHeight / 2))
                            };
                        }
                    }
                }
                break;
            case 'bottom':
                newPosition = {
                    left: (popoverButtonRect.left + popoverButtonWidth / 2) - (popoverContainerWidth / 2),
                    top: popoverButtonRect.bottom + 15,
                };
                break;
            case 'left':
                newPosition = {
                    left: popoverButtonRect.left - (popoverContainerWidth + 10),
                    top: (popoverButtonRect.top + (popoverButtonHeight / 2)) - (Math.floor(popoverContainerHeight / 2))
                };

                if (newPosition.left < 0) {
                    newPosition = {
                        left: (popoverButtonRect.left + popoverButtonWidth / 2) - (popoverContainerWidth / 2),
                        top: popoverButtonRect.bottom + 15,
                    };

                    if (newPosition.top + popoverContainerHeight > window.innerHeight) {
                        newPosition = {
                            top: popoverButtonRect.top - popoverContainerHeight,
                            left: (popoverButtonRect.left + popoverButtonWidth / 2) - (popoverContainerWidth / 2)
                        };

                        if (newPosition.top < 0) {
                            newPosition = {
                                left: popoverButtonRect.right + 10,
                                top: (popoverButtonRect.top + (popoverButtonHeight / 2)) - (Math.floor(popoverContainerHeight / 2))
                            };
                        }
                    }
                }
                break;
            case 'notification':
                newPosition = {
                    left: popoverButtonRect.left - popoverContainerWidth,
                    top: popoverButtonRect.bottom
                };
                break;
            default:
                break;
        }
        setContainerPosition(newPosition);
    };

    return (
        <div className='popover'>
            <div className={toggleClassName} onClick={() => setIsShow(old => !old)} ref={popoverButtonRef}>{toggle}</div>
            {isShow && <OutsideClickHandler callback={() => { closeOnOutsideClick && setIsShow(false) }}>
                <div ref={popoverContainerRef} className={`popover-content ${contentClassName}`} style={{ left: `${containerPosition.left}px`, top: `${containerPosition.top}px` }} onClick={() => { closeOnClick && setIsShow(false) }}>{children}</div>
            </OutsideClickHandler>}
        </div>
    )
}

export default Popover
