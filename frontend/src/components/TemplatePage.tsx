import React from 'react';
import Gallery from './Gallery';
import { Photo } from '../types/types';

interface TemplatePageProps {
  title: string;
  onPhotoClick: (photo: Photo) => void;
  searchQuery: string;
}

const TemplatePage: React.FC<TemplatePageProps> = ({ title, onPhotoClick, searchQuery }) => {
  // Mock photos - in the future, this will be filtered by LLM-extracted tags
  const mockPhotos: Photo[] = [];

  return (
    <div>
      <h2 style={{ 
        marginBottom: '20px', 
        color: '#333', 
        fontSize: '24px',
        fontWeight: '600'
      }}>
        {title}
      </h2>
      {/* <Gallery 
        photos={mockPhotos}
        onPhotoClick={onPhotoClick}
        searchQuery={searchQuery}
      /> */}
    </div>
  );
};

export default TemplatePage;
