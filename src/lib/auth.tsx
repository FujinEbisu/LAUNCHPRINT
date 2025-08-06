import { betterAuth } from "better-auth";

// Use dev database if NODE_ENV is development and DATABASE_URL_DEV exists
const databaseUrl = process.env.NODE_ENV === 'development' && process.env.DATABASE_URL_DEV
  ? process.env.DATABASE_URL_DEV
  : process.env.DATABASE_URL;

console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('- DATABASE_URL_DEV exists:', !!process.env.DATABASE_URL_DEV);
console.log('- Selected URL exists:', !!databaseUrl);
console.log('- Using database URL:', databaseUrl?.replace(/:[^:@]+@/, ':***@')); // Hide password

if (!databaseUrl) {
  throw new Error('No database URL found. Check DATABASE_URL or DATABASE_URL_DEV environment variables.');
}

export const auth = betterAuth({
  database: databaseUrl,
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "development-secret-key-change-in-production",
});
