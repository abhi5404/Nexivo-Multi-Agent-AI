import Home from "./pages/Home";
import { useEffect } from "react";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import api from "../utils/axios";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCurrentUser = async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(setUserdata(null));
        return;
      }

      let profile = await getCurrentUser();

      if (!profile) {
        const token = await firebaseUser.getIdToken();
        const { data } = await api.post("/api/auth/login", { token });
        profile = data.user;
      }

      dispatch(
        setUserdata(
          profile
            ? {
                ...profile,
                name: profile.name || firebaseUser.displayName,
                email: profile.email || firebaseUser.email,
                avatar: profile.avatar || firebaseUser.photoURL,
                photoURL: profile.avatar || firebaseUser.photoURL,
              }
            : null,
        ),
      );
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      loadCurrentUser(firebaseUser).catch((error) => {
        console.error("Failed to restore authentication session:", error);
        dispatch(setUserdata(null));
      });
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="App">
      <Home />
    </div>
  );
}


export default App;
