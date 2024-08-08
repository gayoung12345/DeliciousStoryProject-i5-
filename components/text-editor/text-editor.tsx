'use client';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';

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

const TextEditor = () => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: any) => {
        // db 나오면 수정해야 할 부분
        e.preventDefault();
        console.log('Submitted Content:', content);
    };

    return (
        // <form onSubmit={handleSubmit}>
        <ReactQuill
            style={{ height: '400px' }}
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
        />
        // {/* <button type='submit'>Submit</button> */}
        // </form>
    );
};

export default TextEditor;
