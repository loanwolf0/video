import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
    children,
    message,
    position = 'top',
}) => {
    const [visible, setVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({});

    const [arrowPosition, setArrowPosition] = useState(position);
    const targetRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (visible) {
            calculatePosition();
        }
    }, [visible]);

    const calculatePosition = () => {
        let newPosition = {};

        const targetRect = targetRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        const tooltipWidth = tooltipRef.current.offsetWidth;

        const targetCenterX = (targetRect.left + targetRect.right) / 2;
        const tooltipLeft = targetCenterX - (tooltipWidth / 2);
        switch (position) {
            case 'top':
                newPosition = {
                    top: targetRect.top - 44,
                    left: tooltipLeft
                };
                break;
            case 'right':
                newPosition = {
                    left: targetRect.right + 10,
                    top: targetRect.top - 10
                };

                if (newPosition.left + tooltipWidth > window.innerWidth) {
                    newPosition = {
                        left: tooltipLeft,
                        top: targetRect.bottom + 15,
                    };
                    setArrowPosition('bottom')
                }
                break;
            case 'bottom':
                newPosition = {
                    left: tooltipLeft,
                    top: targetRect.bottom + 15,
                };
                break;
            case 'left':
                newPosition = {
                    left: targetRect.left - (tooltipWidth + 10),
                    top: targetRect.top,
                };
                if (newPosition.left < 0) {
                    newPosition = {
                        left: tooltipLeft,
                        top: targetRect.bottom + 15,
                    };
                    setArrowPosition('bottom')
                }
                break;
            default:
                break;
        }
        setTooltipPosition(newPosition);
    };

    const showTooltip = () => {
        setVisible(true);
    };

    const hideTooltip = () => setVisible(true);

    return (
        <div className={`tooltip-container`}
            ref={targetRef}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            <div className="tooltip-box" style={{ left: `${tooltipPosition.left}px`, top: `${tooltipPosition.top}px` }} ref={tooltipRef}>
                {message}
                <div className={'up-arrow ' + arrowPosition}>
                </div>

            </div>
        </div>
    );
};

export default Tooltip;
