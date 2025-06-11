# CredexisPro Backend

Node.js (TypeScript) + PostgreSQL backend for CredexisPro.

## Features
- Express.js API
- PostgreSQL database
- JWT authentication
- Role-based access control
- Zod validation
- API Key support

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values.
3. Run in development mode:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start production server:
   ```bash
   npm start
   ```

## Environment Variables
See `.env.example` for required variables.

## Folder Structure
- `src/` - TypeScript source code
- `dist/` - Compiled JavaScript

## Scripts
- `dev` - Start in development mode (with hot reload)
- `build` - Compile TypeScript
- `start` - Run compiled code

---

**Database:**
- Use PostgreSQL. Set `DATABASE_URL` in your `.env` file.

**API Docs:**
- (To be added: Swagger/OpenAPI) 