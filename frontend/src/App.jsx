import Home from "./pages/Home";
import { useEffect } from "react";
import api from "../utils/axios";
import { auth, googleProvider } from "../utils/firebase";
import getCurrentUser from "./features/getCurrentUser";

function App() {
  useEffect(() => {
    const getUser = async () => {
      await getCurrentUser();
}
getUser();
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}


export default App;
