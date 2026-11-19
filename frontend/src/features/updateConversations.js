import api from "../../utils/axios";

export const createConversation = async () => {
    try {
        const { data } = await api.get("/api/chat/create-conversation");
        console.log("Conversation created:", data);
        return data;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
    }
};

export const updateConversation = async (payload) => {
    try {
        const { data } = await api.post("/api/chat/update-conversation", payload);
        console.log("Conversation updated:", data);
        return data;
    } catch (error) {
        console.error("Error updating conversation:", error);
        throw error;
    }
};