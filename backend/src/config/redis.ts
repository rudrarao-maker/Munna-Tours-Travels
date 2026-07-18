import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let isConnected = false;
let hasLoggedError = false;

/**
 * Initialize Redis connection.
 * Gracefully falls back if Redis is unavailable — the app works without it.
 */
export async function initRedis(): Promise<void> {
  try {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({ 
      url,
      socket: {
        reconnectStrategy: false
      }
    });

    redisClient.on('error', (err) => {
      if (!hasLoggedError) {
        console.warn('Redis connection error (caching disabled):', err.message);
        hasLoggedError = true;
      }
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis connected — caching enabled');
      isConnected = true;
    });

    await redisClient.connect();
  } catch (error: any) {
    console.warn('Redis unavailable — running without cache:', error.message);
    redisClient = null;
    isConnected = false;
  }
}

/**
 * Get cached data by key.
 * Returns parsed JSON data or null if not found / Redis unavailable.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redisClient || !isConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data as string) : null;
  } catch {
    return null;
  }
}

/**
 * Set cache with a TTL (time-to-live) in seconds.
 */
export async function setCache(key: string, data: any, ttlSeconds: number): Promise<void> {
  if (!redisClient || !isConnected) return;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch {
    // Silently fail — caching is best-effort
  }
}

/**
 * Invalidate (delete) a specific cache key.
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!redisClient || !isConnected) return;
  try {
    await redisClient.del(key);
  } catch {
    // Silently fail
  }
}

/**
 * Invalidate all keys matching a pattern (e.g., 'routes:*').
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (!redisClient || !isConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch {
    // Silently fail
  }
}
