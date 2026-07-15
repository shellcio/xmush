import React, { useState, useEffect } from 'react';

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
  hapticEnabled = true,
  tg
}) {
  const [localCart, setLocalCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(0);

  // Cache cart state to allow smooth exit animations when modal closes
  useEffect(() => {
    if (isOpen) {
      // Only update local cart if not currently in success state
      if (!checkoutSuccess) {
        setLocalCart(cart);
      }
    } else {
      // Reset success state after modal fully closes
      const timer = setTimeout(() => {
        setCheckoutSuccess(false);
        setIsCheckingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, cart, checkoutSuccess]);

  const totalSum = localCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (hapticEnabled && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
      onClose();
    }
  };

  const handleRemove = (name) => {
    if (hapticEnabled && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    onRemoveFromCart(name);
  };

  const handleCheckout = () => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
    setPurchasedAmount(totalSum);
    setIsCheckingOut(true);

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      onClearCart(); // Clear cart in App.jsx parent state
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    }, 1500);
  };

  const handleSuccessDone = () => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet cart-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        
        <div className="modal-header">
          <h2>Ваша корзина</h2>
          <button className="btn-close-modal" onClick={onClose} aria-label="Закрыть">
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>

        <div className="modal-body cart-modal-body">
          {isCheckingOut ? (
            /* Checkout Loading View */
            <div className="cart-checkout-loading-view">
              <div className="cart-checkout-spinner"></div>
              <span>Проведение оплаты...</span>
            </div>
          ) : checkoutSuccess ? (
            /* Checkout Success View */
            <div className="cart-checkout-success-view view-fade-in">
              <i className="hgi-stroke hgi-checkmark-circle-02 checkout-success-icon"></i>
              <h3>Заказ успешно оплачен</h3>
              
              <div className="checkout-success-info-card">
                <div className="success-info-row">
                  <span className="success-info-label">Сумма оплаты</span>
                  <span className="success-info-val">{purchasedAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="success-info-row">
                  <span className="success-info-label">Метод оплаты</span>
                  <span className="success-info-val">Telegram Stars</span>
                </div>
                <div className="success-info-row">
                  <span className="success-info-label">Доставка</span>
                  <span className="success-info-val">Моментально</span>
                </div>
              </div>
            </div>
          ) : localCart.length === 0 ? (
            /* Cart Empty State */
            <div className="cart-empty-state">
              <div className="empty-cart-icon">
                <i className="hgi-stroke hgi-shopping-cart-01"></i>
              </div>
              <h3>Ваша корзина пуста</h3>
              <p className="subtitle">Выберите интересующие товары в каталоге, чтобы добавить их сюда</p>
            </div>
          ) : (
            /* Normal Cart List */
            <div className="cart-items-scroll">
              <div className="cart-items-list">
                {localCart.map(item => (
                  <div key={item.name} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-title">
                        {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                      </span>
                      <span className="cart-item-price">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <button 
                      className="btn-remove-item" 
                      onClick={() => handleRemove(item.name)} 
                      aria-label="Удалить"
                    >
                      <i className="hgi-stroke hgi-delete-02"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isCheckingOut && !checkoutSuccess && localCart.length > 0 && (
          <div className="modal-footer cart-modal-footer">
            <div className="cart-summary-details">
              <div className="summary-row">
                <span className="summary-label">Подитог</span>
                <span className="summary-value">{totalSum.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Скидка</span>
                <span className="summary-value text-success">0 ₽</span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Итого к оплате</span>
                <span className="summary-value">{totalSum.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <button className="btn-buy checkout-btn" onClick={handleCheckout}>
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
