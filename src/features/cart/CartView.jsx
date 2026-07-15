import React, { useMemo } from 'react';

export default function CartView({ 
  cart, 
  onRemoveFromCart, 
  onClearCart, 
  onSwitchTab, 
  tg 
}) {
  const totalSum = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const handleRemove = (name) => {
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
    onRemoveFromCart(name);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (tg) {
      tg.showPopup({
        title: 'Оформление заказа',
        message: `Вы подтверждаете заказ на сумму ${totalSum.toLocaleString('ru-RU')} ₽?`,
        buttons: [
          { id: 'ok', type: 'default', text: 'Подтвердить' },
          { id: 'cancel', type: 'cancel', text: 'Отмена' }
        ]
      }, (buttonId) => {
        if (buttonId === 'ok') {
          tg.showAlert('Спасибо за покупку! Заказ успешно оформлен.');
          onClearCart();
          onSwitchTab('home');
        }
      });
    } else {
      const confirmCheckout = window.confirm(`Вы подтверждаете заказ на сумму ${totalSum.toLocaleString('ru-RU')} ₽?`);
      if (confirmCheckout) {
        window.alert('Спасибо за покупку! Заказ успешно оформлен.');
        onClearCart();
        onSwitchTab('home');
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="empty-cart-icon">
          <i className="hgi-stroke hgi-shopping-cart-01"></i>
        </div>
        <h3>Ваша корзина пуста</h3>
        <p className="subtitle">Выберите интересующие товары в каталоге, чтобы добавить их сюда</p>
      </div>
    );
  }

  return (
    <div className="cart-content-wrapper">
      <div className="cart-items-scroll">
        <div className="cart-items-list">
          {cart.map(item => (
            <div key={item.name} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-title">{item.name}</span>
                <span className="cart-item-price">{item.price.toLocaleString('ru-RU')} ₽</span>
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

      <div className="cart-checkout-footer">
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
    </div>
  );
}
