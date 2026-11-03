

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("User ID from header:", userId);
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
        const conversation = await Conversation.find({
            userId : userId 
        }).sort({ updatedAt: -1 });
        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Error fetching conversation" });
    }
};

export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error updating conversation:", error);
        res.status(500).json({ message: "Error updating conversation" });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { conversationId , role, content } = req.body;
        const message = await Message.create({
            conversationId,
            role,
            content
        })
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
        }).sort({ updatedAt: -1 });
        res.status(201).json(message);
    } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ message: "Error fetching message" });
    }
};
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";