import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";

function App() {
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/auth/login", { token });
      console.log("Login response:", data);
    } catch (error) {
      console.error("Backend login failed:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      const token = await user.getIdToken();

      console.log("Google profile:", {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });

      await handleLogin(token);
    } catch (error) {
      console.error("Google Sign-In failed:", {
        code: error.code,
        message: error.message,
      });
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
     <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200" onClick={googleLogin}>continue with google</button>
    </div>
  )
}

export default App
