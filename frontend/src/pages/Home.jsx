import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import api from "../../utils/axios";
import getCurrentUser from "../features/getCurrentUser";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await api.post("/api/auth/login", { token });
      dispatch(setUserdata(await getCurrentUser()));
    } catch (error) {
      console.error("Google Sign-In failed:", {
        code: error.code,
        message: error.message,
      });
    }
  };

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
    <SideBar />
    <ChatArea />
    <Artifact />



      {!user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-[17px] font-bold text-slate-100 tracking-tight">
                Welcome to Nexivo
            </h2>
            <p className="text-sm text-gray-400">Sign in to continue</p>
          </div>
          <button className="w-full flex items-center 
          justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90
           bg-white hover:bg-gray-200 transition-all duration-150 cursor-pointer" onClick={googleLogin}>
            <FcGoogle size={15} className="text-white" />
            Continue With Google
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default Home;
