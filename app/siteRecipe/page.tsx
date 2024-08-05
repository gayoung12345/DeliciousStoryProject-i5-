import React from 'react';
import styled from 'styled-components';

const photos = [
  { id: 1, name: '사진 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: '사진 2', image: 'https://via.placeholder.com/150' },
  { id: 3, name: '사진 3', image: 'https://via.placeholder.com/150' },
  { id: 4, name: '사진 4', image: 'https://via.placeholder.com/150' },
  { id: 5, name: '사진 5', image: 'https://via.placeholder.com/150' },
  { id: 6, name: '사진 6', image: 'https://via.placeholder.com/150' },
  { id: 7, name: '사진 7', image: 'https://via.placeholder.com/150' },
  { id: 8, name: '사진 8', image: 'https://via.placeholder.com/150' },
  { id: 9, name: '사진 9', image: 'https://via.placeholder.com/150' },
  { id: 10, name: '사진 10', image: 'https://via.placeholder.com/150' },
];

const Container = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #fafafa;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const PhotoCard = styled.a`
  text-decoration: none;
  color: inherit;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
`;

const PhotoName = styled.div`
  padding: 8px;
`;

const siteRecipe = () => {
  return (
    <Container>
      <Title>레시피 페이지</Title>
      <Grid>
        {photos.map((photo) => (
          <PhotoCard key={photo.id} href="#">
            <PhotoImage src={photo.image} alt={photo.name} />
            <PhotoName>{photo.name}</PhotoName>
          </PhotoCard>
        ))}
      </Grid>
    </Container>
  );
};

export default siteRecipe;