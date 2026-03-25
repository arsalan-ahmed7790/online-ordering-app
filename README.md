# FoodExpress - Full Stack Food Ordering Application

A complete end-to-end food ordering system with React frontend, FastAPI backend, and PostgreSQL database.

## 🏗️ Architecture

```
├── backend/           # FastAPI Backend
│   ├── app/
│   │   ├── routers/   # API Routes
│   │   ├── models/    # Database Models
│   │   ├── schemas/   # Pydantic Schemas
│   │   ├── auth.py    # JWT Authentication
│   │   └── main.py    # FastAPI App
│   └── requirements.txt
│
└── app/               # React Frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   └── sections/
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL (optional, SQLite works for development)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (optional):
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Run the backend:
```bash
python run.py
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔑 Default Admin Account

Create an admin user by calling the API:

```bash
curl -X POST http://localhost:8000/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@foodexpress.com",
    "password": "admin123"
  }'
```

## 📁 Project Structure

### Backend (FastAPI)

| Component | Description |
|-----------|-------------|
| `models.py` | SQLAlchemy ORM models (User, Product, Category, Order, CartItem) |
| `schemas.py` | Pydantic validation schemas |
| `auth.py` | JWT authentication & password hashing |
| `routers/auth.py` | Login, register, user management |
| `routers/products.py` | Product CRUD with image upload |
| `routers/categories.py` | Category management |
| `routers/cart.py` | Shopping cart operations |
| `routers/orders.py` | Order placement & tracking |

### Frontend (React + TypeScript)

| Component | Description |
|-----------|-------------|
| `pages/Home.tsx` | Main landing page |
| `pages/Login.tsx` | User login |
| `pages/Register.tsx` | User registration |
| `pages/Orders.tsx` | Order history |
| `pages/AdminDashboard.tsx` | Admin panel |
| `context/AuthContext.tsx` | Authentication state |
| `context/CartContext.tsx` | Shopping cart state |
| `services/api.ts` | API client with Axios |

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `GET /auth/users` - List all users (admin)

### Products
- `GET /products/` - List all products
- `POST /products/` - Create product (admin)
- `PUT /products/{id}` - Update product (admin)
- `DELETE /products/{id}` - Delete product (admin)

### Categories
- `GET /categories/` - List all categories
- `POST /categories/` - Create category (admin)
- `PUT /categories/{id}` - Update category (admin)
- `DELETE /categories/{id}` - Delete category (admin)

### Cart
- `GET /cart/` - Get cart items
- `POST /cart/` - Add item to cart
- `PUT /cart/{id}` - Update item quantity
- `DELETE /cart/{id}` - Remove item from cart
- `DELETE /cart/` - Clear cart

### Orders
- `GET /orders/` - Get my orders
- `POST /orders/` - Place order
- `GET /orders/admin/orders` - Get all orders (admin)
- `PUT /orders/{id}/status` - Update order status (admin)
- `GET /orders/admin/stats` - Dashboard stats (admin)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **PostgreSQL** / **SQLite** - Database
- **JWT** - Authentication
- **Passlib** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Sonner** - Toast notifications

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with every API request
5. Protected routes check authentication

## 👤 User Roles

- **User**: Can browse products, add to cart, place orders, view order history
- **Admin**: All user features + manage products, categories, orders, view users

## 📱 Features

### Customer Features
- ✅ Browse menu with categories
- ✅ Search products
- ✅ Add to cart with quantity control
- ✅ Place orders with delivery details
- ✅ Order history & status tracking
- ✅ User profile management

### Admin Features
- ✅ Dashboard with statistics
- ✅ Product management (CRUD + image upload)
- ✅ Category management
- ✅ Order management with status updates
- ✅ User list view

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SECRET_KEY` - JWT secret

2. Deploy with gunicorn:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment (Vercel/Netlify)

1. Build the app:
```bash
npm run build
```

2. Set environment variable:
   - `VITE_API_URL` - Your backend API URL

## 📝 License

MIT License
