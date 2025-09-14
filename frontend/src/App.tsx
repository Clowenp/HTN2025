import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import ImageDetail from './components/ImageDetail';
import UploadModal from './components/UploadModal';
import { searchImages, uploadImage } from './api/api';
import { type Photo } from './types/types';

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deepSearch, setDeepSearch] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };

  const handleSearch = (query: string, deepSearch: boolean) => {
    setSearchQuery(query);
    setDeepSearch(deepSearch);
    // TODO: Implement actual search API call
  };

  useEffect(() => {
    (async() => {
      setLoading(true);
      const imageData = await searchImages(searchQuery);
      console.log(imageData);
      setPhotos(imageData);
      setLoading(false);
    })();
  }, [searchQuery])

  const handleUpload = async (files: FileList) => {
    setShowUploadModal(false);
    setLoading(true);
    
    try {
      // Upload all files in parallel
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      
      console.log('All uploads completed:', responses);
      
      // Refetch gallery data after successful uploads
      const imageData = await searchImages(searchQuery);
      setPhotos(imageData);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
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
            deepSearch={deepSearch}
            loading={loading}
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
