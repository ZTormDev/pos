import { useAuth } from "../context/AuthContext";
import { usePOS } from "../context/POSContext";
import { FiUser, FiLogOut, FiBell, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cashRegister, getLowStockProducts } = usePOS();
  const [showNotifications, setShowNotifications] = useState(false);

  const lowStockProducts = getLowStockProducts(20);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {cashRegister ? (
              <span className="text-green-600 font-medium">✓ Caja Abierta</span>
            ) : (
              <span className="text-orange-600 font-medium">
                ⚠ Caja Cerrada
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiBell className="text-xl" />
              {lowStockProducts.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {lowStockProducts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">
                    Notificaciones
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-2">
                          <FiAlertCircle className="text-orange-500 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Stock bajo: {product.stock} unidades
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No hay notificaciones
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Usuario */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
            <div
              className={`${
                user?.role === "admin"
                  ? "bg-gradient-to-br from-primary-600 to-primary-700"
                  : "bg-gradient-to-br from-green-600 to-green-700"
              } text-white rounded-full p-2 shadow-md`}
            >
              <FiUser className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
              <p
                className={`text-xs font-medium capitalize ${
                  user?.role === "admin" ? "text-primary-600" : "text-green-600"
                }`}
              >
                {user?.role === "admin" ? "👑 Administrador" : "💼 Cajero"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="text-lg" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
