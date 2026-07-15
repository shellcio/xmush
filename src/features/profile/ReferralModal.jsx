import React, { useState } from 'react';

export default function ReferralModal({ isOpen, onClose, onAddNotification, hapticEnabled = true, tg }) {
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [withdrawResult, setWithdrawResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    // Delay state reset to prevent visual jump during closing animation
    setTimeout(() => {
      setLoadingWithdraw(false);
      setWithdrawResult(null);
      setCurrentPage(1);
    }, 300);
    onClose();
  };

  const triggerHaptic = (style) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  const handleCopyLink = () => {
    triggerHaptic('light');
    const refLink = 'https://t.me/xmush_bot?start=ref10492';
    navigator.clipboard.writeText(refLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleWithdraw = () => {
    triggerHaptic('medium');
    setLoadingWithdraw(true);
    setWithdrawResult(null);

    setTimeout(() => {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      setLoadingWithdraw(false);
      setWithdrawResult('Заявка создана! Выплата будет зачислена на баланс в течение 24 часов.');
      if (onAddNotification) {
        onAddNotification('Выплата реферальных', 'Заявка на вывод 1 080 ₽ успешно создана и обрабатывается.');
      }
    }, 1500);
  };

  const mockReferrals = [
    { username: '@alex_tg', date: '14.07.2026', earned: 540 },
    { username: '@dmitry_dev', date: '11.07.2026', earned: 310 },
    { username: '@elena_k', date: '09.07.2026', earned: 0 },
    { username: '@sergey_s', date: '07.07.2026', earned: 150 },
    { username: '@marina_w', date: '05.07.2026', earned: 80 }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(mockReferrals.length / itemsPerPage);
  const paginatedReferrals = mockReferrals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    triggerHaptic('light');
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    triggerHaptic('light');
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet referral-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <h2>Реферальная система</h2>
          <button className="btn-close-modal" onClick={handleClose}>
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>

        <div className="modal-body referral-modal-body">
          {/* Link Section */}
          <div className="ref-section">
            <span className="ref-section-title">Ваша реферальная ссылка</span>
            <div className="ref-link-box">
              <span className="ref-link-text">t.me/xmush_bot?start=ref10492</span>
              <button className={`btn-copy-ref-link ${isCopied ? 'copied' : ''}`} onClick={handleCopyLink}>
                <i className={`hgi-stroke ${isCopied ? 'hgi-checkmark-circle-02' : 'hgi-copy-01'}`}></i>
              </button>
            </div>
            <p className="ref-section-desc">
              Приглашайте друзей и получайте 10% от суммы каждой их покупки на свой баланс вывода.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="ref-stats-grid">
            <div className="ref-stat-card">
              <span className="ref-stat-label">Приглашено</span>
              <span className="ref-stat-val">{mockReferrals.length} чел.</span>
            </div>
            <div className="ref-stat-card">
              <span className="ref-stat-label">Всего заработано</span>
              <span className="ref-stat-val">1080 ₽</span>
            </div>
            <div className="ref-stat-card">
              <span className="ref-stat-label">Доступно к выводу</span>
              <span className="ref-stat-val">1080 ₽</span>
            </div>
          </div>

          {/* Withdraw simulation box */}
          <div className="ref-withdraw-section">
            {loadingWithdraw && (
              <div className="ref-action-loading">
                <div className="ref-spinner"></div>
                <span>Создание заявки на вывод...</span>
              </div>
            )}

            {withdrawResult && (
              <div className="ref-action-result success">
                <i className="hgi-stroke hgi-checkmark-circle-02 success-icon"></i>
                <span>{withdrawResult}</span>
              </div>
            )}

            {!loadingWithdraw && !withdrawResult && (
              <button className="btn-ref-withdraw" onClick={handleWithdraw}>
                <i className="hgi-stroke hgi-money-send-01"></i> Вывести заработанное
              </button>
            )}
          </div>

          {/* Referrals List */}
          <div className="ref-list-section">
            <div className="ref-list-header-row">
              <span className="ref-section-title">Последние приглашенные</span>
              <div className="ref-pagination-controls">
                <button 
                  className="btn-ref-page" 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  aria-label="Предыдущая страница"
                >
                  <i className="hgi-stroke hgi-arrow-left-01"></i>
                </button>
                <span className="ref-page-indicator">{currentPage} / {totalPages}</span>
                <button 
                  className="btn-ref-page" 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  aria-label="Следующая страница"
                >
                  <i className="hgi-stroke hgi-arrow-right-01"></i>
                </button>
              </div>
            </div>
            <div className="ref-table-card">
              {paginatedReferrals.map((ref, idx) => (
                <div key={idx} className="ref-table-row">
                  <div className="ref-row-left">
                    <span className="ref-user-name">{ref.username}</span>
                    <span className="ref-user-date">Регистрация {ref.date}</span>
                  </div>
                  <span className="ref-row-right">+{ref.earned} ₽</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
