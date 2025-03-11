# Wino NestJS API - Project And Task Management

A robust REST API built with NestJS that provides a complete backend architecture for project and task management. Features include JWT authentication, image handling with Cloudinary, and MongoDB database integration.

## Key Features

- Project Management

  - Create and manage multiple projects
  - Assign team members to projects
  - Track project progress and status
  - Dashboard with project statistics

- Task Management

  - Create, update, and delete tasks
  - Assign tasks to team members
  - Track task status and completion
  - Columns for task status

- User Management
  - User authentication with JWT
  - Role-based access control
  - Team collaboration features
  - User profiles with avatars (Cloudinary integration)

## Main Technologies

- NestJS
- MongoDB
- Docker
- Cloudinary (for image storage)
- JWT for authentication
- Swagger for API documentation

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose
- MongoDB (local or via Docker)

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/AlexanderOI/wino-nextjs
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

## Starting the Project

1. Start the database with Docker:

```bash
docker-compose up -d
```

2. Start the development server:

```bash
pnpm start:dev
```

The server will be available at `http://localhost:8000`

## Available Scripts

- `pnpm start:dev`: Starts the server in development mode with hot-reload
- `pnpm build`: Builds the project
- `pnpm start:prod`: Starts the server in production mode
- `pnpm format`: Formats the code

## API Documentation

API documentation is available at the `/api` route once the server is running.

## Features

- JWT Authentication
- Protected Routes
- Roles and Permissions
- File handling with Cloudinary
- Data validation with class-validator
- Automatic documentation with Swagger
- Code formatting with Prettier
