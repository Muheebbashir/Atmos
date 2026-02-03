import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => console.error("Redis error:", err));
    redisClient.on("connect", () => console.log("Redis connected"));

    await redisClient.connect();
  }
  return redisClient;
};

// OTP operations
export const saveOTP = async (key: string, otp: string, expiryMinutes: number = 10) => {
  const client = await getRedisClient();
  await client.setEx(key, expiryMinutes * 60, otp);
};

export const getOTP = async (key: string) => {
  const client = await getRedisClient();
  return await client.get(key);
};

export const deleteOTP = async (key: string) => {
  const client = await getRedisClient();
  await client.del(key);
};

// Attempt tracking
export const incrementAttempts = async (key: string) => {
  const client = await getRedisClient();
  const attempts = await client.incr(key);
  // Set expiry to 30 minutes if first attempt
  if (attempts === 1) {
    await client.expire(key, 30 * 60);
  }
  return attempts;
};

export const getAttempts = async (key: string) => {
  const client = await getRedisClient();
  const attempts = await client.get(key);
  return attempts ? parseInt(attempts) : 0;
};

export const deleteAttempts = async (key: string) => {
  const client = await getRedisClient();
  await client.del(key);
};

export const blockUser = async (key: string, blockMinutes: number = 15) => {
  const client = await getRedisClient();
  await client.setEx(key, blockMinutes * 60, "blocked");
};

export const isUserBlocked = async (key: string) => {
  const client = await getRedisClient();
  const blocked = await client.get(key);
  return blocked === "blocked";
};
