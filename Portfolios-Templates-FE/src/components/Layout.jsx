import { Outlet, Link, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/portfolio/new") {
      const onNew = location.pathname === "/portfolio/new";
      const onEdit = /^\/portfolio\/[^/]+\/edit$/.test(location.pathname);
      return onNew || onEdit ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-gray-800";
    }
    return location.pathname === path ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-primary">
                Portfolio Templates
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link to="/dashboard" className={`${isActive("/dashboard")} px-3 py-2 font-medium transition`}>
                Dashboard
              </Link>
              <Link to="/profile" className={`${isActive("/profile")} px-3 py-2 font-medium transition`}>
                Profile
              </Link>
              <Link to="/portfolio/new" className={`${isActive("/portfolio/new")} px-3 py-2 font-medium transition`}>
                Portfolio
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} Portfolio Templates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
