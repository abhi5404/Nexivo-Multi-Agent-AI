import Home from "./pages/Home";
import { useEffect } from "react";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCurrentUser = async () => {
      const data = await getCurrentUser();
      dispatch(setUserdata(data));
    };

    loadCurrentUser();
  }, [dispatch]);

  return (
    <div className="App">
      <Home />
    </div>
  );
}


export default App;
