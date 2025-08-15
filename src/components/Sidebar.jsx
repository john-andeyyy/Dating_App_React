import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
    { name: "User Profile Management", path: "/Profile" },
    { name: "Home", path: "/Home" },
    { name: "Match List", path: "/MatchList" },
    { name: "Message", path: "/Message" },
];

export default function Sidebar() {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        closeSidebar();
    };

    const closeSidebar = () => {
        const checkbox = document.getElementById("sidebar-drawer");
        if (checkbox && checkbox.checked) {
            checkbox.checked = false;
        }
    };

    return (
        <div className="drawer lg:drawer-open z-50">
            <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main content */}
            <div className="drawer-content flex flex-col items-center py-6  ">
                <label
                    htmlFor="sidebar-drawer"
                    className="btn btn-square drawer-button lg:hidden text-xl mb-4 text-[#E2E2B6] bg-[#03346E] hover:bg-[#6EACDA] transition-colors"
                >
                    
                </label>
            </div>

            {/* Sidebar menu */}
            <div className="drawer-side">
                <label htmlFor="sidebar-drawer" className="drawer-overlay" aria-label="Close sidebar" />

                <ul className="menu w-64 flex flex-col min-h-full p-6 shadow-lg bg-darker text-[#E2E2B6]">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className="py-2 px-3 rounded hover:bg-[#E2E2B6] hover:text-[#03346E] transition-colors"
                                onClick={closeSidebar}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}

                    <li className="mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 rounded bg-[#6EACDA] text-[#021526] font-semibold hover:bg-[#03346E] hover:text-[#E2E2B6] transition-colors"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
