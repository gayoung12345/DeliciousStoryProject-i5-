'use client';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],

        ['clean'],
    ],
};

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
];

const TextEditor = ({
    content,
    setContent,
}: {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const handleContentChange = (value: string) => {
        setContent(value);
    };

    return (
        <ReactQuill
            style={{ height: '300px' }}
            value={content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
        />
    );
};

export default TextEditor;
