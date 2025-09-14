import React, { useEffect, useState } from 'react';
import './Gallery.css';
import { Photo, Tag } from '../types/types';

interface GalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  searchQuery: string;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onPhotoClick, searchQuery }) => {
  const [mockPhotos, setMockPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter photos based on search query
  const filteredPhotos = photos.filter((photo: Photo) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return photo.tags.some((tag: Tag) => tag.name.toLowerCase().includes(query)) ||
           photo.s3Url.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading your photos...</p>
      </div>
    );
  }

  if (filteredPhotos.length === 0) {
    return (
      <div className="gallery-empty">
        <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21,15 16,10 5,21"></polyline>
        </svg>
        <h3>No photos found</h3>
        <p>
          {searchQuery 
            ? `No photos match "${searchQuery}". Try a different search term.`
            : 'Upload some photos to get started!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2>
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Photos'}
        </h2>
        <span className="photo-count">{filteredPhotos.length} photos</span>
      </div>
      
      <div className="photo-grid">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.filename} 
            className="photo-card"
            onClick={() => onPhotoClick(photo)}
          >
            <div className="photo-thumbnail">
              <img 
                src={photo.s3Url/*photo.thumbnailUrl */} 
                alt={photo.filename}
                loading="lazy"
              />
              <div className="photo-overlay">
                <div className="photo-labels">
                  {photo.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="label-tag">
                      {tag.name}
                    </span>
                  ))}
                  {photo.tags.length > 3 && (
                    <span className="label-tag more">
                      +{photo.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="photo-info">
              <p className="photo-filename">{photo.filename || "No name found"}</p>
              <p className="photo-date">
                {new Date(parseFloat(photo.dateModified) * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
