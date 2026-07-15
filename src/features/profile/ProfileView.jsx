import React from 'react';

export default function ProfileView({ username, onOpenSettings, onOpenOrders, onOpenStats, onOpenReferral, hapticEnabled = true, tg }) {
  const handleItemClick = (label) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
  };

  return (
    <div className="profile-container view-fade-in">
      <div className="profile-blocks-list">
        <button 
          className="profile-block-item" 
          onClick={() => {
            handleItemClick('Мои заказы');
            onOpenOrders();
          }}
        >
          <div className="block-item-left">
            <div className="block-item-icon">
              <i className="hgi-stroke hgi-shopping-bag-02"></i>
            </div>
            <span className="block-item-title">Мои заказы</span>
          </div>
          <i className="hgi-stroke hgi-arrow-right-01 block-item-arrow"></i>
        </button>

        <button 
          className="profile-block-item" 
          onClick={() => {
            handleItemClick('Статистика');
            onOpenStats();
          }}
        >
          <div className="block-item-left">
            <div className="block-item-icon">
              <i className="hgi-stroke hgi-chart-column"></i>
            </div>
            <span className="block-item-title">Статистика</span>
          </div>
          <i className="hgi-stroke hgi-arrow-right-01 block-item-arrow"></i>
        </button>

        <button 
          className="profile-block-item" 
          onClick={() => {
            handleItemClick('Реферальная система');
            onOpenReferral();
          }}
        >
          <div className="block-item-left">
            <div className="block-item-icon">
              <i className="hgi-stroke hgi-user-add-01"></i>
            </div>
            <span className="block-item-title">Реферальная система</span>
          </div>
          <i className="hgi-stroke hgi-arrow-right-01 block-item-arrow"></i>
        </button>

        <button 
          className="profile-block-item" 
          onClick={() => {
            handleItemClick('Настройки');
            onOpenSettings();
          }}
        >
          <div className="block-item-left">
            <div className="block-item-icon">
              <i className="hgi-stroke hgi-settings-01"></i>
            </div>
            <span className="block-item-title">Настройки</span>
          </div>
          <i className="hgi-stroke hgi-arrow-right-01 block-item-arrow"></i>
        </button>

        <button className="profile-block-item" onClick={() => handleItemClick('Помощь')}>
          <div className="block-item-left">
            <div className="block-item-icon">
              <i className="hgi-stroke hgi-help-circle"></i>
            </div>
            <span className="block-item-title">Помощь</span>
          </div>
          <i className="hgi-stroke hgi-arrow-right-01 block-item-arrow"></i>
        </button>
      </div>
    </div>
  );
}
