import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
    const key = `memory:${conversationId}`;
    const memory = await redis.get(key);
    if (memory) {
        return JSON.parse(memory);
    }
    const messages = await getMessages(conversationId);
    await redis.set(key, JSON.stringify(messages), 'EX', 24*3600); // Cache for 1 day
    return messages;
}

export const addMessage = async (conversationId, role, content) => {
    const key = `memory:${conversationId}`;
    const rawMessages = await redis.get(key);
    let messages = rawMessages ? JSON.parse(rawMessages) : [];
    messages.push({ role, content });
    if(messages.length > 100) {
        messages.shift(); // Remove the oldest message if we exceed 100
    }
    await redis.set(key, JSON.stringify(messages), 'EX', 24*3600); // Cache for 1 day
}