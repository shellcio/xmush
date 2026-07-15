import React, { useState, useEffect } from 'react';

export default function QuantityModal({ 
  isOpen, 
  onClose, 
  product, 
  onConfirm, 
  hapticEnabled = true,
  tg 
}) {
  const [quantity, setQuantity] = useState(1);
  const [localProduct, setLocalProduct] = useState(null);

  // Cache product locally when it changes to allow exit animations
  useEffect(() => {
    if (product) {
      setLocalProduct(product);
      setQuantity(1);
    }
  }, [product]);

  const triggerHaptic = (style) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  const handleIncrement = () => {
    triggerHaptic('light');
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const handleDecrement = () => {
    triggerHaptic('light');
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleConfirm = () => {
    triggerHaptic('medium');
    onConfirm(quantity);
    onClose();
  };

  const cleanTitle = (title) => {
    if (!title) return '';
    return title.replace(/\s*\(\+\d+\)$/, '');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (hapticEnabled && tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
      }
      onClose();
    }
  };

  // Use current product if available, otherwise fallback to cached localProduct to prevent layout jumps during transition
  const activeProduct = product || localProduct;

  const displayName = activeProduct ? cleanTitle(activeProduct.name) : '';
  const displayFlag = activeProduct ? activeProduct.flag : null;
  const singlePrice = activeProduct ? activeProduct.price : 0;
  const totalPrice = singlePrice * quantity;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        
        <div className="modal-header">
          <div className="quantity-modal-header-info">
            <div className="quantity-product-title-row">
              <h2 className="quantity-product-title">{displayName}</h2>
              {displayFlag && (
                <span className="product-title-flag large-flag">
                  <img src={`https://flagcdn.com/w40/${displayFlag}.png`} alt="" />
                </span>
              )}
            </div>
            <span className="quantity-product-price-single">
              Цена за шт: {singlePrice.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Закрыть">
            <i className="hgi-stroke hgi-cancel-01"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="quantity-product-meta">
            <div className="meta-row">
              <span className="meta-label">Тип товара</span>
              <span className="meta-value">Виртуальный номер</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Срок действия</span>
              <span className="meta-value">Вечный</span>
            </div>
            {displayFlag && (
              <div className="meta-row">
                <span className="meta-label">Регион</span>
                <span className="meta-value">{displayFlag.toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="quantity-selector-container">
            <span className="quantity-selector-label">Укажите количество номеров</span>
            <div className="quantity-counter-section">
              <button 
                className="btn-counter-control" 
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <i className="hgi-stroke hgi-minus-sign"></i>
              </button>
              <span className="quantity-counter-value">{quantity}</span>
              <button 
                className="btn-counter-control" 
                onClick={handleIncrement}
              >
                <i className="hgi-stroke hgi-plus-sign"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="quantity-total-section">
            <span className="quantity-total-label">Итого к оплате:</span>
            <span className="quantity-total-price">{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button className="btn-buy modal-confirm-btn" onClick={handleConfirm}>
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}
