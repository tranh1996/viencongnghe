# Environment Variables Setup

This document explains how to configure environment variables for the Viện Công Nghệ React application.

## React Environment Variable Conventions

React applications require environment variables to be prefixed with `REACT_APP_` to be accessible in the browser. These variables are embedded during the build process.

## Environment Files

The application uses the following environment files:

- `.env` - Default environment variables (not committed to git)
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.example` - Template file for setting up environment variables

## Required Environment Variables

### API Configuration

```bash
# API Base URL for backend services
REACT_APP_API_BASE_URL=https://admin-viencn.anf-technology.com/api/v1
```

### Optional Environment Variables

```bash
# Application name
REACT_APP_NAME=Viện Công Nghệ

# Application version
REACT_APP_VERSION=1.0.0

# Debug mode (true/false)
REACT_APP_DEBUG=false
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env`:**
   - Set `REACT_APP_API_BASE_URL` to your API endpoint
   - Add any additional environment variables as needed

3. **Restart your development server:**
   ```bash
   npm start
   ```

## Environment-Specific Configuration

### Development
- Use `.env.development` for development-specific settings
- Variables in `.env.development` override `.env`

### Production
- Use `.env.production` for production-specific settings
- Set these variables in your hosting platform (Vercel, Netlify, etc.)

### Testing
- Use `.env.test` for test-specific settings
- Variables in `.env.test` are used when running tests

## Environment Variable Priority

React loads environment variables in the following order (later files override earlier ones):

1. `.env`
2. `.env.local`
3. `.env.development` (when NODE_ENV=development)
4. `.env.development.local`
5. `.env.production` (when NODE_ENV=production)
6. `.env.production.local`

## Security Notes

- **Never commit `.env` files** to version control
- The `.env.example` file is safe to commit as it contains no sensitive data
- Environment variables are embedded in the build, so they are visible in the browser
- For server-side secrets, use server environment variables

## Using Environment Variables in Code

```typescript
// Import the centralized config
import { api, app } from './config/environment';

// Use the API base URL
const response = await fetch(`${api.baseUrl}/departments`);

// Use app configuration
console.log(`Running ${app.name} version ${app.version}`);
```

## Validation

The application automatically validates required environment variables on startup and will show warnings in the console if any are missing.

## Troubleshooting

1. **Environment variables not working:**
   - Make sure they are prefixed with `REACT_APP_`
   - Restart your development server
   - Check that the variable is defined in the correct `.env` file

2. **Build errors:**
   - Ensure all required environment variables are set
   - Check the console for validation warnings

3. **Production deployment:**
   - Set environment variables in your hosting platform
   - Rebuild the application after setting variables
