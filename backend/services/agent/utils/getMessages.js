import axios from 'axios';

export const getMessages = async (conversationId) => {
    try {
        const response = await axios.get(
            `${process.env.CHAT_SERVICE}/get-messages/${conversationId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
}