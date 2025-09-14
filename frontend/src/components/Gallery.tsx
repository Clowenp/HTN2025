import React, { useEffect, useMemo, useState } from 'react';
import './Gallery.css';
import { Photo, Tag } from '../types/types';

interface GalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  searchQuery: string;
  deepSearch: boolean;
  loading?: boolean;
  tags: string[];
}

const Gallery: React.FC<GalleryProps> = ({ photos, onPhotoClick, searchQuery, loading, tags, deepSearch }) => {
  const [mockPhotos, setMockPhotos] = useState<Photo[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});

  // Filter photos based on search query and tags
  const filteredPhotos = useMemo(() => {
    const newMatches: Record<string, string> = {};
    
    // If we have tags from deep search (tab filtering), filter by tags
    if (tags.length) {
      console.log("Filtering by tags:", tags);
      const result = photos
        .filter((photo: Photo) => {
          return photo.tags.some((tag: Tag) => {
            console.log("Checking photo tag:", tag.name.toLowerCase());
            if (tags.some((testTag: any) => testTag.toLowerCase().includes(tag.name.toLowerCase()))) {
              newMatches[photo.id] = tag.name.toLowerCase();
              console.log("-- MATCHED --");
              return true;
            }
            return false;
          });
        })
        .map((photo: Photo) => ({ 
          ...photo, 
          tags: photo.tags.map((t: Tag) => ({ ...t, name: t.name.toLowerCase() }))
        }));
      setMatches(newMatches);
      return result;
    }
    const result = photos
      .filter((photo: Photo) => {
        if (!searchQuery) {
          setMatches(newMatches);
          return true;
        }
        const query = searchQuery.toLowerCase();
        return photo.tags.some((tag: Tag) => {
          if (tag.name.toLowerCase().includes(query)) {
            newMatches[photo.id] = tag.name.toLowerCase();
            return true;
          }
          return false;
        });
      })
      .map((photo: Photo) => ({ 
        ...photo, 
        tags: photo.tags.map((t: Tag) => ({ ...t, name: t.name.toLowerCase() }))
      }))
    setMatches(newMatches);
    return result;
  }, [photos, searchQuery, tags]);

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading your photos...</p>
      </div>
    );
  }

  if (filteredPhotos?.length === 0) {
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

  const PhotoLabels = ({ photo } : { photo: Photo }) => (
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
  );

  const PhotoLabelsWithSearch = ({ photo }: { photo: Photo }) => (
    <div className="photo-labels">
      <span className="label-tag">
          {matches[photo.id]}
      </span>
      {photo.tags.length > 1 && (
        <span className="label-tag more">
          +{photo.tags.length - 1}
        </span>
      )}
    </div>
  )

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2>
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Photos'}
        </h2>
        <span className="photo-count">{filteredPhotos.length} photos</span>
      </div>
      
      <div className="photo-grid">
        {filteredPhotos?.map((photo) => (
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
                <PhotoLabels photo={photo}/>
              </div>
            </div>
            <div className="photo-info">
              <p className="photo-filename">{photo.filename || "No name found"}</p>
              <p className="photo-date">
                {photo.dateModified}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
