import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
    const links = {
        ADMIN: [
            { to: "/dashboard/admin", label: "Admin Dashboard" },
            { to: "/dashboard/manage-users", label: "Manage Users" },
            { to: "/dashboard/reports", label: "Reports" },
        ],
        USER: [
            { to: "/dashboard/user", label: "My Dashboard" },
            { to: "/dashboard/pets", label: "Browse Pets" },
            { to: "/dashboard/adoptions", label: "My Adoptions" },
        ],
        SHELTER: [
            { to: "/dashboard/shelter", label: "Shelter Dashboard" },
            { to: "/dashboard/manage-pets", label: "Manage Pets" },
            { to: "/dashboard/requests", label: "Adoption Requests" },
        ],
        VET: [
            { to: "/dashboard/vet", label: "Vet Dashboard" },
            { to: "/dashboard/health-records", label: "Health Records" },
        ]
    };

    return (
        <div className="w-64 bg-white shadow-md p-4">
            <h2 className="text-lg font-bold mb-4 capitalize">{role.toLowerCase()} Panel</h2>
            <ul className="space-y-2">
                {links[role]?.map((link) => (
                    <li key={link.to}>
                        <Link
                            to={link.to}
                            className="block py-2 px-3 rounded hover:bg-gray-200 text-gray-800"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
