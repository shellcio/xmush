import React from 'react';

export default function BottomNav({ activeTab, onTabChange, cartCount }) {
  const transformStyle = activeTab === 'home' ? 'translateX(0)' : 'translateX(52px)';

  return (
    <div className="bottom-nav-container">
      <nav className="bottom-nav">
        <div 
          className="nav-active-indicator" 
          style={{ transform: transformStyle }}
        />
        
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')} 
          aria-label="Каталог"
        >
          <i className="hgi-stroke hgi-home-01 nav-icon"></i>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')} 
          aria-label="Профиль"
        >
          <i className="hgi-stroke hgi-user nav-icon"></i>
        </button>
      </nav>
    </div>
  );
}
