import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useAuthUser } from "./hooks/useAuthUser";
import PageLoader from "./components/PageLoader";
import AlbumDetails from "./pages/AlbumDetails";
import PlayList from "./pages/PlayList";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";

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
        <Route path="/album/:id"  element={isAuthenticated ? <AlbumDetails /> : <Navigate to="/login" />} />
        <Route path="/playlist" element={isAuthenticated ? <PlayList /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/" />} />

       
      </Routes>
      
      
    </>
  );
}

export default App;