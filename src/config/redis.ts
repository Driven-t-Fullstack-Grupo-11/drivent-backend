import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  console.log("connection redis...");
  await redis.connect();
})();

export default redis;
