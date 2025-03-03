# Smuv Test Application

A robust e-commerce platform built with TypeScript and Node.js, Redis and TypeDI for dependency injection, specializing in flash sales and product ordering. This application provides a secure and scalable solution for managing time-sensitive product, inventory management, and order processing.

## Features

- 🚀 TypeScript support
- 🔒 Authentication & Authorization
- 📦 Dependency Injection with TypeDI
- 🗄️ MongoDB with Mongoose
- 🔐 JWT-based authentication
- 🛡️ Security features (rate limiting, password hashing, etc.)

## Project Overview

This application is designed to handle high-concurrency scenarios typical in flash sales, with features including:

- **Flash Sale Management**: Create and manage time-limited product sales
- **Product Catalog**: Comprehensive product management system
- **Order Processing**: Secure and efficient order handling
- **Inventory Management**: Real-time stock tracking and updates
- **User Management**: Customer account and authentication system

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smuv-test
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=4000
```

Or if on a Linux Machine:
```bash
cp .env.example .env
```

## Environment Configuration

The application uses a settings file (`src/settings/index.ts`) to manage different configurations for development and production environments. The settings are determined by the `ENV` environment variable.

### Global Settings
The application has global settings that are shared across all environments:
```typescript
{
  APP_NAME: "smuv-test",
  APP_VERSION: "1.0.0",
  PORT: 4000,
  BCRYPT_SALT: 10,
  ACCESS_TOKEN_JWT_EXPIRES_IN: "1h",
  REFRESH_TOKEN_JWT_EXPIRES_IN: "30d",
  DEFAULT_DB_TOKEN_EXPIRY_DURATION: "5m",
  // ... other global settings
}
```

### Development Settings
```typescript
{
  HOST: "127.0.0.1",
  JWT_SECRET: "19d56917f78c581c15056ae050a6f2b790db82c5",
  MONGODB_URI: "mongodb://localhost:27017/smuv",
  BASE_URL: "http://localhost:3000",
  // ... other development-specific settings
}
```

### Production Settings
```typescript
{
  HOST: "0.0.0.0",
  MONGODB_URI: process.env.PROD_MONGO_URL,
  JWT_SECRET: process.env.SECRET_KEY,
  BASE_URL: process.env.BASE_URL,
  // ... other production-specific settings
}
```

The settings file automatically loads the appropriate configuration based on the environment. In development, it uses default values for local development, while in production, it uses environment variables for security and flexibility.

## Running the Application

### Development Mode
```bash
yarn start:dev
```
This will start the application in development mode with hot-reload enabled.

### Production Mode
```bash
yarn build
yarn start
```
This will build the TypeScript files and start the application in production mode.

## Available Scripts

- `yarn start:dev` - Start the application in development mode
- `yarn start` - Start the application in production mode
- `yarn build` - Build the TypeScript files
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

## Project Structure

```
src/
├── authentication/     # Authentication related utilities
├── controller/        # Route controllers
├── email-templates/   # Email templates
├── enums/            # TypeScript enums
├── libraries/        # Third-party library configurations
├── middleware/       # Express middleware
├── models/           # Mongoose models
│   ├── product.model.ts
│   ├── order.model.ts
│   ├── flash-sale.model.ts
│   └── user.model.ts
├── routers/          # Express routes
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── index.ts          # Application entry point
```

## API Endpoints

### Authentication
- POST `/auth/login` - User login (Rate limited: 10 requests per minute)
- POST `/auth/signup` - Register a new user (Rate limited: 10 requests per minute)

### Products
- GET `/product` - Get all products (Requires authentication)
- POST `/product` - Create new product (Requires authentication)

### Flash Sales
- POST `/flash-sale` - Start a new flash sale (Requires authentication)
- PUT `/flash-sale/:flashSaleId/end` - End a flash sale (Requires authentication)
- PUT `/flash-sale/:flashSaleId/restart` - Restart a flash sale (Requires authentication)
- GET `/flash-sale/current` - Get current flash sale products
- GET `/flash-sale/upcoming` - Get upcoming flash sale products

### Purchases
- POST `/purchase` - Purchase a product (Requires authentication, Rate limited: 10 requests per minute)

### User
- GET `/user` - Get current user session (Requires authentication)

### Leaderboard
- GET `/leaderboard` - Get user leaderboard

## Security Features

- Rate limiting to prevent brute force attacks
- Password hashing with bcrypt
- JWT-based authentication
- Secure cookie handling
- Input validation with Joi
- XSS protection
- CORS configuration
- Helmet security headers
- Distributed locking for inventory management
- Optimistic locking for concurrent order processing

## Testing

Run tests with:
```bash
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the maintainers.
