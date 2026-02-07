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
import ForgotPassword from "./pages/ForgotPassword";
import SongDetails from "./pages/SongDetails";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Search from "./pages/Search";
import Player from "./components/Player";

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
        <Route path="/song/:id"  element={isAuthenticated ? <SongDetails /> : <Navigate to="/login" />} />
        <Route path="/playlist" element={isAuthenticated ? <PlayList /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Player persists across all pages */}
      {isAuthenticated && <Player />}
    </>
  );
}

export default App;