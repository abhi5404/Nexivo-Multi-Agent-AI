import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import api from "../../utils/axios";
import getCurrentUser from "../features/getCurrentUser";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const dispatch = useDispatch();

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await api.post("/api/auth/login", { token });
      const currentUser = await getCurrentUser();
      dispatch(
        setUserdata({
          ...currentUser,
          avatar: currentUser?.avatar || result.user.photoURL,
          photoURL: result.user.photoURL,
        }),
      );
    } catch (error) {
      console.error("Google Sign-In failed:", {
        code: error.code,
        message: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      await signOut(auth);
      dispatch(setUserdata(null));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
    <SideBar onLogin={googleLogin} onLogout={handleLogout} />
    <ChatArea />
    <Artifact />

    </div>
  );
}

export default Home;
