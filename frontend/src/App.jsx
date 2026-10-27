import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";



function App() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
     <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200" onClick={handleGoogleSignIn}>continue with google</button>
    </div>
  )
}

export default App
