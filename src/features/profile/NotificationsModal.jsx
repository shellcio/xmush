import React, { useEffect } from 'react';

export default function NotificationsModal({ isOpen, onClose, notifications = [], setNotifications, hapticEnabled = true, tg }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    onClose();
  };

  // Mark all notifications as read when the modal is opened
  useEffect(() => {
    if (isOpen && notifications.some(n => n.unread)) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  }, [isOpen, notifications, setNotifications]);

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet notifications-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <h2>Уведомления</h2>
          <button className="btn-close-modal" onClick={handleClose}>
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>

        <div className="modal-body notifications-modal-body">
          {notifications.length === 0 ? (
            <div className="notifications-empty-state">
              <i className="hgi-stroke hgi-notification-03"></i>
              <span>У вас нет уведомлений</span>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notification-card ${notif.unread ? 'unread' : ''}`}
                >
                  <div className="notification-card-header">
                    <span className="notification-card-title">{notif.title}</span>
                    <span className="notification-card-time">{notif.time}</span>
                  </div>
                  <p className="notification-card-desc" dangerouslySetInnerHTML={{ __html: notif.desc }}></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
