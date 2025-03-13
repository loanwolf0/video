import React, { useEffect, useRef, useState } from 'react'
import LeksyEditor, { isHTMLEmpty } from '../../../utils/leksy-editor';
import axios from 'axios';

const CustomLeksyEditor = ({
  type,
  labels,
  placeholder,
  value,
  onChange,
  onBlur,
  onAttachment,
  getInputRef,
}) => {

  const [editorValue, setEditorValue] = useState(value ?? '')
  const editorRef = useRef(null)
  const editor = useRef(null)

  useEffect(() => {

    let plugins = []

    switch (type) {
      case 'notes':
        plugins = [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike'],
          ['ordered_list', 'unordered_list'],
        ]
        break;
      case 'email':
        plugins = [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike'],
          ['font', 'font-size'],
          ['subscript', 'superscript'],
          ['font_color', 'highlight_color'],
          ['align_justify', 'align_left', 'align_center', 'align_right'],
          ['ordered_list', 'unordered_list'],
          ['image', 'video', 'table', 'attachment'],
          ['link', 'unlink'],
          ['format-block', 'text_style', 'line_height', 'paragraph_style'],
          ['indent', 'outdent', 'horizontal_rule', 'remove_format'],
          ['pexels', 'giphy', 'emoji', 'special_character', 'mention'],
          ['cut', 'copy', 'paste', 'select_all'],
          'fullscreen', 'code_view', 'print'
        ]
        break;
      case 'email-signature':
        plugins = [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike'],
          ['font', 'font-size'],
          ['subscript', 'superscript'],
          ['font_color', 'highlight_color'],
          ['align_justify', 'align_left', 'align_center', 'align_right'],
          ['ordered_list', 'unordered_list'],
          ['image', 'video', 'table'],
          ['link', 'unlink'],
          ['format-block', 'text_style', 'line_height', 'paragraph_style'],
          ['indent', 'outdent', 'horizontal_rule', 'remove_format'],
          ['pexels', 'giphy', 'emoji', 'special_character'],
          ['cut', 'copy', 'paste', 'select_all'],
          'fullscreen', 'code_view'
        ]
        break;
      case 'workspace-task':
        plugins = [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike'],
          ['ordered_list', 'unordered_list'],
          ['image', 'video', 'table', 'attachment'],
          ['link', 'unlink'],
          ['emoji']
        ]
        break;
      case 'todo-notes':
        plugins = [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike'],
          ['ordered_list', 'unordered_list'],
          ['image', 'video', 'table', 'attachment'],
        ]
        break;
    }

    editor.current = LeksyEditor.create(editorRef.current, {
      plugins,
      labels,
      placeholder,
      value: editorValue,
      hideNavigation: ["notes", "workspace-task"].includes(type),
      giphyApiKey: import.meta.env.APP_GIPHY_KEY,
      pexelsApiKey: import.meta.env.APP_PEXELS_KEY,
      // closePluginOnClick: false,
    })
    editor.current.onChange = (html) => {
      if (isHTMLEmpty(html)) html = ''
      setEditorValue(html)
      if (onChange instanceof Function) onChange(html)
    }
    editor.current.onBlur = (html) => {
      if (onBlur instanceof Function) onBlur(html)
    }
    editor.current.onAttachment = (files) => {
      if (onAttachment instanceof Function) onAttachment(files)
    }
    editor.current.manuplateImage = async (type, content) => {
      try {
        if (type === 'base64') {
          const response = await axios({
            url: '/api/common/editor/image',
            method: 'POST',
            data: {
              base64: content
            }
          });
          return response.data.url
        }
      } catch (error) {
        console.error(error)
      }
      return content
    }
    editor.current.uploadVideo = async (file) => {
      try {
        const formData = new FormData()
        formData.append('video', file)
        const response = await axios({
          url: '/api/common/editor/video',
          method: 'POST',
          data: formData,
          headers: { "Content-Type": 'multipart/form-data' }
        });
        return response.data
      } catch (error) {
        console.error(error)
      }
    }

    getInputRef instanceof Function && getInputRef(editor.current)
  }, [])

  useEffect(() => {
    if (editorValue === value) return
    setEditorValue(value ?? '')
    editor.current.setContents(value ?? '')
  }, [value])

  return (
    <div ref={editorRef} />
  )
}

export default CustomLeksyEditor;
