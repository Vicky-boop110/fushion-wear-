# Fushon Wear - E-commerce Website

A modern, responsive e-commerce website built with React, Vite, and Tailwind CSS for a clothing brand.

## Features

- **Product Catalog**: Browse products with filtering by category, size, color, and price range
- **Product Details**: View detailed product information with image galleries, size/color selection
- **Shopping Cart**: Add items, update quantities, and remove products
- **Checkout**: Complete checkout process with mock payment
- **User Authentication**: Login and signup functionality (mock authentication)
- **Admin Panel**: Add, edit, and delete products with image upload support
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server (see API Configuration below)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` with your backend API URL
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### API Configuration

The application fetches data from a backend API. Configure the API base URL in your `.env` file:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Expected API Endpoints:

**Products:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products?category=men` - Get products by category
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

**Addresses:**
- `GET /api/addresses` - Get all saved addresses
- `GET /api/addresses/:id` - Get address by ID
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PUT /api/addresses/:id/default` - Set default address

**Cart:**
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

**Orders:**
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Data Persistence:** The application fetches all data from the backend API and automatically persists it to localStorage. If the backend is unavailable, the app will use cached data from localStorage, ensuring the application continues to function offline. Data is automatically synced with the backend when it becomes available.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Design System

- **Brand Colors**:
  - Navy: `#0f1724`
  - Coral: `#FF6B6B`
  - Sand: `#F7E9D7`
- **Typography**: Inter / Poppins
- **Design**: Modern, clean, minimal with hover effects

## Project Structure

```
src/
├── components/       # Reusable components (Header, Footer, etc.)
├── contexts/        # React contexts (Auth, Cart, Products)
├── pages/          # Page components (Home, Shop, Cart, etc.)
├── App.jsx         # Main app component with routing
├── main.jsx        # Entry point
└── index.css       # Global styles and Tailwind imports
```

## Admin Access

To access the admin panel:
1. Login with email: `admin@fushon.com`
2. Any password will work (mock authentication)
3. Navigate to the Admin page from the header

## Features in Detail

### Product Filtering
- Filter by category (Tops, Bottoms, Dresses, etc.)
- Filter by size (S, M, L, XL, etc.)
- Filter by color
- Filter by price range using sliders

### Shopping Cart
- Persistent cart using localStorage
- Update quantities
- Remove items
- View order summary with shipping and tax

### Admin Panel
- Add new products with multiple images
- Edit existing products
- Delete products
- All changes persist in localStorage

## Notes

- This is a demo project with mock authentication
- Product images use placeholder URLs
- No real payment processing
- Data persists in browser localStorage

## License

This project is created for demonstration purposes.
