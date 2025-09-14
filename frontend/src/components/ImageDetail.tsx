import React, { useState, useEffect } from 'react';
import { Photo } from '../types/types';
import './ImageDetail.css';

interface ImageDetailProps {
  photo: Photo;
  onClose: () => void;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ photo, onClose }) => {
  const [imageDetails, setImageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock detailed image information
    const mockDetails = {
      detailed_description: `This is a beautiful ${photo.tags[0].name} photograph captured with excellent composition and lighting. The image showcases ${photo.tags.map((tag) => tag.name).slice(0, 3).join(', ')} with remarkable clarity and artistic vision. The photographer has skillfully balanced the elements to create a visually compelling scene that draws the viewer's attention and evokes a strong emotional response.`,
      file_size: '2.4 MB',
      dimensions: '1920x1080',
      camera: 'Canon EOS R5',
      settings: {
        aperture: 'f/2.8',
        shutter: '1/250s',
        iso: 'ISO 400',
        focal_length: '85mm'
      },
      location: 'San Francisco, CA',
      confidence_score: 0.92
    };

    // Simulate API call delay
    setTimeout(() => {
      setImageDetails(mockDetails);
      setLoading(false);
    }, 800);
  }, [photo]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-detail-overlay" onClick={handleBackdropClick}>
      <div className="image-detail-modal">
        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="image-detail-content">
          <div className="image-section">
            <img 
              src={photo.thumbnail_url?.replace('w=300&h=300', 'w=800&h=600')} 
              alt={photo.filename}
              className="detail-image"
            />
          </div>

          <div className="info-section">
            <div className="image-header">
              <h2 className="image-title">{photo.filename}</h2>
              <p className="upload-date">
                Uploaded {new Date(photo.dateModified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="labels-section">
              <h3>Labels</h3>
              <div className="labels-grid">
                {photo.tags.map((tag, index) => (
                  <span key={index} className="detail-label">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="loading-details">
                <div className="loading-spinner-small"></div>
                <p>Analyzing image details...</p>
              </div>
            ) : (
              <>
                <div className="description-section">
                  <h3>AI Description</h3>
                  <p className="ai-description">{imageDetails.detailed_description}</p>
                  <div className="confidence-score">
                    <span>Confidence: {Math.round(imageDetails.confidence_score * 100)}%</span>
                  </div>
                </div>

                <div className="metadata-section">
                  <h3>Image Details</h3>
                  <div className="metadata-grid">
                    <div className="metadata-item">
                      <span className="metadata-label">File Size</span>
                      <span className="metadata-value">{imageDetails.file_size}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Dimensions</span>
                      <span className="metadata-value">{imageDetails.dimensions}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Camera</span>
                      <span className="metadata-value">{imageDetails.camera}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Location</span>
                      <span className="metadata-value">{imageDetails.location}</span>
                    </div>
                  </div>
                </div>

                <div className="camera-settings">
                  <h3>Camera Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <span className="setting-label">Aperture</span>
                      <span className="setting-value">{imageDetails.settings.aperture}</span>
                    </div>
                    <div className="setting-item">
                      <span className="setting-label">Shutter</span>
                      <span className="setting-value">{imageDetails.settings.shutter}</span>
                    </div>
                    <div className="setting-item">
                      <span className="setting-label">ISO</span>
                      <span className="setting-value">{imageDetails.settings.iso}</span>
                    </div>
                    <div className="setting-item">
                      <span className="setting-label">Focal Length</span>
                      <span className="setting-value">{imageDetails.settings.focal_length}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="action-buttons">
              <button className="action-button primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download
              </button>
              <button className="action-button secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
                Favorite
              </button>
              <button className="action-button secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
