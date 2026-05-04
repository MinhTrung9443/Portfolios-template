import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authAPI, userAPI, portfolioAPI, templateAPI } from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userResponse, portfoliosResponse, templatesResponse] = await Promise.all([
        userAPI.getProfile(),
        portfolioAPI.getPortfolios(),
        templateAPI.getAllTemplates(),
      ]);
      setUser(userResponse.data.data);
      setPortfolios(portfoliosResponse.data.data || []);
      setTemplates(templatesResponse.data.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // ignore network failures; local cleanup should still happen
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">{user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
          )}
          <div>
            <p className="text-lg font-medium">{user?.fullName || "Update your name"}</p>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-500 text-sm">{user?.bio || "No bio yet"}</p>
          </div>
        </div>
        <Link to="/profile" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 transition">
          Edit Profile
        </Link>
      </div>

      {/* Portfolios Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Portfolios</h2>
          <Link to="/portfolio/new" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            + New Portfolio
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <p className="text-gray-500">No portfolios yet. Create your first one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-semibold text-lg">{portfolio.title}</h3>
                <p className="text-gray-600 text-sm">{portfolio.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Link to={`/p/${portfolio.id}`} className="text-primary font-medium hover:underline">
                    View public page
                  </Link>
                  <Link to={`/portfolio/${portfolio.id}/edit`} className="text-slate-700 hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Templates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Templates</h2>
        {templates.length === 0 ? (
          <p className="text-gray-500">No templates available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
                <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">{template.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
