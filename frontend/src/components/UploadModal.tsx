import React, { useState, useRef } from 'react';
import './UploadModal.css';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      onUpload(selectedFiles);
      setUploading(false);
    }, 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-modal-overlay" onClick={handleBackdropClick}>
      <div className="upload-modal">
        <div className="upload-header">
          <h2>Upload Photos</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="upload-content">
          <div 
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <div className="drop-zone-content">
              <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <h3>Drop photos here or click to browse</h3>
              <p>Support for JPG, PNG, GIF, and other image formats</p>
              <p className="file-limit">Maximum file size: 16MB per image</p>
            </div>
          </div>

          {selectedFiles && (
            <div className="selected-files">
              <h4>Selected Files ({selectedFiles.length})</h4>
              <div className="file-list">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <svg className="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                      </svg>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    {file.type.startsWith('image/') && (
                      <div className="file-preview">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="upload-actions">
            <button 
              className="cancel-button" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              className="upload-button" 
              onClick={handleUpload}
              disabled={!selectedFiles || uploading}
            >
              {uploading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Upload {selectedFiles ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}` : 'Photos'}
                </>
              )}
            </button>
          </div>

          {uploading && (
            <div className="upload-progress">
              <div className="progress-info">
                <span>Processing images with AI...</span>
                <span>This may take a moment</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
