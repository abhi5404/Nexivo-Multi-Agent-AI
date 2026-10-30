import api from "../../utils/axios";

const getCurrentUser = async () => {
    try {
        const { data } = await api.get("/api/me");
        console.log(data);
        return data.user;
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        return null;
    }
}

export default getCurrentUser;