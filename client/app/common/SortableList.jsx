import React, { useEffect, useRef, useState } from 'react'

const CustomTag = ({ tag, children, ...props }) => React.createElement(tag, props, children)

export const arrayMove = (array, from, to) => {
    array = array.slice();
    array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
    return array;
}

const SortableList = ({
    list,
    onChange,
    renderList = ({ props, children }) => <div {...props}>{children}</div>,
    renderItem = () => null,
    tag = 'div',
    itemKey = (item) => item.key,
    renderCondition = (item) => true,
    className = '',
}) => {

    const [draggedRowIndex, setDraggedRowIndex] = useState(null);
    const [items, setItems] = useState([]);
    const [containerTop, setContainerTop] = useState(0);

    const moveFrom = useRef(null);
    const moveTo = useRef(null);
    const touchStartY = useRef(null);
    const listRef = useRef(null)

    useEffect(() => {
        setItems(list)
    }, [list])

    useEffect(() => {
        if (listRef) {
            updateContainerTop();
        }
    }, [listRef])


    /*************************************Functions************************************ */
    const handleDragStart = (e, index) => {
        moveFrom.current = index
        setDraggedRowIndex(index);
        if (!listRef.current) return;

        const container = listRef.current;
        const { top, bottom, left, right } = container.getBoundingClientRect();
        const scrollSpeed = 5; // Adjust scroll speed as needed

        // Vertical Scrolling
        if ((e.clientY || e.touches[0].clientY) < top + 50) {
            container.scrollTop -= scrollSpeed; // Scroll up if near the top
        } else if ((e.clientY || e.touches[0].clientY) > bottom - 50) {
            container.scrollTop += scrollSpeed; // Scroll down if near the bottom
        }

        // Horizontal Scrolling
        if ((e.clientX || e.touches[0].clientX) < left + 50) {
            container.scrollLeft -= scrollSpeed; // Scroll left if near the left edge
        } else if ((e.clientX || e.touches[0].clientX) > right - 50) {
            container.scrollLeft += scrollSpeed; // Scroll right if near the right edge
        }
    };

    const handleDragOver = (e, index) => {

        if (draggedRowIndex !== index) {
            moveTo.current = index
            const newRows = [...items];
            const [draggedRow] = newRows.splice(draggedRowIndex, 1);
            newRows.splice(index, 0, draggedRow);
            setItems(newRows);
            setDraggedRowIndex(index);
        }
    };

    const handleDragEnd = () => {
        if (onChange instanceof Function && moveFrom.current!==null && moveTo.current!==null) onChange(moveFrom.current, moveTo.current)
        setDraggedRowIndex(null);
        moveFrom.current = null;
        moveTo.current = null;
    };

    const handleTouchStart = (e, index) => {
        touchStartY.current = e.touches[0].clientY;
        handleDragStart(e, index);
    };

    const handleTouchMove = (e, index) => {
        const touchCurrentY = e.touches[0].clientY;

        // Assuming items are sorted in a way where the position can be calculated
        const itemHeight = listRef.current.childNodes[index].clientHeight || 50// Estimate item height, or calculate based on your layout
        const newIndex = Math.max(0, Math.min(items.length - 1, Math.floor((touchCurrentY - containerTop) / itemHeight)));

        handleDragOver(e, newIndex);
    }

    const handleTouchEnd = (e, index) => {
        if (index !== draggedRowIndex) {
            handleDragEnd();
        }
    }

    const updateContainerTop = () => {
        if (listRef.current) {
            const rect = listRef.current.getBoundingClientRect();
            setContainerTop(rect.top + window.scrollY);
        }
    }

    return (
        renderList({
            props: {
                ref: listRef
            },
            children: <>{items.map((item, index) =>
                renderCondition(item)
                    ? <CustomTag
                        tag={tag}
                        key={itemKey(item)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchMove={(e) => handleTouchMove(e, index)}
                        onTouchEnd={(e) => handleTouchEnd(e, index)}
                        className={`${className} ${draggedRowIndex === index ? '' : 'dragable'}`}
                    >
                        {renderItem(item, index)}
                    </CustomTag>
                    : <React.Fragment key={itemKey(item)}></React.Fragment>
            )}</>
        })
    )
}

export default SortableList