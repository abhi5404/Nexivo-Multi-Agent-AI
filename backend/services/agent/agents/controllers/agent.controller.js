import { graph } from "../graph.js";
import axios from "axios";

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body;
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId , role: "user", content: prompt
        })
        const result = await graph.invoke({
            prompt,
            conversationId
        })
        const response = result.aiResponse
        return res.status(200).json({ response });
    } catch (error) {
        console.error("Error in agent controller:", error);
        return res.status(500).json({ message: "Error processing request" });
    }
}