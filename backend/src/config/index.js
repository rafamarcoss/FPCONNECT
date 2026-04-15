// Configuración de variables de entorno
import 'dotenv/config.js';

export const config = {
  // Servidor
  node_env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT) || 3000,
  log_level: process.env.LOG_LEVEL || 'info',

  // Base de datos
  database_url: process.env.DATABASE_URL,

  // JWT
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '7d',
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',

  // CORS
  cors_origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173'],

  // URLs
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Almacenamiento
  upload_dir: process.env.UPLOAD_DIR || './uploads',
  max_file_size: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB

  // Email (futuro)
  smtp_host: process.env.SMTP_HOST,
  smtp_port: parseInt(process.env.SMTP_PORT) || 587,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  sender_email: process.env.SENDER_EMAIL,

  // IA (futuro)
  openai_api_key: process.env.OPENAI_API_KEY,
  gemini_api_key: process.env.GEMINI_API_KEY,

  // Entorno check
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTesting: () => process.env.NODE_ENV === 'testing',
};

// Validar configuración crítica
if (!config.database_url) {
  throw new Error('❌ DATABASE_URL no está definida en .env');
}
if (!config.jwt_secret) {
  throw new Error('❌ JWT_SECRET no está definida en .env');
}
if (!config.refresh_token_secret) {
  throw new Error('❌ REFRESH_TOKEN_SECRET no está definida en .env');
}

export default config;
