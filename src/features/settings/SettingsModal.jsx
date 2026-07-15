import React from 'react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  optMode, 
  onToggleOptMode, 
  hapticEnabled,
  onToggleHaptic,
  tg 
}) {
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

  const handleToggleOpt = (checked) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred(checked ? 'success' : 'warning');
    }
    onToggleOptMode(checked);
  };

  const handleToggleHaptic = (checked) => {
    if (checked && tg && tg.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
    onToggleHaptic(checked);
  };

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'active' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <h2>Настройки</h2>
          <button className="btn-close-modal" onClick={handleClose}>
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="settings-container-block">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Оптимизированный режим</span>
                <span className="setting-subtitle">Отключение анимаций интерфейса</span>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={optMode} 
                  onChange={(e) => handleToggleOpt(e.target.checked)} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Виброотклик</span>
                <span className="setting-subtitle">Тактильная связь при взаимодействии</span>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={hapticEnabled} 
                  onChange={(e) => handleToggleHaptic(e.target.checked)} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
