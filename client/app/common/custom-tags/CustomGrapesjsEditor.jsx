import React, { useEffect, useRef, useState } from 'react'
import grapesjs from 'grapesjs';
import newsLetterPlugin from 'grapesjs-preset-newsletter';
import 'grapesjs/dist/css/grapes.min.css';

import axios from 'axios'
import Modal from '../Modal';
import { getSubdomain } from '../../../utils/authentication.util';

const blockplugin = (editor) => {
    editor.BlockManager.add("Paragraph", {
        label: "Paragraph",
        content: `
            <p style="padding: 8px"> 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam metus libero, tincidunt eget nunc et, finibus euismod lacus. Proin vel lectus at ipsum vulputate feugiat. Nulla luctus viverra consectetur. Nulla fringilla semper sem et mattis. Morbi dapibus, ex iaculis molestie ultricies, nibh ante tincidunt ipsum, nec mollis tellus felis id augue. Integer maximus commodo velit eget porttitor. Cras vitae tellus nisi. Etiam tempus dui nec sapien placerat, a tincidunt lectus semper. Donec id bibendum velit. Mauris ante magna, hendrerit quis scelerisque in, fermentum nec orci. Nullam ac pretium tortor. Proin felis orci, auctor ac accumsan et, fermentum eu ante. Pellentesque imperdiet commodo quam, non varius enim condimentum ac. Maecenas vehicula nec ipsum nec dictum. Proin ornare elementum enim eu consequat. Aenean id tellus augue.
            </p>
        `,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-align-justify grapesjs-icon",
        },
    });

    editor.BlockManager.add("Heading1", {
        label: "Heading 1",
        content: `<h1>Insert your text here</h1>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-h-one grapesjs-icon",
        },
    });

    editor.BlockManager.add("Heading2", {
        label: "Heading 2",
        content: `<h2>Insert your text here</h2>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-h-two grapesjs-icon",
        },
    });

    editor.BlockManager.add("Heading3", {
        label: "Heading 3",
        content: `<h3>Insert your text here</h3>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-h-three grapesjs-icon",
        },
    });

    editor.BlockManager.add("Heading4", {
        label: "Heading 4",
        content: `<h4>Insert your text here</h4>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-h-four grapesjs-icon",
        },
    });

    editor.BlockManager.add("Heading5", {
        label: "Heading 5",
        content: `<h5>Insert your text here</h5>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-h-five grapesjs-icon",
        },
    });

    editor.BlockManager.add("Heading6", {
        label: "Heading 6",
        content: `<h6>Insert your text here</h6>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-text-h-six grapesjs-icon",
        },
    });

    editor.BlockManager.add("Divider", {
        label: "Divider",
        content: `<div style="border: 1px solid black; margin: 2px 8px"></div>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-minus grapesjs-icon",
        },
    });

    editor.BlockManager.add("Spacer", {
        label: "Spacer",
        content: `<div style="padding: 16px"></div>`,
        select: true,
        editable: true,
        attributes: {
            class: "ph ph-align-center-horizontal-simple grapesjs-icon",
        },
    });
}

const additionalPlugin = (editor) => {
    const logo = `${import.meta.env.APP_S3_PUBLIC_URL}${import.meta.env.APP_ENV}/assets/${getSubdomain()}/logo/large`
    editor.BlockManager.add("CompanyLogo", {
        label: "Company Logo",
        content: `<img src="${logo}" alt="logo"/>`,
        select: true,
        editable: true,
        attributes: {
            class: 'ph ph-image grapesjs-icon'
        }
    });
    editor.BlockManager.add("MySignature", {
        label: "My Signature",
        content: `<img src="${import.meta.env.APP_BASE_URL}/images/signature/my-signature.png" alt="signature"/>`,
        select: true,
        editable: true,
        attributes: {
            class: 'ph ph-signature grapesjs-icon'
        }
    });
    editor.BlockManager.add("CompanySignature", {
        label: "Company Signature",
        content: `<img src="${import.meta.env.APP_BASE_URL}/images/signature/company-signature.png" alt="signature"/>`,
        select: true,
        editable: true,
        attributes: {
            class: 'ph ph-signature grapesjs-icon'
        }
    });
}

const addPanelButtons = (editor) => {
    editor.Panels.getButton('options', 'undo').attributes.attributes.title = 'Undo'
    editor.Panels.getButton('options', 'redo').attributes.attributes.title = 'Redo'
    editor.Panels.getButton('options', "canvas-clear").attributes.attributes.title = 'Clear'
    editor.Panels.getButton('options', "gjs-toggle-images").attributes.attributes.title = 'Toggle Image'
    editor.Panels.getButton('options', "gjs-open-import-template").attributes.attributes.title = 'Import'
    editor.Panels.getButton('options', "export-template").attributes.attributes.title = 'Export'
    editor.Panels.removePanel("devices-c")

    editor.Panels.addButton("options", [
        {
            id: "zoom-in",
            className: "ph ph-magnifying-glass-plus",
            attributes: { title: "Zoom in" },
            command(editor) {
                const zoom = editor.Canvas.getZoom();
                if (zoom < 150) {
                    editor.Canvas.setZoom(zoom + 10);
                    editor.refresh();
                }
            },
        },
        {
            id: "zoom-out",
            className: "ph ph-magnifying-glass-minus",
            attributes: { title: "Zoom out" },
            command(editor) {
                const zoom = editor.Canvas.getZoom();
                if (zoom > 21) {
                    editor.Canvas.setZoom(zoom - 10);
                    editor.refresh();
                }
            },
        },
    ]);
}

const CustomGrapesjsEditor = ({
    labels,
    value,
    onChange,
}) => {

    const grapesId = useRef('gjs-' + Math.floor((Math.random() * 99999) + 11111));

    const [editor, setEditor] = useState(null);
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null)

    const [editorValue, setEditorValue] = useState(null)

    const [isPreviewLoading, setIsPreviewLoading] = useState(false)
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [previewLink, setPreviewLink] = useState(null)

    useEffect(() => {
        const editor = grapesjs.init({
            container: '#' + grapesId.current,
            fromElement: true,
            plugins: [
                newsLetterPlugin,
                blockplugin,
                additionalPlugin,
                addPanelButtons,
            ],
            storageManager: {
                type: 'local',
                autosave: true,
                autoload: false,
                onStore: (data, editor) => {
                    let value = null
                    if (editor.getComponents().length)
                        value = JSON.stringify({ data: editor.getProjectData(), pages: getPagesContent(editor) })
                    onChange(value)
                    setEditorValue(value)
                },
            },
            deviceManager: {
                devices: [
                    {
                        name: "Letter",
                        width: "595px",
                        height: "820px",
                        withMedia: "",
                    },
                ],
            },
            pageManager: {
                pages: [
                    {
                        id: "page-1",
                        name: "Page 1",
                        component: "",
                    },
                ],
            },
        });

        editor.RichTextEditor.remove('link')
        editor.RichTextEditor.remove('wrap')
        if (labels?.length) {
            editor.addStyle(`
                span[contentEditable=false] {
                    border: 1px solid hsl(160, 100%, 40%);
                    background-color: hsl(0, 0%, 100%);
                    padding: 0 4px;
                    border-radius: 4px;
                    font-size-adjust: 0.4;
                }    
            `)
            const rte = editor.RichTextEditor

            rte.add('mention', {
                icon: `<select class="gjs-field gjs-field-select" style="height:1.8rem;color:inherit;">
                            <option value=''>Mention</option>
                            ${labels.map(label => label.fields.map(field => `<option value='${field.name}'>${field.name}</option>`))}
                        </select>`,
                event: 'change',
                result: (rte, action) => {
                    if (action.btn.firstChild.value) {
                        rte.insertHTML(`<span contenteditable="false" class='grapesjs-mapping-field' spellcheck="false">${action.btn.firstChild.value}</span>`)
                        action.btn.firstChild.value = ''
                    }
                },
            })
        }
        if (value) {
            editor.loadProjectData(JSON.parse(value).data)
        }

        editor.on('change', () => {
            editor.DomComponents.getWrapper().find('span.grapesjs-mapping-field').forEach(component => {
                component.set({
                    editable: false,
                    attributes: { 'contenteditable': 'false' }
                });
            });
        });

        setEditor(editor);
        setPages([...editor.Pages.getAll()]);
        setSelectedPage(editor.Pages.getSelected().id);

        editor.refresh();

        return () => editor.destroy()
    }, [])

    useEffect(() => {
        if (value) {
            if (editorValue !== value) {
                editor.loadProjectData(JSON.parse(value).data)
                setPages([...editor.Pages.getAll()]);
                setSelectedPage(editor.Pages.getSelected().id);
            }
        }
    }, [value])

    const getPagesContent = (editor) => {
        return editor.Pages.getAll().map(page => {
            const component = page.getMainComponent();
            return {
                html: editor.getHtml({ component }),
                css: editor.getCss({ component }),
            }
        });
    }

    const removePage = (pageId) => {
        editor.Pages.remove(pageId);
        const pages = editor.Pages.getAll().map((page, index) => {
            page.attributes.name = `Page ${index + 1}`;
            return page;
        });
        setPages(pages);
    }

    const addPage = () => {
        const len = editor.Pages.getAll().length;
        const page = editor.Pages.add({
            name: `Page ${len + 1}`,
            component: "",
        });
        setPages([...editor.Pages.getAll()]);
        selectPage(page.id)
    }

    const selectPage = (pageId) => {
        if (selectedPage === pageId) return
        setSelectedPage(pageId);
        editor.Pages.select(pageId);
    }

    const handlePreview = async () => {
        try {
            setIsPreviewLoading(true)
            const pages = getPagesContent(editor);

            const response = await axios({
                url: "/api/common/editor/grapesjs-preview",
                method: "POST",
                data: { pages },
                responseType: 'blob'
            })
            setPreviewLink(URL.createObjectURL(response.data))
            setIsPreviewModalOpen(true)
        } catch (error) {
            console.error(error)
        } finally {
            setIsPreviewLoading(false)
        }
    }

    return (
        <div className='d-flex grapes-editer'>
            <div className="grapes-editer--leftbar">
                <div className='d-flex grapes-editer--button-group'>
                    <button className='fu-btn fu-btn--primary fu-btn-sm' type='button' disabled={isPreviewLoading} onClick={handlePreview}><i class="ph ph-eye"></i>Preview</button>
                    <button className='fu-btn fu-btn--secondary fu-btn-sm mb-2' type='button' onClick={addPage}><i className="ph ph-plus"></i> Pages</button>
                </div>
                <div>
                    <div className="row">
                        {pages.map((page) => (
                            <div className="grapes-editer--pages mb-2">
                                <div className="card d-flex align-items-center radius-6  justify-content-between flex-row py-1 border-grey" key={page.id}>
                                    <button
                                        type="button"
                                        className={`${selectedPage === page.id ? "text-primary" : ''} font-size-14`}
                                        onClick={() => selectPage(page.id)}
                                    >
                                        {page.get("name") || page.id}
                                    </button>
                                    {selectedPage !== page.id && (
                                        <button type="button" className="fu font-size-14 icon-btn-xs  fu-btn--danger ph ph-trash" onClick={() => removePage(page.id)} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='fu-grapesjs' id={grapesId.current} />
            {isPreviewModalOpen &&
                <Modal.Container customSize={'md'} isOpen={isPreviewModalOpen}>
                    <Modal.Header onClose={() => { setIsPreviewModalOpen(false); setPreviewLink(null) }}>
                        <Modal.Title>Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <iframe src={previewLink + '#toolbar=0&navpanes=0&scrollbar=0'} title='Preview' width={'100%'} style={{ height: '496px', border: 'none' }} />
                    </Modal.Body>
                </Modal.Container>
            }
        </div>
    )
}

export default CustomGrapesjsEditor