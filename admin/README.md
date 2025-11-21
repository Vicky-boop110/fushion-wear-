# Fusion Wear Admin Panel

Admin panel for managing products in the Fusion Wear e-commerce platform.

## Features

- **Product Management**: Create, edit, and delete products
- **Product List**: View all products in a table format with filtering
- **Product Form**: Comprehensive form for adding/editing products with:
  - Basic information (name, description, brand, quality, category)
  - Pricing and stock management
  - Image URLs (main image and additional images)
  - Sizes, colors, and tags management
  - Featured product toggle

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend API server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint (optional):
   - Create a `.env` file in the admin directory
   - Add: `VITE_API_BASE_URL=http://localhost:5000/api`
   - Default is already set to `http://localhost:5000/api`

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

## Usage

### Creating a Product

1. Click "Add New Product" button on the dashboard
2. Fill in the product details:
   - **Required fields**: Name, Category, Price
   - Add sizes, colors, and tags as needed
   - Upload image URLs
   - Set stock quantity
   - Toggle featured status if needed
3. Click "Create Product"

### Editing a Product

1. Click "Edit" button next to any product in the dashboard
2. Modify the product details
3. Click "Update Product"

### Deleting a Product

1. Click "Delete" button next to any product
2. Confirm the deletion

## API Endpoints Used

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Product Schema

```javascript
{
  name: String (required),
  description: String,
  brand: String,
  quality: 'Regular' | 'Premium' | 'Designer',
  category: 'men' | 'women' | 'kids' | 'unisex' (required),
  type: String,
  price: Number (required),
  image: String (URL),
  images: [String] (array of URLs),
  sizes: [String],
  colors: [String],
  stock: Number,
  tags: [String],
  isFeatured: Boolean
}
```

