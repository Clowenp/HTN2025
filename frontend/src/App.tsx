import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import ImageDetail from './components/ImageDetail';
import UploadModal from './components/UploadModal';

export interface Photo {
  image_id: string;
  filename: string;
  labels: string[];
  thumbnail_url?: string;
  upload_date: string;
}

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [photos] = useState<Photo[]>([]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search API call
  };

  const handleUpload = (files: FileList) => {
    // TODO: Implement actual upload API call
    setShowUploadModal(false);
  };

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      
      <div className="app-content">
        <Sidebar 
          onUploadClick={() => setShowUploadModal(true)}
        />
        
        <main className="main-content">
          <Gallery 
            photos={photos}
            onPhotoClick={handlePhotoClick}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {selectedPhoto && (
        <ImageDetail 
          photo={selectedPhoto}
          onClose={handleCloseDetail}
        />
      )}

      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}

export default App;
