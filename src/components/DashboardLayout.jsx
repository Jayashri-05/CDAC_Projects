import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("userName") || localStorage.getItem("email") || "User";

    const validRoles = ["user", "shelter"];
    const isValidRoute =
      storedRole && validRoles.includes(storedRole) && location.pathname.startsWith(`/dashboard/${storedRole}`);

    if (!storedRole || !validRoles.includes(storedRole)) {
      navigate("/login");
    } else if (!isValidRoute) {
      navigate(`/dashboard/${storedRole}`);
    } else {
      setValid(true);
      setRole(storedRole);
      setUserName(storedUserName);
    }
  }, [navigate, location.pathname]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getSidebarItems = (role) => {
    const baseItems = [
      { label: "Dashboard Home", onClick: () => navigate(`/dashboard/${role}`), icon: "🏠" },
    ];

    const roleSpecificItems = {
      user: [
        { label: "Browse Pets", onClick: () => navigate("/dashboard/user/pets"), icon: "🔍" },
        { label: "My Applications", onClick: () => navigate("/dashboard/user/applications"), icon: "📝" },
        { label: "Favorites", onClick: () => navigate("/dashboard/user/favorites"), icon: "❤️" },
      ],
      shelter: [
        { label: "My Pets", onClick: () => navigate("/dashboard/shelter/pets"), icon: "🐕" },
        { label: "Add Pet", onClick: () => navigate("/dashboard/shelter/add-pet"), icon: "➕" },
        { label: "Applications", onClick: () => navigate("/dashboard/shelter/applications"), icon: <FaClipboardList /> },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[role] || [])];
  };

  if (!valid) return null;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">🐾</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pet Adoption</h2>
              <p className="text-blue-100 text-sm capitalize">{role}</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{userName}</p>
              <p className="text-gray-500 text-xs capitalize">{role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {getSidebarItems(role).map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}

            {/* Logout */}
            <li className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                  🚪
                </span>
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Outlet only — no hardcoded header */}
      <main className="flex-1 w-full min-h-screen bg-white overflow-auto">
        <div className="p-6 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
