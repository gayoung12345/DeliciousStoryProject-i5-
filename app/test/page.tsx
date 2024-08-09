'use client';

import ImageUpload from '@/components/text-editor/imageUpload';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const Test: React.FC = () => {
    const [images, setImages] = useState<{ [key: string]: File | null }>({});
    const [uploading, setUploading] = useState<boolean>(false);

    const handleImageSelected = (id: string, file: File | null) => {
        setImages((prev) => ({ ...prev, [id]: file }));
    };

    const handleUpload = async () => {
        setUploading(true);

        try {
            for (const [id, file] of Object.entries(images)) {
                if (file) {
                    const storageRef = ref(storage, `images/${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    await new Promise<void>((resolve, reject) => {
                        uploadTask.on('state_changed', null, reject, () =>
                            resolve()
                        );
                    });

                    const downloadURL = await getDownloadURL(storageRef);

                    // Firestore에 URL 저장
                    await addDoc(collection(db, 'uploadedImages'), {
                        name: file.name,
                        url: downloadURL,
                        createdAt: new Date(),
                    });

                    console.log(
                        `URL saved to Firestore for ${id}:`,
                        downloadURL
                    );
                }
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }

        setUploading(false);
    };

    return (
        <main className='flex flex-col items-center'>
            <div className='w-full max-w-6xl p-4 border border-gray-300'>
                <div className='text-xl font-bold mb-4'>레시피 등록</div>
                <div className='flex flex-col space-y-4 px-8'>
                    <ImageUpload
                        id='image1'
                        onImageSelected={handleImageSelected}
                    />
                    <ImageUpload
                        id='image2'
                        onImageSelected={handleImageSelected}
                    />
                    {/* 추가적인 ImageUpload 인스턴스 */}
                </div>
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className='mt-4 bg-blue-500 text-white py-2 px-4 rounded'
                >
                    {uploading ? '업로드 중...' : '업로드'}
                </button>
            </div>
        </main>
    );
};

export default Test;
