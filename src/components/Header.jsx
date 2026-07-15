import React, { useMemo } from 'react';

const categoryTitles = {
  numbers: 'Номера для ТГ',
  proxy: 'Прокси',
  bots: 'Боты'
};

export default function Header({ 
  username, 
  avatarUrl, 
  onOpenCart, 
  cartCount,
  selectedCategory, 
  onBack,
  hasUnread,
  onOpenNotifications
}) {
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning,';
    if (hours >= 12 && hours < 18) return 'Good Afternoon,';
    if (hours >= 18 && hours < 23) return 'Good Evening,';
    return 'Good Night,';
  }, []);

  return (
    <header className="app-header">
      {selectedCategory ? (
        <div className="header-back-navigation">
          <button className="btn-header-back" onClick={onBack} aria-label="Назад">
            <i className="hgi-stroke hgi-arrow-left-01"></i>
            <span>Назад</span>
          </button>
          <span className="header-category-title">
            {categoryTitles[selectedCategory]}
          </span>
        </div>
      ) : (
        <div className="header-profile">
          <div className="user-avatar">
            <img src={avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"} alt="Avatar" />
          </div>
          <div className="user-info">
            <span className="user-greeting">{greeting}</span>
            <span className="user-name">{username || 'Vladislav'}</span>
          </div>
        </div>
      )}
      
      <div className="header-actions">
        <div className="header-actions-pill">
          <button className="btn-header-action" onClick={onOpenCart} aria-label="Корзина">
            <i className="hgi-stroke hgi-shopping-cart-01"></i>
            {cartCount > 0 && (
              <span className="header-cart-badge">{cartCount}</span>
            )}
          </button>
          <button 
            className="btn-header-action notification-bell-btn" 
            onClick={onOpenNotifications} 
            aria-label="Уведомления"
          >
            <i className="hgi-stroke hgi-notification-03"></i>
            {hasUnread && (
              <span className="header-notification-badge-dot"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
