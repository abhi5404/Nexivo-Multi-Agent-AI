import axios from "axios";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId, agent: selectedAgent } = req.body;
        if (!prompt?.trim() || !conversationId) {
            return res.status(400).json({ message: "prompt and conversationId are required" });
        }
        await addMessage(conversationId, "user", prompt);
        const { graph } = await import("../graph/graph.js");
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId , role: "user", content: prompt
        })
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent: selectedAgent || "auto"
        })
        const response = result.aiResponse
        await addMessage(conversationId, "assistant", response);
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "assistant",
            content: response,
            images: result.images || []
        })
        return res.status(200).json({
            response: result.aiResponse,
            images: result.images || []
        });
    } catch (error) {
        console.error("Error in agent controller:", error);
        return res.status(500).json({ message: "Error processing request" });
    }
}