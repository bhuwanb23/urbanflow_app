const logger = require('./logger');

class TokenBlacklist {
  constructor(cleanupIntervalMs = 60 * 60 * 1000) {
    this.blacklist = new Map();
    this.interval = setInterval(() => this.cleanup(), cleanupIntervalMs);
  }

  add(token, expiresAt) {
    this.blacklist.set(token, expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  has(token) {
    const expiry = this.blacklist.get(token);
    if (!expiry) return false;
    if (expiry < Date.now()) {
      this.blacklist.delete(token);
      return false;
    }
    return true;
  }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    for (const [token, expiry] of this.blacklist) {
      if (expiry < now) {
        this.blacklist.delete(token);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      logger.debug(`TokenBlacklist: cleaned ${cleaned} expired entries`);
    }
  }

  stopCleanup() {
    clearInterval(this.interval);
  }
}

module.exports = new TokenBlacklist();
