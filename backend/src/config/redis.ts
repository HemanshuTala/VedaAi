import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient> | null = null

export async function connectRedis() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  
  try {
    redisClient = createClient({
      url: redisUrl,
    })

    redisClient.on('error', (error) => {
      console.error('Redis Client Error:', error)
    })

    await redisClient.connect()
    console.log('Redis connection established')
    return redisClient
  } catch (error) {
    console.error('Redis connection error:', error)
    throw error
  }
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized')
  }
  return redisClient
}
