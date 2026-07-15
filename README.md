# Web Store - Telegram Mini App (React + Vite)

Telegram Mini App digital store, migrated to React + Vite for Hot Module Replacement (HMR) and automatic browser cache-busting (via hashed production builds).

## MVP Boundaries

1. **Catalog & Categories**:
   - Navigation of digital goods divided into 3 categories: "Номера для ТГ" (Telegram Numbers), "Прокси" (Proxies), "Боты" (Bots).
   - Dynamic drill-down: Clicking a category reveals a 2x2 grid of specific products, with a "Back" button to return.
   - Smooth active state animations.
2. **Cart Management**:
   - State-driven React cart with product name, price, and quantity.
   - Dynamic badge on bottom navigation displaying total items.
   - Order review page with item removal, cost summary, and dynamic native Telegram popup checkout validation.
3. **Settings Modal (Bottom Sheet)**:
   - Slide-up bottom sheet with an iOS-style smooth transition toggle for "Optimized Mode".
   - Seamless Telegram WebApp Haptic Feedback integration.

## Folder Structure

The project is structured using Feature-Based Modular Architecture inside `src/`:

```
src/
├── assets/             # Global visual resources (Unsplash portraits, assets)
├── components/         # Shared stateless UI elements
│   ├── BottomNav.jsx   # Compact capsule floating nav with sliding active circle
│   ├── Header.jsx      # Top profile bar with time-based greetings & settings toggle
│   └── Layout.jsx      # Sticky container structure wrapping core views
├── context/            # Global context providers
│   └── WebAppContext.jsx # Wraps Telegram WebApp SDK API calls & themes
├── features/           # Isolated business domains
│   ├── cart/           # Cart view, order summaries, checkout validation
│   ├── catalog/        # Categories list, product cards grid (2x2)
│   └── settings/       # Bottom sheet slide-up menu with iOS toggle
├── App.jsx             # Main router state & orchestration
├── index.css           # Global design system tokens & base CSS resets
└── main.jsx            # React root DOM compiler
```

## Design System Tokens (Light Theme)

Defined inside `src/index.css`:

| Token | Color Value | Description |
|---|---|---|
| `--bg-color` | `#FFFFFF` | Core application backdrop |
| `--surface-color` | `#F5F5F7` | Neutral surface sheets & cards |
| `--card-bg` | `#F5F5F7` | Product & category container cards |
| `--surface-secondary` | `#E5E5EA` | Accent fields, borders, close buttons |
| `--border-color` | `#E5E5EA` | Padded section divider lines |
| `--white` | `#1C1C1E` | Primary high-contrast text |
| `--gray` | `#68686E` | Secondary description text |
| `--light-gray` | `#8E8E93` | Muted time-greetings |
| `--nav-bg` | `#000000` | Navigation capsule backdrop |
| `--nav-active-bg` | `#FFFFFF` | Sliding circle active tab highlighting |
| `--nav-active-color` | `#000000` | Active button icon glyph |
| `--nav-inactive-color`| `#8E8E93` | Rest state button icon glyph |
