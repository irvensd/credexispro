# CredExis Pro

A modern, feature-rich application for managing client relationships and tasks.

## Features

- 🔐 Secure authentication with JWT
- 👥 Client management
- ✅ Task tracking and management
- 📊 Dashboard with analytics
- 🎨 Customizable themes
- 📱 Responsive design
- 🌐 Internationalization support

## Tech Stack

- **Frontend**: React, TypeScript, Redux Toolkit
- **Styling**: Tailwind CSS, Framer Motion
- **Testing**: Jest, React Testing Library, Cypress
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod
- **UI Components**: Custom components with Headless UI

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/credexispro.git
   cd credexispro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_APP_NAME=CredExis Pro
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run cypress:open` - Open Cypress Test Runner
- `npm run cypress:run` - Run Cypress tests headlessly
- `npm run test:e2e` - Run E2E tests with dev server

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components and logic
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── store/         # Redux store configuration
├── styles/        # Global styles and Tailwind config
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Development Guidelines

### Code Style

- Follow the TypeScript style guide
- Use functional components with hooks
- Implement proper error handling
- Write unit tests for components
- Document complex logic

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write tests
4. Submit a pull request
5. Get code review
6. Merge to `main`

### Testing

- Write unit tests for components
- Add integration tests for features
- Include E2E tests for critical paths
- Maintain 80% code coverage

## API Documentation

### Authentication

```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": string,
  "password": string
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "name": string,
    "role": string
  }
}
```

### Clients

```typescript
GET /api/clients
Authorization: Bearer <token>

Response:
{
  "clients": Array<{
    "id": string,
    "name": string,
    "email": string,
    "phone": string,
    "status": string
  }>
}
```

### Tasks

```typescript
GET /api/tasks
Authorization: Bearer <token>

Response:
{
  "tasks": Array<{
    "id": string,
    "title": string,
    "description": string,
    "status": string,
    "dueDate": string,
    "clientId": string
  }>
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@credexispro.com or create an issue in the repository.
