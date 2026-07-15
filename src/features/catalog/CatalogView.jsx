import React, { useState, useEffect } from 'react';
import { PRODUCTS_DATA } from './productsData';

export default function CatalogView({ 
  selectedCategory, 
  onSelectCategory, 
  onBackToCategories, 
  onAddToCart,
  hapticEnabled = true,
  tg
}) {
  const [localCategoryData, setLocalCategoryData] = useState(null);

  // Cache category data to allow smooth slide-out transition when going back
  useEffect(() => {
    if (selectedCategory && PRODUCTS_DATA[selectedCategory]) {
      setLocalCategoryData(PRODUCTS_DATA[selectedCategory]);
    }
  }, [selectedCategory]);

  const triggerHaptic = (style) => {
    if (hapticEnabled && tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  const handleSelectCategory = (key) => {
    triggerHaptic('medium');
    onSelectCategory(key);
  };

  const handleAddToCart = (item) => {
    triggerHaptic('light');
    onAddToCart(item);
  };

  const cleanTitle = (title) => {
    return title.replace(/\s*\(\+\d+\)$/, '');
  };

  return (
    <div className="catalog-navigator">
      <div className={`catalog-view-slide categories-slide ${selectedCategory ? 'inactive' : 'active'}`}>
        <div className="categories-container">
          {Object.entries(PRODUCTS_DATA).map(([key, category]) => (
            <div 
              key={key} 
              className="category-card" 
              onClick={() => handleSelectCategory(key)}
            >
              <span className="category-card-name">{category.title}</span>
              <div className="card-watermark-icon">
                <i className={`hgi-stroke ${category.icon}`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`catalog-view-slide products-slide ${selectedCategory ? 'active' : 'inactive'}`}>
        {localCategoryData && (
          <div className="products-container">
            <div className="products-list-view">
              {localCategoryData.items.map(item => (
                <div key={item.name} className="product-list-item">
                  <div className="product-item-left">
                    <div className="product-item-details">
                      <div className="product-item-title-row">
                        <span className="product-item-title">{cleanTitle(item.name)}</span>
                        {item.flag && (
                          <span className="product-title-flag">
                            <img src={`https://flagcdn.com/w40/${item.flag}.png`} alt="" />
                          </span>
                        )}
                      </div>
                      <span className="product-item-desc">{item.desc}</span>
                    </div>
                  </div>
                  <div className="product-item-right">
                    <span className="product-item-price">{item.price.toLocaleString('ru-RU')} ₽</span>
                    <button 
                      className="btn-buy" 
                      onClick={() => handleAddToCart({ name: item.name, price: item.price })}
                    >
                      Купить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
