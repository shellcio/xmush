import React from 'react';

export default function StatsModal({ isOpen, onClose, orders = [], hapticEnabled = true, tg }) {
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

  // Calculate statistics dynamically from orders
  const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);
  const totalPurchases = orders.length;
  const activeServices = orders.filter(order => order.status === 'Активен').length;
  
  // Calculate category percentages
  const categoryTotals = {
    number: 0,
    proxy: 0,
    bot: 0
  };

  orders.forEach(order => {
    const type = order.type || 'number';
    if (categoryTotals[type] !== undefined) {
      categoryTotals[type] += order.price;
    } else {
      categoryTotals['number'] += order.price;
    }
  });

  const numberPercent = totalSpent > 0 ? Math.round((categoryTotals.number / totalSpent) * 100) : 0;
  const proxyPercent = totalSpent > 0 ? Math.round((categoryTotals.proxy / totalSpent) * 100) : 0;
  const botPercent = totalSpent > 0 ? Math.round((categoryTotals.bot / totalSpent) * 100) : 0;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet stats-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <h2>Статистика</h2>
          <button className="btn-close-modal" onClick={handleClose}>
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>

        <div className="modal-body stats-modal-body">
          {/* Grid Summary */}
          <div className="stats-summary-grid">
            <div className="stats-card">
              <span className="stats-card-label">Всего расходов</span>
              <span className="stats-card-value">{totalSpent.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Всего покупок</span>
              <span className="stats-card-value">{totalPurchases} шт.</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Активные услуги</span>
              <span className="stats-card-value">{activeServices} шт.</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Сэкономлено</span>
              <span className="stats-card-value">{(Math.round(totalSpent * 0.1)).toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="stats-breakdown-section">
            <h3 className="stats-section-title">Распределение расходов</h3>
            
            <div className="stats-breakdown-card">
              {totalSpent === 0 ? (
                <div className="stats-no-data">
                  <span>Оформите свой первый заказ, чтобы сформировать аналитику</span>
                </div>
              ) : (
                <div className="stats-bars-list">
                  {/* Numbers Category */}
                  <div className="breakdown-item">
                    <div className="breakdown-header">
                      <span className="breakdown-name">Виртуальные номера</span>
                      <span className="breakdown-val">{categoryTotals.number.toLocaleString('ru-RU')} ₽ ({numberPercent}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${numberPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Proxy Category */}
                  <div className="breakdown-item">
                    <div className="breakdown-header">
                      <span className="breakdown-name">IPv4 / IPv6 Прокси</span>
                      <span className="breakdown-val">{categoryTotals.proxy.toLocaleString('ru-RU')} ₽ ({proxyPercent}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${proxyPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Bots Category */}
                  <div className="breakdown-item">
                    <div className="breakdown-header">
                      <span className="breakdown-name">Телеграм боты</span>
                      <span className="breakdown-val">{categoryTotals.bot.toLocaleString('ru-RU')} ₽ ({botPercent}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${botPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
