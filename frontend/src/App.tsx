import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useAuthUser } from "./hooks/useAuthUser";
import PageLoader from "./components/PageLoader";
import SongDetails from "./pages/SongDetails";

function App() {
  const { isLoading, isAuthenticated } = useAuthUser();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
        <Route path="/song/:id" element={<SongDetails />} />
      </Routes>
      
      
    </>
  );
}

export default App;