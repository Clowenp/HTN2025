import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import TemplatePage from './components/TemplatePage';
import ImageDetail from './components/ImageDetail';
import UploadModal from './components/UploadModal';
import { searchImages, uploadImage, deepSearch as deepSearchAPI, getTabs, addTab, type Tab } from './api/api';
import { type Photo } from './types/types';

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deepSearch, setDeepSearch] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Photos');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [tabsLoading, setTabsLoading] = useState(true);

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

  const handleDeepSearch = async (query: string) => {
    const tagData = await deepSearchAPI(query);
    console.log("deep query: ", query);
    console.log("imageData: ", tagData);
    //setPhotos(imageData);
    setLoading(false);
    const tagList = tagData.map((tag) => tag.tag.toLowerCase());
    setTags(tagList);
  }

  // Fetch tabs on component mount
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const tabsData = await getTabs();
        setTabs(tabsData);
        setTabsLoading(false);
      } catch (error) {
        console.error('Failed to fetch tabs:', error);
        setTabsLoading(false);
      }
    };

    fetchTabs();
  }, []);

  useEffect(() => {
    (async() => {
      console.log(deepSearch)
      if (deepSearch) {
        console.log("deep search ,ignored ");
      }
      else {
        setTags([]);
        setLoading(true);
        const imageData = await searchImages('');
        console.log(imageData);
        setPhotos(imageData);
        setLoading(false);
      }
      
    })();
  }, [searchQuery, deepSearch])

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    // Reset search when changing tabs
    setSearchQuery('');
    setDeepSearch(false);
    setTags([]);
  };

  const handleAddTab = async (tabName: string) => {
    try {
      const newTab = await addTab(tabName);
      setTabs(prevTabs => [...prevTabs, newTab]);
      return newTab;
    } catch (error) {
      console.error('Failed to add tab:', error);
      throw error;
    }
  };

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
        onDeepSearch={handleDeepSearch}
        searchQuery={searchQuery}
      />
      
      <div className="app-content">
        <Sidebar 
          onUploadClick={() => setShowUploadModal(true)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
          onAddTab={handleAddTab}
          tabsLoading={tabsLoading}
        />
        
        <main className="main-content">
          <TemplatePage 
            title={activeTab}
            photos={photos}
            tags={tags}
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
