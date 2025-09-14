import React from 'react';
import Gallery from './Gallery';
import { Photo } from '../types/types';
import './TemplatePage.css';

interface TemplatePageProps {
  title: string;
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  searchQuery: string;
  deepSearch: boolean;
  loading?: boolean;
  tags: string[];
}

const TemplatePage: React.FC<TemplatePageProps> = ({ 
  title, 
  photos, 
  onPhotoClick, 
  searchQuery, 
  deepSearch, 
  loading, 
  tags 
}) => {
  return (
    <div className="template-page">
      <div className="template-header">
        <h2 className="template-title">
          {title}
        </h2>
        <span className="photo-count">{photos.length} photos</span>
      </div>
      
      <div className="template-content">
        <Gallery 
          photos={photos}
          onPhotoClick={onPhotoClick}
          searchQuery={searchQuery}
          deepSearch={deepSearch}
          loading={loading}
          tags={tags}
        />
      </div>
    </div>
  );
};

export default TemplatePage;
