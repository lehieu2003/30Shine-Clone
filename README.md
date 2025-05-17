# Hair Cut Project

A full-stack application for managing hair salon appointments, services, and payments.

## Project Structure

```
hair-cut/
├── hair-cut-fe/         # Frontend React application
└── hair-cut-be/         # Backend Express.js API
```

## Frontend (hair-cut-fe)

### Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: TanStack Router
- **API Management**: TanStack Query
- **UI Components**:
  - Radix UI
  - Shadcn UI components
  - Ant Design
- **Form Management**: React Hook Form with Zod validation
- **Styling**: TailwindCSS
- **Data Visualization**: ApexCharts

### Setup and Installation

```bash
cd hair-cut-fe
npm install
npm run dev
```

### Available Commands

- `npm run dev` - Start development server on port 4000
- `npm start` - Alias for dev command
- `npm run build` - Build for production and run TypeScript compiler
- `npm run serve` - Preview the production build
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run check` - Format and lint the codebase

### Features

- Modern React with hooks
- Component-driven UI development
- Responsive design with TailwindCSS
- Type safety with TypeScript
- Form validation with Zod
- Drag and drop functionality with dnd-kit
- Data tables with TanStack Table
- Date handling with date-fns and Day Picker

## Backend (hair-cut-be)

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database ORM**: Prisma
- **Language**: JavaScript (ESM modules)
- **Validation**: Zod
- **Authentication**: JWT

### Setup and Installation

```bash
cd hair-cut-be
npm install
# Setup environment variables
cp .env.example .env
# Update database connection string in .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Available Commands

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically

### API Endpoints

- `GET /api` - API health check

#### Service Routes

- `GET /api/services` - List all salon services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Add a new service
- `PATCH /api/services/:id` - Update service details
- `DELETE /api/services/:id` - Remove a service

#### File Routes

- `GET /api/files` - List files
- `POST /api/files` - Upload files
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete a file

#### Step Routes

- `GET /api/steps` - List all steps
- `GET /api/steps/:id` - Get step details
- `POST /api/steps` - Create a new step
- `PATCH /api/steps/:id` - Update step information
- `DELETE /api/steps/:id` - Delete a step

#### Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh access token

#### Booking Routes

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id` - Update booking information
- `DELETE /api/bookings/:id` - Cancel booking

#### User Routes

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/profile` - Get current user profile

#### Report Routes

- `GET /api/reports` - Get reports
- `GET /api/reports/sales` - Get sales reports
- `GET /api/reports/bookings` - Get booking reports
- `GET /api/reports/services` - Get service usage reports

#### Product Routes

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Add a new product
- `PATCH /api/products/:id` - Update product details
- `DELETE /api/products/:id` - Remove a product

#### Cart Routes

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `POST /api/cart/checkout` - Checkout cart

#### Payment Routes

- `GET /api/payment` - Get payment history
- `POST /api/payment` - Process a new payment
- `GET /api/payment/:id` - Get payment details
- `POST /api/payment/verify` - Verify payment

### Features

- RESTful API design
- File uploads with Multer
- Static file serving
- JWT-based authentication
- Data validation with Zod
- Clean architecture with routes separation

## Development Workflow

1. Start the backend server: `cd hair-cut-be && npm run dev`
2. Start the frontend development server: `cd hair-cut-fe && npm run dev`
3. Backend runs on port 3111 by default
4. Frontend runs on port 4000

## Environment Variables

### Backend (.env)

```
PORT=3111
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret"
```

## Database Design

https://dbdiagram.io/d/haircut-main-67cd0602263d6cf9a0b63158
