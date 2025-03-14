# Wino NestJS API - Project And Task Management

A robust REST API built with NestJS that provides a complete backend architecture for project and task management. Features include JWT authentication, image handling with Cloudinary, and MongoDB database integration.

## 🚀 Features

- JWT Authentication
- Protected Routes
- Roles and Permissions
- File handling with Cloudinary
- Data validation with class-validator
- Automatic documentation with Swagger
- Code formatting with Prettier

## 🛠️ Main Technologies

- NestJS
- MongoDB
- Docker
- Cloudinary (for image storage)
- JWT for authentication
- Swagger for API documentation

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/AlexanderOI/wino-nestjs.git
cd wino-nestjs
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Complete the environment variables in the `.env` file:

- `JWT_SECRET_ACCESS`: Secret key for JWT access tokens
- `JWT_SECRET_REFRESH`: Secret key for JWT refresh tokens
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API Key
- `CLOUDINARY_API_SECRET`: Cloudinary API Secret
- `MONGO_URI`: MongoDB connection URI (default: mongodb://localhost:27017/wino-db)

API documentation is available at the `/api` route once the server is running.

The frontend can be found in the [wino-nextjs](https://github.com/AlexanderOI/wino-nextjs) repository

## 🚀 Local Development

1. Start the database with Docker:

```bash
docker-compose up -d
```

2. Start the development server:

```bash
pnpm start:dev
```

3. Init data in the database with the following route:

```bash
http://localhost:8000/api/v1/data/create
```

Main user credentials:

> Email: admin@sistema.com
> UserName: admin
> Password: 1234

All users passwords are 1234

The server will be available at `http://localhost:8000`

## 🏗️ Production Build

```bash
pnpm build
```

```bash
pnpm start:prod
```

## 📦 📝 Available Scripts

- `pnpm start:dev`: Starts the server in development mode with hot-reload
- `pnpm build`: Builds the project
- `pnpm start:prod`: Starts the server in production mode
- `pnpm format`: Formats the code
