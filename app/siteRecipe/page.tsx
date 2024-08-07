import { Button, ButtonText } from '@/components/ui/button';
import { Icon, EditIcon } from '@/components/ui/icon';
import Image from 'next/image';
import React from 'react';

const photos = [
    //예시 이미지
    { id: 1, name: '레시피 이름 1', image: '/svg/logo.svg' },
    { id: 2, name: '레시피 이름 2', image: '/svg/logo.svg' },
    { id: 3, name: '레시피 이름 3', image: '/svg/logo.svg' },
    { id: 4, name: '레시피 이름 4', image: '/svg/logo.svg' },
    { id: 5, name: '레시피 이름 5', image: '/svg/logo.svg' },
    { id: 6, name: '레시피 이름 6', image: '/svg/logo.svg' },
    { id: 7, name: '레시피 이름 7', image: '/svg/logo.svg' },
    { id: 8, name: '레시피 이름 8', image: '/svg/logo.svg' },
    { id: 9, name: '레시피 이름 9', image: '/svg/logo.svg' },
    { id: 10, name: '레시피 이름 10', image: '/svg/logo.svg' },
];

const siteRecipe = () => {
    return (
        <main>
            <div
                className='recipe-container'
                style={{ margin: 20 }}
            >
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    자유게시판
                </h1>

                <div
                    className='container mx-auto columns-1 sm:columns-2 md:columns-3 xl:columns-4'
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    {photos.length > 0 ? (
                        photos.map((photo) => (
                            <div
                                key={photo.id}
                                className='photo-card'
                                style={{
                                    margin: 10,
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    marginBottom: '10px',
                                    padding: '10px',
                                }}
                            >
                                <Image
                                    src={photo.image}
                                    alt={photo.name}
                                    width={250}
                                    height={250}
                                />
                                <p style={{ margin: 5, fontSize: 14 }}>
                                    {photo.name}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={{ margin: 20, fontSize: 14 }}>
                            레시피가 없습니다.
                        </p>
                    )}
                </div>

                <Button
                    size='md'
                    variant='solid'
                    action='primary'
                    style={{
                        color: '#ffffff',
                        backgroundColor: '#000000',
                        position: 'absolute',
                        bottom: 50,
                        right: 50,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                    }}
                >
                    <ButtonText>
                        <Icon
                            as={EditIcon}
                            size='md'
                        />
                    </ButtonText>
                </Button>
            </div>
        </main>
    );
};

export default siteRecipe;
