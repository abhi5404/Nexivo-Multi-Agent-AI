import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const dispatch = useDispatch();
  const signingIn = useRef(false);

  const googleLogin = async () => {
    if (signingIn.current) return;

    signingIn.current = true;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In failed:", {
        code: error.code,
        message: error.message,
      });
    } finally {
      signingIn.current = false;
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
