
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("User ID from header:", userId);
        if (!userId) {
            return res.status(400).json({ message: "Missing user ID" });
        }
        const conversation = await Conversation.create({
            userId : userId 
        });
        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ message: "Error creating conversation" });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("User ID from header:", userId);
        if (!userId) {
            return res.status(400).json({ message: "Missing user ID" });
        }
        const conversation = await Conversation.find({
            userId : userId 
        }).sort({ updatedAt: -1 });
        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Error fetching conversation" });
    }
};

export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body;
        const userId = req.headers["x-user-id"];
        const normalizedTitle = typeof title === "string" ? title.trim() : "";

        if (!id || !normalizedTitle) {
            return res.status(400).json({ message: "id and title are required" });
        }
        if (!userId) {
            return res.status(400).json({ message: "Missing user ID" });
        }

        const conversation = await Conversation.findOneAndUpdate(
            { _id: id, userId },
            { title: normalizedTitle.slice(0, 48) },
            { new: true, runValidators: true }
        );
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error updating conversation:", error);
        res.status(500).json({ message: "Error updating conversation" });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { conversationId , role, content } = req.body;
        if (!conversationId || !role || typeof content !== "string") {
            return res.status(400).json({ message: "conversationId, role and content are required" });
        }
        const message = await Message.create({
            conversationId,
            role,
            content
        });
        await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });
        res.status(201).json(message);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ message: "Error saving message" });
    }
};



export const getMessage = async (req, res) => {
    try {
      
        const message = await Message.find({
            conversationId : req.params.conversationId
        }).sort({ createdAt: 1 });
        res.status(200).json(message);
    } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ message: "Error fetching message" });
    }
};