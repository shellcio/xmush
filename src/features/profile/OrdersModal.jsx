import React, { useState, useEffect } from 'react';

export default function OrdersModal({ isOpen, onClose, orders = [], onUpdateOrderStatus, hapticEnabled = true, tg }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [localOrder, setLocalOrder] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // 'code', 'session', 'tdata', 'reset', 'exit'
  const [actionResult, setActionResult] = useState(null); // { type: 'code'|'msg', content: string }
  const [confirmingAction, setConfirmingAction] = useState(null); // 'reset' | 'exit'

  // Cache selected order to allow smooth slide-out transition
  useEffect(() => {
    if (selectedOrder) {
      setLocalOrder(selectedOrder);
    }
  }, [selectedOrder]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    // Delay resetting views slightly to hide transition jump from user
    setTimeout(() => {
      setSelectedOrder(null);
      resetActions();
    }, 300);
    onClose();
  };

  const resetActions = () => {
    setLoadingAction(null);
    setActionResult(null);
    setConfirmingAction(null);
  };

  const triggerHaptic = (style) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  const handleOrderClick = (order) => {
    triggerHaptic('light');
    resetActions();
    setSelectedOrder(order);
  };

  const handleGetCode = () => {
    triggerHaptic('medium');
    resetActions();
    setLoadingAction('code');
    setTimeout(() => {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      setLoadingAction(null);
      setActionResult({ type: 'code', content: '48201' });
    }, 1500);
  };

  const handleGetSession = () => {
    triggerHaptic('medium');
    resetActions();
    setLoadingAction('session');
    setTimeout(() => {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      setLoadingAction(null);
      setActionResult({ type: 'msg', content: 'Файл .session успешно отправлен ботом в ваши личные сообщения!' });
    }, 1500);
  };

  const handleGetTData = () => {
    triggerHaptic('medium');
    resetActions();
    setLoadingAction('tdata');
    setTimeout(() => {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      setLoadingAction(null);
      setActionResult({ type: 'msg', content: 'Архив tdata.zip успешно отправлен ботом в ваши личные сообщения!' });
    }, 1500);
  };

  const handleConfirmReset = () => {
    triggerHaptic('medium');
    setConfirmingAction(null);
    setLoadingAction('reset');
    setTimeout(() => {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      setLoadingAction(null);
      setActionResult({ type: 'msg', content: 'Все активные сессии успешно сброшены. Бот вышел из аккаунта.' });
      if (activeOrder) {
        if (onUpdateOrderStatus) {
          onUpdateOrderStatus(activeOrder.id, 'Завершен');
        }
        setSelectedOrder(prev => prev ? { ...prev, status: 'Завершен' } : null);
        setLocalOrder(prev => prev ? { ...prev, status: 'Завершен' } : null);
      }
    }, 1500);
  };

  const handleConfirmExit = () => {
    triggerHaptic('medium');
    setConfirmingAction(null);
    setLoadingAction('exit');
    setTimeout(() => {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      setLoadingAction(null);
      setActionResult({ type: 'msg', content: 'Вы успешно вышли из аккаунта. Бот прекратил работу с номером.' });
      if (activeOrder) {
        if (onUpdateOrderStatus) {
          onUpdateOrderStatus(activeOrder.id, 'Завершен');
        }
        setSelectedOrder(prev => prev ? { ...prev, status: 'Завершен' } : null);
        setLocalOrder(prev => prev ? { ...prev, status: 'Завершен' } : null);
      }
    }, 1500);
  };

  const handleCopyText = (text) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
  };

  const activeOrder = selectedOrder || localOrder;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet orders-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          {selectedOrder ? (
            <div className="modal-header-back-title">
              <button 
                className="btn-modal-back"
                onClick={() => {
                  triggerHaptic('light');
                  resetActions();
                  setSelectedOrder(null);
                }}
              >
                <i className="hgi-stroke hgi-arrow-left-01"></i>
              </button>
              <h2>Заказ #{selectedOrder.id}</h2>
            </div>
          ) : (
            <h2>Мои заказы</h2>
          )}
          <button className="btn-close-modal" onClick={handleClose}>
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>

        <div className="modal-body orders-modal-body-overflow">
          <div className={`orders-modal-navigator ${selectedOrder ? 'show-details' : ''}`}>
            {/* Slide 1: Orders List */}
            <div className="orders-modal-slide orders-list-slide">
              {orders.length === 0 ? (
                <div className="orders-empty-state">
                  <i className="hgi-stroke hgi-shopping-bag-02"></i>
                  <span>Список ваших заказов пуст</span>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="order-list-card"
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="order-card-top-row">
                        <span className="order-id-label">Заказ #{order.id}</span>
                        <span className={`order-status-pill ${order.status === 'Активен' ? 'active' : ''}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-card-middle-row">
                        <span className="order-name-text">{order.name}</span>
                      </div>
                      <div className="order-card-bottom-row">
                        <span className="order-date-text">{order.date}</span>
                        <span className="order-price-text">{order.price} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slide 2: Order Details */}
            <div className="orders-modal-slide order-details-slide">
              {activeOrder && (
                <div className="order-details-view">
                  <div className="order-details-header-card">
                    <span className="order-details-title">{activeOrder.name}</span>
                    <div className="order-details-meta-grid">
                      <div className="meta-item">
                        <span className="meta-label">Статус</span>
                        <span className={`meta-val status ${activeOrder.status === 'Активен' ? 'active' : ''}`}>
                          {activeOrder.status}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Дата</span>
                        <span className="meta-val">{activeOrder.date}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Сумма</span>
                        <span className="meta-val price">{activeOrder.price} ₽</span>
                      </div>
                    </div>
                  </div>

                  {activeOrder.type === 'number' && (
                    <div className="order-actions-section">
                      {/* Confirmations */}
                      {confirmingAction && (
                        <div className="order-action-confirm-card">
                          <span className="confirm-text">
                            {confirmingAction === 'reset' 
                              ? 'Сбросить все сессии? Бот выйдет из аккаунта.' 
                              : 'Выйти из аккаунта? Бот отключит этот номер.'
                            }
                          </span>
                          <div className="confirm-buttons">
                            <button 
                              className="btn-confirm-yes" 
                              onClick={confirmingAction === 'reset' ? handleConfirmReset : handleConfirmExit}
                            >
                              Да, выполнить
                            </button>
                            <button className="btn-confirm-no" onClick={() => setConfirmingAction(null)}>
                              Отмена
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Loading States */}
                      {loadingAction && (
                        <div className="order-action-loading-card">
                          <div className="order-spinner"></div>
                          <span className="loading-text">
                            {loadingAction === 'code' && 'Запрос кода авторизации...'}
                            {loadingAction === 'session' && 'Генерация файла сессии...'}
                            {loadingAction === 'tdata' && 'Подготовка архива tdata...'}
                            {loadingAction === 'reset' && 'Сброс активных сессий...'}
                            {loadingAction === 'exit' && 'Выход из аккаунта...'}
                          </span>
                        </div>
                      )}

                      {/* Results */}
                      {actionResult && (
                        <div className="order-action-result-card">
                          {actionResult.type === 'code' ? (
                            <div className="result-code-wrapper">
                              <span className="result-code-label">Код подтверждения:</span>
                              <div className="result-code-value-row">
                                <span className="result-code-num">{actionResult.content}</span>
                                <button 
                                  className="btn-copy-code"
                                  onClick={() => handleCopyText(actionResult.content)}
                                >
                                  <i className="hgi-stroke hgi-copy-01"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="result-msg-wrapper">
                              <i className="hgi-stroke hgi-checkmark-circle-02 success-icon"></i>
                              <span className="result-msg-text">{actionResult.content}</span>
                            </div>
                          )}

                          <button 
                            className="btn-dismiss-result"
                            onClick={() => {
                              triggerHaptic('light');
                              setActionResult(null);
                            }}
                          >
                            Понятно
                          </button>
                        </div>
                      )}

                      {/* Action Buttons Grid (only for active number orders) */}
                      {!loadingAction && !confirmingAction && !actionResult && activeOrder.status === 'Активен' && (
                        <div className="order-buttons-list-group">
                          <button className="order-action-btn primary" onClick={handleGetCode}>
                            <i className="hgi-stroke hgi-key"></i>
                            <span>Получить код</span>
                          </button>

                          <button className="order-action-btn secondary" onClick={handleGetSession}>
                            <i className="hgi-stroke hgi-file-attachment"></i>
                            <span>Скачать Session</span>
                          </button>

                          <button className="order-action-btn secondary" onClick={handleGetTData}>
                            <i className="hgi-stroke hgi-folder-shared"></i>
                            <span>Скачать TData</span>
                          </button>

                          <button 
                            className="order-action-btn danger-outline" 
                            onClick={() => setConfirmingAction('reset')}
                          >
                            <i className="hgi-stroke hgi-refresh-circle"></i>
                            <span>Сбросить сессии</span>
                          </button>

                          <button 
                            className="order-action-btn danger-outline" 
                            onClick={() => setConfirmingAction('exit')}
                          >
                            <i className="hgi-stroke hgi-logout-01"></i>
                            <span>Выйти с аккаунта</span>
                          </button>
                        </div>
                      )}

                      {!loadingAction && !confirmingAction && !actionResult && activeOrder.status !== 'Активен' && (
                        <div className="order-completed-notice">
                          <i className="hgi-stroke hgi-information-circle"></i>
                          <span>Работа по номеру завершена. Сессия закрыта.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeOrder.type !== 'number' && activeOrder.details && (
                    <div className="order-details-static-info">
                      <div className="static-info-label">Полученные данные:</div>
                      <div className="details-text-box">{activeOrder.details}</div>
                      <button 
                        className="btn-copy-static-details"
                        onClick={() => handleCopyText(activeOrder.details)}
                      >
                        <i className="hgi-stroke hgi-copy-01"></i> Копировать данные
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
