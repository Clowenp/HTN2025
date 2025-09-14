import React, { useState } from 'react';
import './Sidebar.css';
import { Tab } from '../api/api';

interface SidebarProps {
  onUploadClick: () => void;
  activeTab: string;
  onTabChange: (tabName: string) => void;
  tabs: Tab[];
  onAddTab: (tabName: string) => Promise<Tab>;
  tabsLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onUploadClick, activeTab, onTabChange, tabs, onAddTab, tabsLoading }) => {
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  const handleAddNewTab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabName.trim()) return;

    try {
      await onAddTab(newTabName.trim());
      setNewTabName('');
      setShowAddTab(false);
    } catch (error) {
      console.error('Failed to add tab:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <button className="open-upload-window-button" onClick={onUploadClick}>
          <svg className="upload-open-window-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7,10 12,15 17,10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Upload Photos
        </button>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-title">Library</h3>
            <ul className="nav-list">
              {tabsLoading ? (
                <li className="nav-item">
                  <div className="nav-link loading">
                    Loading tabs...
                  </div>
                </li>
              ) : (
                <>
                  {tabs.map((tab) => (
                    <li key={tab.tab_id} className={`nav-item ${activeTab === tab.tab_name ? 'active' : ''}`}>
                      <button className="nav-link" onClick={() => onTabChange(tab.tab_name)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {tab.tab_name === 'All Photos' && (
                            <>
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21,15 16,10 5,21"></polyline>
                            </>
                          )}
                          {tab.tab_name === 'People' && (
                            <>
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </>
                          )}
                          {tab.tab_name === 'Places' && (
                            <>
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </>
                          )}
                          {tab.tab_name === 'Things' && (
                            <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-3-3z"></path>
                          )}
                          {!['All Photos', 'People', 'Places', 'Things'].includes(tab.tab_name) && (
                            <>
                              <path d="M9 12l2 2 4-4"></path>
                              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                            </>
                          )}
                        </svg>
                        {tab.tab_name}
                      </button>
                    </li>
                  ))}
                  
                  {/* Add new tab button */}
                  <li className="nav-item">
                    {showAddTab ? (
                      <form onSubmit={handleAddNewTab} className="add-tab-form">
                        <input
                          type="text"
                          value={newTabName}
                          onChange={(e) => setNewTabName(e.target.value)}
                          placeholder="Tab name"
                          className="add-tab-input"
                          autoFocus
                        />
                        <div className="add-tab-buttons">
                          <button type="submit" className="add-tab-save">
                            ✓
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setShowAddTab(false);
                              setNewTabName('');
                            }}
                            className="add-tab-cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button className="nav-link add-tab-button" onClick={() => setShowAddTab(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Tab
                      </button>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-title">Smart Albums</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                  </svg>
                  Favorites
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2v4l-3-3-3 3V2h6zM16 2v4l3-3 3 3V2h-6z"></path>
                    <rect x="2" y="8" width="20" height="14" rx="2" ry="2"></rect>
                  </svg>
                  Recent
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Archive
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="storage-info">
            <div className="storage-bar">
              <div className="storage-used" style={{width: '45%'}}></div>
            </div>
            <p className="storage-text">4.5 GB of 10 GB used</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
