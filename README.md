# 🚗 Vehicle Pricing & Estimation API

A scalable and production-ready RESTful API built with NestJS for estimating vehicle market prices and managing car sales reports.  
The application includes authentication, role-based authorization, advanced validation, database migrations, and a custom vehicle valuation engine powered by dynamic queries.

---

## ✨ Features

- 🔐 Cookie-based authentication & session management
- 👤 Role-based access control (**Admin/User**)
- 📊 Vehicle price estimation engine
- 📝 Car sales report management
- ✅ Request validation & response serialization
- 🛡️ Protected routes with Guards & custom decorators
- 🗄️ Automated database migrations with TypeORM
- 🧪 Unit, Integration & E2E testing
- ⚙️ Environment-based configuration support

---

# 🧰 Tech Stack

| Category       | Technology                             |
| -------------- | -------------------------------------- |
| Framework      | NestJS                                 |
| Language       | TypeScript                             |
| ORM            | TypeORM                                |
| Database       | SQLite / PostgreSQL                    |
| Validation     | `class-validator`, `class-transformer` |
| Authentication | `cookie-session`                       |
| Testing        | Jest                                   |
| Configuration  | `@nestjs/config`                       |

---

# 🏗️ Project Architecture

The application is divided into two main domain modules:

---

## 👥 Users Module (`UsersModule`)

Responsible for authentication, authorization, and user management.

### Core Features

- User registration & login
- Secure password hashing using `scrypt`
- Session-based authentication with `cookie-session`
- Custom `CurrentUser` decorator
- Automatic user injection middleware
- Protected routes using:
  - `AuthGuard`
  - `AdminGuard`

### Authentication Flow

```text
Client → Auth Controller → Auth Service → Users Service → Database
```

---

## 🚘 Reports Module (`ReportsModule`)

Handles vehicle reports and market value estimation.

### Core Features

- Submit vehicle sales reports
- Approve/reject reports (Admin only)
- Query-based valuation engine
- Geolocation-aware price estimation

### Vehicle Estimation Logic

The API estimates a vehicle’s market value by:

- Selecting only **approved reports**
- Comparing vehicles within:
  - ±3 years of manufacture
  - ±5 degrees latitude/longitude
- Taking the **top 3 closest matches**
- Calculating the average market price

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone https://github.com/andriibabiuk/nestjs-car-pricing-api.git

cd nestjs-car-pricing-api
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# ⚙️ Environment Configuration

Create environment configuration files in the project root:

```bash
.env.development
.env.test
.env.production
```

Example:

```env
DB_NAME=db.sqlite

COOKIE_KEY=your_secret_session_key
```

The application automatically selects the correct configuration file using:

```bash
NODE_ENV
```

---

# ▶️ Running the Application

## Development Mode

```bash
NODE_ENV=development npm run start:dev
```

## Production Mode

```bash
npm run build

NODE_ENV=production npm run start:prod
```

---

# 🗄️ Database & Migrations

The project uses a dynamic TypeORM configuration through:

```bash
ormconfig.js
```

### Migration Commands

## Generate Migration

```bash
npm run migration:generate -- name_of_migration
```

## Run Migrations

```bash
npm run migration:run
```

## Revert Last Migration

```bash
npm run migration:revert
```

---

# 🧪 Testing

The project includes:

- Unit Tests
- Integration Tests
- End-to-End (E2E) Tests

A dedicated testing database is automatically initialized during test execution.

## Run Unit Tests

```bash
npm run test
```

## Watch Mode

```bash
npm run test:watch
```

## Run E2E Tests

```bash
npm run test:e2e
```

---

# 📡 API Endpoints

# 🔐 Authentication

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| POST   | `/auth/signup`  | Register a new account         |
| POST   | `/auth/signin`  | Authenticate user              |
| POST   | `/auth/signout` | End current session            |
| GET    | `/auth/whoami`  | Get current authenticated user |
| GET    | `/auth/:id`     | Get user by ID                 |

---

# 🚗 Reports & Valuation

| Method | Endpoint       | Description                        |
| ------ | -------------- | ---------------------------------- |
| POST   | `/reports`     | Create vehicle report              |
| PATCH  | `/reports/:id` | Approve/reject report (Admin only) |
| GET    | `/reports`     | Get estimated vehicle price        |

### Estimation Query Parameters

```bash
make
model
year
mileage
lng
lat
```

---

# 📁 Project Structure

```plaintext
├── src/
│   ├── guards/                  # Auth & Admin guards
│   ├── interceptors/            # Serialization interceptors
│   ├── reports/                 # Reports module
│   ├── users/                   # Users & authentication module
│   ├── app.module.ts            # Root application module
│   └── main.ts                  # Application entry point
│
├── migrations/                  # Database migrations
├── test/                        # E2E test suites
├── ormconfig.js                 # Dynamic TypeORM config
└── package.json
```

---

# 🔒 Security

- Password hashing using `scrypt`
- Session-based authentication
- Protected endpoints with Guards
- DTO validation & sanitization
- Serialized responses to prevent sensitive data leakage
