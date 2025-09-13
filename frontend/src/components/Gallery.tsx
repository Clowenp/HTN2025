import React, { useEffect, useState } from 'react';
import { Photo } from '../App';
import './Gallery.css';

interface GalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  searchQuery: string;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onPhotoClick, searchQuery }) => {
  const [mockPhotos, setMockPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for development
  useEffect(() => {
    const generateMockPhotos = (): Photo[] => {
      const mockData: Photo[] = [
        {
          image_id: '1',
          filename: 'mountain_landscape.jpg',
          labels: ['mountain', 'landscape', 'nature', 'outdoor', 'scenic'],
          thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
          upload_date: '2024-01-15T10:30:00Z'
        },
        {
          image_id: '2',
          filename: 'city_night.jpg',
          labels: ['city', 'night', 'urban', 'lights', 'architecture'],
          thumbnail_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&h=300&fit=crop',
          upload_date: '2024-01-14T20:15:00Z'
        },
        {
          image_id: '3',
          filename: 'beach_sunset.jpg',
          labels: ['beach', 'sunset', 'ocean', 'waves', 'golden hour'],
          thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop',
          upload_date: '2024-01-13T18:45:00Z'
        },
        {
          image_id: '4',
          filename: 'forest_path.jpg',
          labels: ['forest', 'path', 'trees', 'nature', 'hiking'],
          thumbnail_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
          upload_date: '2024-01-12T14:20:00Z'
        },
        {
          image_id: '5',
          filename: 'coffee_shop.jpg',
          labels: ['coffee', 'indoor', 'cafe', 'cozy', 'lifestyle'],
          thumbnail_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop',
          upload_date: '2024-01-11T09:00:00Z'
        },
        {
          image_id: '6',
          filename: 'dog_park.jpg',
          labels: ['dog', 'pet', 'park', 'outdoor', 'animal'],
          thumbnail_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
          upload_date: '2024-01-10T16:30:00Z'
        },
        {
          image_id: '7',
          filename: 'food_dinner.jpg',
          labels: ['food', 'dinner', 'restaurant', 'meal', 'delicious'],
          thumbnail_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop',
          upload_date: '2024-01-09T19:15:00Z'
        },
        {
          image_id: '8',
          filename: 'friends_party.jpg',
          labels: ['friends', 'party', 'celebration', 'people', 'happy'],
          thumbnail_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop',
          upload_date: '2024-01-08T21:00:00Z'
        }
      ];
      return mockData;
    };

    // Simulate loading delay
    setTimeout(() => {
      setMockPhotos(generateMockPhotos());
      setLoading(false);
    }, 1000);
  }, []);

  // Filter photos based on search query
  const filteredPhotos = mockPhotos.filter(photo => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return photo.labels.some(label => label.toLowerCase().includes(query)) ||
           photo.filename.toLowerCase().includes(query);
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
            key={photo.image_id} 
            className="photo-card"
            onClick={() => onPhotoClick(photo)}
          >
            <div className="photo-thumbnail">
              <img 
                src={photo.thumbnail_url} 
                alt={photo.filename}
                loading="lazy"
              />
              <div className="photo-overlay">
                <div className="photo-labels">
                  {photo.labels.slice(0, 3).map((label, index) => (
                    <span key={index} className="label-tag">
                      {label}
                    </span>
                  ))}
                  {photo.labels.length > 3 && (
                    <span className="label-tag more">
                      +{photo.labels.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="photo-info">
              <p className="photo-filename">{photo.filename}</p>
              <p className="photo-date">
                {new Date(photo.upload_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
