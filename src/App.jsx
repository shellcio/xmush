import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import CatalogView from './features/catalog/CatalogView';
import ProfileView from './features/profile/ProfileView';
import CartModal from './features/cart/CartModal';
import QuantityModal from './features/catalog/QuantityModal';
import SettingsModal from './features/settings/SettingsModal';
import OrdersModal from './features/profile/OrdersModal';
import StatsModal from './features/profile/StatsModal';
import ReferralModal from './features/profile/ReferralModal';
import NotificationsModal from './features/profile/NotificationsModal';
import SplashScreen from './components/SplashScreen';

// Telegram WebApp API helper
const tg = window.Telegram?.WebApp;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [optMode, setOptMode] = useState(() => {
    return localStorage.getItem('optMode') === 'true';
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    const saved = localStorage.getItem('hapticEnabled');
    return saved !== 'false';
  });
  const [quantityProduct, setQuantityProduct] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '2',
        title: 'Новый реферал!',
        desc: 'Пользователь <strong>@alex_tg</strong> зарегистрировался. Начислено <strong>+540 ₽</strong>.',
        time: '14.07.2026, 12:45',
        unread: true
      },
      {
        id: '3',
        title: 'Заказ выполнен',
        desc: 'Продукт <strong>IPv4 Прокси (Россия)</strong> успешно подготовлен и выдан.',
        time: '12.07.2026, 14:22',
        unread: false
      }
    ];
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '10492',
        name: 'РФ Номер (+7)',
        date: '15.07.2026, 21:15',
        price: 190,
        type: 'number',
        status: 'Активен'
      },
      {
        id: '10351',
        name: 'IPv4 Прокси (Россия)',
        date: '12.07.2026, 14:22',
        price: 90,
        type: 'proxy',
        status: 'Завершен',
        details: 'IP: 192.168.1.1 | Port: 8080 | User: username | Pass: password'
      },
      {
        id: '10214',
        name: 'Авто-продажи Бот',
        date: '10.07.2026, 18:05',
        price: 2900,
        type: 'bot',
        status: 'Завершен',
        details: 'Готовый бот успешно запущен и работает по токену в ТГ.'
      }
    ];
  });

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Migrate old notifications from localStorage
  useEffect(() => {
    setNotifications(prev => {
      const hasOldAuth = prev.some(n => n.title === 'Успешная авторизация');
      const hasOldRefFormat = prev.some(n => n.title === 'Новый реферал!' && !n.desc.includes('<strong>'));
      const hasOldHighlight = prev.some(n => n.desc.includes('income-highlight'));
      
      if (hasOldAuth || hasOldRefFormat || hasOldHighlight) {
        return [
          {
            id: '2',
            title: 'Новый реферал!',
            desc: 'Пользователь <strong>@alex_tg</strong> зарегистрировался. Начислено <strong>+540 ₽</strong>.',
            time: '14.07.2026, 12:45',
            unread: true
          },
          {
            id: '3',
            title: 'Заказ выполнен',
            desc: 'Продукт <strong>IPv4 Прокси (Россия)</strong> успешно подготовлен и выдан.',
            time: '12.07.2026, 14:22',
            unread: false
          }
        ];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('optMode', optMode.toString());
  }, [optMode]);

  useEffect(() => {
    localStorage.setItem('hapticEnabled', hapticEnabled.toString());
  }, [hapticEnabled]);

  // Initialize WebApp colors and lifecycle
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#FFFFFF');
      tg.setBackgroundColor('#FFFFFF');
    }
  }, []);

  // Sync Optimized Mode class to document body
  useEffect(() => {
    if (optMode) {
      document.body.classList.add('opt-mode');
    } else {
      document.body.classList.remove('opt-mode');
    }
  }, [optMode]);

  // Extract user info from Telegram WebApp
  const user = useMemo(() => {
    if (tg && tg.initDataUnsafe?.user) {
      const u = tg.initDataUnsafe.user;
      const firstName = u.first_name || '';
      const lastName = u.last_name || '';
      return {
        name: (firstName + (lastName ? ' ' + lastName : '')).trim() || 'Vladislav',
        avatarUrl: u.photo_url || null
      };
    }
    return {
      name: 'Vladislav',
      avatarUrl: null
    };
  }, []);

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    
    // Auto-scroll content back to top
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.scrollTop = 0;
    }

    setActiveTab(tabId);
    
    // If user clicks on Catalog (Home), reset category view
    if (tabId === 'home') {
      setSelectedCategory(null);
    }
  };

  // Add to Cart logic
  const handleAddToCart = (item) => {
    if (selectedCategory === 'numbers') {
      setQuantityProduct(item);
    } else {
      setCart(prevCart => {
        const existsIndex = prevCart.findIndex(i => i.name === item.name);
        if (existsIndex > -1) {
          const updated = [...prevCart];
          updated[existsIndex].quantity += 1;
          return updated;
        } else {
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });
    }
  };

  const handleConfirmQuantity = (quantity) => {
    if (!quantityProduct) return;
    setCart(prevCart => {
      const existsIndex = prevCart.findIndex(i => i.name === quantityProduct.name);
      if (existsIndex > -1) {
        const updated = [...prevCart];
        updated[existsIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { ...quantityProduct, quantity }];
      }
    });
    setQuantityProduct(null);
  };

  // Remove from Cart logic
  const handleRemoveFromCart = (name) => {
    setCart(prevCart => prevCart.filter(item => item.name !== name));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutSuccess = (purchasedItems) => {
    const newOrders = purchasedItems.map((item) => {
      // Determine order type based on product name
      let orderType = 'number';
      let details = undefined;
      const nameLower = item.name.toLowerCase();
      
      if (nameLower.includes('прокси')) {
        orderType = 'proxy';
        details = 'IP: 185.220.101.' + Math.floor(10 + Math.random() * 200) + ' | Port: 8080 | User: usr' + Math.floor(100 + Math.random() * 900) + ' | Pass: px' + Math.random().toString(36).substring(2, 8);
      } else if (nameLower.includes('бот')) {
        orderType = 'bot';
        details = 'Готовый бот успешно запущен и работает по токену в ТГ.';
      } else if (nameLower.includes('аккаунт')) {
        orderType = 'number';
      }

      return {
        id: Math.floor(10000 + Math.random() * 9000).toString(),
        name: item.name + (item.quantity > 1 ? ` (x${item.quantity})` : ''),
        date: new Date().toLocaleString('ru-RU', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: item.price * item.quantity,
        type: orderType,
        status: 'Активен',
        details: details
      };
    });

    const totalPaid = newOrders.reduce((sum, o) => sum + o.price, 0);
    setOrders(prevOrders => [...newOrders, ...prevOrders]);
    setCart([]); // Clear cart
    handleAddNotification(
      'Покупка успешна',
      `Оплачен заказ на сумму <strong>${totalPaid.toLocaleString('ru-RU')} ₽</strong>. Детали доступны во вкладке «Мои заказы».`
    );
  };

  const handleAddNotification = (title, desc) => {
    const now = new Date();
    const timeStr = now.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title,
        desc,
        time: timeStr,
        unread: true
      },
      ...prev
    ]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const hasUnreadNotifications = useMemo(() => {
    return notifications.some(n => n.unread);
  }, [notifications]);

  return (
    <div className="app-wrapper">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Header 
        username={user.name} 
        avatarUrl={user.avatarUrl} 
        selectedCategory={activeTab === 'home' ? selectedCategory : null}
        onBack={() => {
          if (hapticEnabled && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
          setSelectedCategory(null);
        }}
        onOpenCart={() => {
          if (hapticEnabled && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
          setCartOpen(true);
        }} 
        cartCount={cartCount}
        hasUnread={hasUnreadNotifications}
        onOpenNotifications={() => {
          if (hapticEnabled && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
          setNotificationsOpen(true);
        }}
      />

      <main className="app-content">
        <div 
          className="app-viewpager" 
          style={{ transform: activeTab === 'home' ? 'translateX(0)' : 'translateX(-50%)' }}
        >
          <div className="viewpager-slide">
            <CatalogView 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onBackToCategories={() => setSelectedCategory(null)}
              onAddToCart={handleAddToCart}
              hapticEnabled={hapticEnabled}
              tg={tg}
            />
          </div>
          <div className="viewpager-slide">
            <ProfileView 
              username={user.name} 
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenOrders={() => setOrdersOpen(true)}
              onOpenStats={() => setStatsOpen(true)}
              onOpenReferral={() => setReferralOpen(true)}
              hapticEnabled={hapticEnabled}
              tg={tg}
            />
          </div>
        </div>
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      <CartModal 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
        hapticEnabled={hapticEnabled}
        tg={tg}
      />

      <QuantityModal
        isOpen={quantityProduct !== null}
        onClose={() => setQuantityProduct(null)}
        product={quantityProduct}
        onConfirm={handleConfirmQuantity}
        hapticEnabled={hapticEnabled}
        tg={tg}
      />

      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        optMode={optMode}
        onToggleOptMode={setOptMode}
        hapticEnabled={hapticEnabled}
        onToggleHaptic={setHapticEnabled}
        tg={tg}
      />

      <OrdersModal 
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        hapticEnabled={hapticEnabled}
        tg={tg}
      />

      <StatsModal 
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        orders={orders}
        hapticEnabled={hapticEnabled}
        tg={tg}
      />

      <ReferralModal 
        isOpen={referralOpen}
        onClose={() => setReferralOpen(false)}
        onAddNotification={handleAddNotification}
        hapticEnabled={hapticEnabled}
        tg={tg}
      />

      <NotificationsModal 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        hapticEnabled={hapticEnabled}
        tg={tg}
      />
    </div>
  );
}
