import uuid = require("uuid");
import { redis } from '../../redis';
import { confirmationPrefix } from "../constants/redisPrefixes";

export const createConfirmationURL = async (userId: number) => {
  const token = uuid();
  await redis.set(`${confirmationPrefix} ${token}`, userId, "ex", 60 * 60 * 24);

  return `http://localhost:3000/user/confirm/${token}`;
}