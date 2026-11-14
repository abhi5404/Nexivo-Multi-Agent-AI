import api from "../../utils/axios";

const getCurrentUser = async () => {
    try {
        const { data } = await api.get("/api/me");
        return data.user;
    } catch (error) {
        if (error.response?.status !== 401) {
            console.error("Failed to fetch current user:", error);
        }
        return null;
    }
}

export default getCurrentUser;