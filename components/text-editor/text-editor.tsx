import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'],
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
    'image',
];

const TextEditor = () => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: any) => {
        // db 나오면 수정해야 할 부분
        e.preventDefault();
        console.log('Submitted Content:', content);
    };

    return (
        <form onSubmit={handleSubmit}>
            <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
            />
            <button type='submit'>Submit</button>
        </form>
    );
};

export default TextEditor;
