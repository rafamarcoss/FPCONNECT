// Logger simple pero efectivo
import config from './index.js';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const getLevel = (level) => {
  return levels[level] || 2;
};

const shouldLog = (level) => {
  const currentLevel = getLevel(config.log_level);
  return getLevel(level) <= currentLevel;
};

class Logger {
  error(message, error = null) {
    if (shouldLog('error')) {
      console.error(`${colors.red}[ERROR]${colors.reset}`, message, error || '');
    }
  }

  warn(message) {
    if (shouldLog('warn')) {
      console.warn(`${colors.yellow}[WARN]${colors.reset}`, message);
    }
  }

  info(message) {
    if (shouldLog('info')) {
      console.log(`${colors.green}[INFO]${colors.reset}`, message);
    }
  }

  debug(message, data = null) {
    if (shouldLog('debug')) {
      console.log(`${colors.blue}[DEBUG]${colors.reset}`, message, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  http(message) {
    if (shouldLog('debug')) {
      console.log(`${colors.cyan}[HTTP]${colors.reset}`, message);
    }
  }
}

export default new Logger();
