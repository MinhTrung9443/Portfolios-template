import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authAPI } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import SharedPortfolio from "./pages/SharedPortfolio";
import Layout from "./components/Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      try {
        const refreshResponse = await authAPI.refreshToken();
        const nextAccessToken = refreshResponse.data?.data?.accessToken;
        if (nextAccessToken) {
          localStorage.setItem("accessToken", nextAccessToken);
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/verify" element={<VerifyOtp setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="portfolio/:portfolioId/edit" element={<Portfolio />} />
          <Route path="portfolio/new" element={<Portfolio />} />
        </Route>

        <Route path="/p/:portfolioId" element={<SharedPortfolio />} />
        <Route path="/shared/:sharedId" element={<SharedPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
