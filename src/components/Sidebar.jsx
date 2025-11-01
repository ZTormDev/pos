import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/sales", icon: FiShoppingCart, label: "Ventas" },
    { path: "/inventory", icon: FiPackage, label: "Inventario" },
    { path: "/cash-register", icon: FiDollarSign, label: "Caja" },
    { path: "/reports", icon: FiBarChart2, label: "Reportes" },
  ];

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
      </nav>
    </aside>
  );
};

export default Sidebar;
