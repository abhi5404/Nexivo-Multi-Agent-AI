
import api from "../../utils/axios";

async function logOut() {
  const { data } = await api.post("/api/auth/logout");
  return data;
}

export default logOut;
