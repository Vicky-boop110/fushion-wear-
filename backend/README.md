# Fusion Wear Backend

Express + MongoDB backend for the Fusion Wear storefront.

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `env.example` to `.env` and update secrets
   ```bash
   cp env.example .env
   # then edit .env
   ```
3. Run in development mode
   ```bash
   npm run dev
   ```

### Seed the initial catalog

1. Ensure `.env` contains a valid `MONGODB_URI`
2. Seed products first
   ```bash
   npm run seed:products
   ```
3. (Optional) Seed demo orders – requires products to exist
   ```bash
   npm run seed:orders
   # or seed both
   npm run seed:all
   ```
4. Verify documents exist in the `products` and `orders` collections

## Environment variables

| Key           | Description                             |
| ------------- | --------------------------------------- |
| `PORT`        | Port for the API (default: `5000`)      |
| `MONGODB_URI` | Mongo connection string                 |
| `CLIENT_ORIGIN` | Allowed CORS origin (e.g. Vite `5173`) |

## Available routes

- `GET /api/health` – service heartbeat
- `GET /api/products` – list products
- `POST /api/products` – create product
- `GET /api/products/:id` – fetch single product
- `PUT /api/products/:id` – update product
- `DELETE /api/products/:id` – delete product
- `GET /api/orders` – list orders
- `POST /api/orders` – create order
- `GET /api/orders/:id` – order detail
- `PATCH /api/orders/:id` – update order status

