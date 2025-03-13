import React, { useEffect, useRef } from 'react'

const OutsideClickHandler = ({ children, callback }) => {
    const ref = useRef(null);

    function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target) && callback) callback();
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <div ref={ref}>{children}</div>
    )
}

export default OutsideClickHandler
