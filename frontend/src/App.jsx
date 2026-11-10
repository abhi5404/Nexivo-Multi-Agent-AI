import Home from "./pages/Home";
import { useEffect } from "react";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCurrentUser = async (firebaseUser) => {
      const data = await getCurrentUser();
      const profile = data || firebaseUser;

      dispatch(
        setUserdata(
          profile
            ? {
                ...profile,
                name: data?.name || firebaseUser?.displayName,
                email: data?.email || firebaseUser?.email,
                avatar: data?.avatar || firebaseUser?.photoURL,
                photoURL: data?.photoURL || firebaseUser?.photoURL,
              }
            : null,
        ),
      );
    };

    const unsubscribe = onAuthStateChanged(auth, loadCurrentUser);

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="App">
      <Home />
    </div>
  );
}


export default App;
