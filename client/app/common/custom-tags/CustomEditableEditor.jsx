import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDebounce } from '../../../hooks/debounce'
import Tribute from "tributejs";

const CustomEditableEditor = ({
    value,
    placeholder = '',
    isDisabled = false,
    preventEnter,
    onChange,
    onBlur,
    labels = [],
    getInputRef,
}, ref) => {

    const [selection, setSelection] = useState(null)
    const [range, setRange] = useState(null)
    const [parentNode, setParentNode] = useState(null)

    const editorRef = useRef(null);

    const tribute = new Tribute({
        trigger: '@',
        values: labels.flatMap(category => {
            const fields = [
                { key: category.name, isCategory: true },
                ...category.fields.map(field => ({
                    key: field.name,
                    value: field.value,
                }))
            ];

            return fields
        }),
        noMatchTemplate: () => '<li>No match found</li>',
        menuItemTemplate: (item) => {
            if (item.original.isCategory) return `<div class="category">${item.original.key}</div>`;
            return `<div class="item">${item.original.key}</div>`;
        },
        containerClass: 'fu-tribute',
        selectTemplate: function (item) {
            if (item.original.isCategory) return null;
            return `<span spellcheck="false" contentEditable="false">${item.original.key}</span>`;
        },
    });

    useImperativeHandle(ref, () => ({
        insertField: handleFieldInsert
    }))

    useEffect(() => {
        if (labels.length) tribute.attach(editorRef.current);
        if (getInputRef instanceof Function) getInputRef(editorRef.current)
    }, [])

    useEffect(() => {
        if (value && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value ?? ''
        }
    }, [value])

    useEffect(() => {
        editorRef.current.contentEditable = !isDisabled;
    }, [isDisabled])

    const handleFieldInsert = (text) => {
        const span = document.createElement('span');
        span.spellcheck = false;
        span.innerHTML = text;
        span.contentEditable = false;
        const node = document.createTextNode('\u00A0');

        if (parentNode === editorRef.current || parentNode === editorRef.current.parentNode) {
            range.deleteContents();
            range.insertNode(node);
            range.insertNode(span);
            //cursor at the last with this
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            editorRef.current.appendChild(span);
            editorRef.current.appendChild(node);
        }
    }

    const handlePaste = (event) => {
        event.preventDefault()
        let text = event.clipboardData.getData('text/plain').replace(/\u00A0/g, " ");
        if (preventEnter) text = text.replace(/(?:\r\n|\r|\n)/g, ' ')

        range.deleteContents()
        // Insert the text at the caret's position
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move the caret to the end of the inserted text
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const handleDrop = (event) => {
        event.preventDefault()
        editorRef.current.focus()
        let text = event.dataTransfer.getData('text/html') || event.dataTransfer.getData('text/plain');
        if (preventEnter) text = text.replace(/(?:\r\n|\r|\n)/g, ' ')

        range.deleteContents()
        // Insert the text at the caret's position
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move the caret to the end of the inserted text
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const handleCaretPosition = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        setSelection(selection);
        setRange(range);
        setParentNode(range.commonAncestorContainer.parentNode);
    }

    const keyPressDebounce = useDebounce(handleCaretPosition, 100)

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();

            const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        if (preventEnter && (event.key === 'Enter')) {
            event.preventDefault();
            return
        }
        keyPressDebounce()
    }

    const handleFocus = () => {
        if (!range) return
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const handleChange = (event) => {
        if (editorRef.current.innerHTML === '<br>' || editorRef.current.innerHTML === '<div><br></div>') {
            editorRef.current.innerHTML = '';
        }
        if (onChange instanceof Function) onChange(event)
    }

    const handleBlur = (event) => {
        if (onBlur instanceof Function) onBlur(event)
    }

    return (
        <div
            ref={editorRef}
            className={`fu-editable-div ${preventEnter ? 'input' : 'textarea'}`}
            contentEditable={!isDisabled}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            onClick={isDisabled ? null : handleCaretPosition}
            onFocus={handleFocus}
            onInput={handleChange}
            data-placeholder={placeholder}
            onBlur={handleBlur}
        />
    )
}

export default forwardRef(CustomEditableEditor)