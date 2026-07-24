/**
 * Centralized Environment Variable Configuration
 * 
 * WHY THIS FILE EXISTS:
 * - Prevents scattered import.meta.env calls across the codebase
 * - Provides default fallbacks so the app doesn't crash if a var is missing
 * - Documents every environment variable in one place
 * - Makes testing easier (you can mock this file instead of Vite's env)
 * 
 * VITE PREFIX RULE:
 * Vite only exposes env vars starting with VITE_ to client-side code.
 * Example: VITE_API_KEY works. API_KEY does not.
 */

export const env = {
  /** Base URL for API requests */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  
  /** Application name displayed in the UI */
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Internship Dashboard',
  
  /** Application version (useful for cache-busting and debugging) */
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  /** Current mode: 'development' | 'production' */
  MODE: import.meta.env.MODE,
  
  /** True when running locally (npm run dev) */
  IS_DEV: import.meta.env.DEV,
  
  /** True when built for production */
  IS_PROD: import.meta.env.PROD,
}

/**
 * ENVIRONMENT FILE HIERARCHY (Vite loads these automatically):
 * 
 * 1. .env                 → loaded in ALL modes
 * 2. .env.local           → loaded in ALL modes, ignored by Git (put secrets here)
 * 3. .env.[mode]          → loaded only in specific mode (e.g., .env.production)
 * 4. .env.[mode].local    → loaded only in specific mode, ignored by Git
 * 
 * SECURITY CHECKLIST:
 * ✅ .env and .env.local are in .gitignore
 * ✅ .env.example documents required variables without real values
 * ✅ No secrets (passwords, API keys, tokens) are committed to Git
 * ✅ Production values are set in the deployment platform (Vercel dashboard), not in code
 */