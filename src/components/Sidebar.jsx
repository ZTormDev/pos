import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiDollarSign,
  FiBarChart2,
  FiLock,
} from "react-icons/fi";

const Sidebar = () => {
  const { user } = useAuth();

  const allMenuItems = [
    {
      path: "/dashboard",
      icon: FiHome,
      label: "Dashboard",
      roles: ["admin", "cashier"],
    },
    {
      path: "/sales",
      icon: FiShoppingCart,
      label: "Ventas",
      roles: ["admin", "cashier"],
    },
    {
      path: "/inventory",
      icon: FiPackage,
      label: "Inventario",
      roles: ["admin"],
    },
    {
      path: "/cash-register",
      icon: FiDollarSign,
      label: "Caja",
      roles: ["admin", "cashier"],
    },
    {
      path: "/reports",
      icon: FiBarChart2,
      label: "Reportes",
      roles: ["admin"],
    },
  ];

  // Filtrar items según el rol del usuario
  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <FiShoppingCart className="text-3xl" />
          POS System
        </h1>
        <p className="text-sm text-gray-500 mt-1">Punto de Venta</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mostrar opciones bloqueadas para cajeros */}
        {user?.role === "cashier" && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 px-4 mb-2 font-semibold uppercase">
              Acceso Restringido
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60">
                <FiHome className="text-xl" />
                <span className="font-medium">Dashboard</span>
                <FiLock className="ml-auto text-sm" />
              </li>
              <li className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60">
                <FiPackage className="text-xl" />
                <span className="font-medium">Inventario</span>
                <FiLock className="ml-auto text-sm" />
              </li>
              <li className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60">
                <FiBarChart2 className="text-xl" />
                <span className="font-medium">Reportes</span>
                <FiLock className="ml-auto text-sm" />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
