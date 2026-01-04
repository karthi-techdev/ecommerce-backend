import 'dotenv/config'

// Helper function to get environment variable values with a fallback if not set or empty
function getEnv(variable: string, fallback: string): string {
  const value = process.env[variable];
  return value && value.trim().length > 0 ? value : fallback;
}

const isProduction = process.env.NODE_ENV === 'production';
const fallbackUri = "mongodb://localhost:27017/ecommerce";
const MONGO_URI = isProduction ? getEnv("MONGO_URI", fallbackUri) : getEnv("LOCAL_MONGO_URI", fallbackUri);

export const ENV = {
  PORT: Number(getEnv("PORT", "5000")),
  MONGO_URI,
  ADMIN_EMAIL: getEnv("ADMIN_EMAIL", ""),
  JWT_SECRET: getEnv("JWT_SECRET", ""),
  JWT_EXPIRE_TIME: getEnv("JWT_EXPIRE_TIME", "")

}
