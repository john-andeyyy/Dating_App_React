import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { logout } = useAuth();

    const logouthandler = () => {
        logout();
    };

    return (
        <div className="drawer lg:drawer-open z-50">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* Content area */}
            <div className="drawer-content flex flex-col items-center py-7 pt-2">
                <label htmlFor="my-drawer-2" className="btn drawer-button lg:hidden text-xl">
                    =
                </label>

            </div>

            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

                <ul className="menu bg-base-200 text-base-content w-64 p-4 flex flex-col min-h-full">
                    <li>
                        <Link to="/Profile" className="flex items-center gap-2">
                            User Profile Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/Home">Home</Link>
                    </li>
                    <li>
                        <Link to="/MatchList">Match List</Link>
                    </li>
                    <li>
                        <Link to="/Message">Message</Link>
                    </li>
                   

                    <div className="mt-auto">
                        <li>
                            <Link
                                to="/"
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                onClick={logouthandler}
                            >
                                Logout
                            </Link>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    );
}
