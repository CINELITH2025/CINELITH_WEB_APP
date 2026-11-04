import dotenv from "dotenv";
dotenv.config();

export const validateEnv = () => {
  const isProd = process.env.NODE_ENV === "production";
  const warnings = [];
  const errors = [];

  if (!process.env.PORT) {
    process.env.PORT = "5050";
  }

  if (!process.env.JWT_SECRET) {
    if (isProd) {
      errors.push("JWT_SECRET is missing. Cannot start in production without a secure JWT_SECRET.");
    } else {
      process.env.JWT_SECRET = "cinelith_dev_jwt_secret_insecure_local_only";
      warnings.push("JWT_SECRET is not set. Using dev fallback. Set a secure 64-char secret in production.");
    }
  } else if (process.env.JWT_SECRET === "secret_key" && isProd) {
    errors.push("JWT_SECRET is set to the default insecure value ('secret_key'). Generate a secure secret for production.");
  }

  if (!process.env.MONGO_URI) {
    warnings.push("MONGO_URI is missing. Server will run in degraded offline catalog mode.");
  }

  warnings.forEach((msg) => console.warn(`⚠️ [ENV WARNING] ${msg}`));
  
  if (errors.length > 0) {
    errors.forEach((msg) => console.error(`❌ [ENV ERROR] ${msg}`));
    throw new Error("Invalid Environment Configuration: \n" + errors.join("\n"));
  }
};
