import { usePOS } from "../context/POSContext";
import { useAuth } from "../context/AuthContext";
import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiTrendingUp,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    getSalesToday,
    getSalesThisMonth,
    products,
    cashRegister,
    getTopSellingProducts,
    getLowStockProducts,
  } = usePOS();

  const salesToday = getSalesToday();
  const salesMonth = getSalesThisMonth();
  const topProducts = getTopSellingProducts(5);
  const lowStock = getLowStockProducts(20);

  const todayRevenue = salesToday.reduce((sum, sale) => sum + sale.total, 0);
  const monthRevenue = salesMonth.reduce((sum, sale) => sum + sale.total, 0);

  const stats = [
    {
      title: "Ventas Hoy",
      value: `$${todayRevenue.toFixed(2)}`,
      subtitle: `${salesToday.length} transacciones`,
      icon: FiDollarSign,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Ventas del Mes",
      value: `$${monthRevenue.toFixed(2)}`,
      subtitle: `${salesMonth.length} transacciones`,
      icon: FiTrendingUp,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Productos",
      value: products.length,
      subtitle: `${lowStock.length} con stock bajo`,
      icon: FiPackage,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Efectivo en Caja",
      value: cashRegister
        ? `$${cashRegister.currentAmount.toFixed(2)}`
        : "Cerrada",
      subtitle: cashRegister ? "Caja abierta" : "Abrir caja",
      icon: FiShoppingCart,
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500 flex items-center gap-2">
            <FiClock className="text-primary-600" />
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Bienvenido</p>
          <p className="text-lg font-bold">{user.name}</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Decoración de fondo */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
            ></div>

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-3 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.subtitle}</p>
              </div>
              <div
                className={`${stat.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="text-2xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Ventas */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <FiShoppingCart className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Últimas Ventas
              </h2>
              <p className="text-sm text-gray-500">Transacciones recientes</p>
            </div>
          </div>
          <div className="space-y-3">
            {salesToday.slice(0, 5).length > 0 ? (
              salesToday.slice(0, 5).map((sale, idx) => (
                <div
                  key={sale.id}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-primary-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 text-primary-600 font-bold rounded-lg w-10 h-10 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Venta #{sale.id.toString().slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {format(new Date(sale.date), "HH:mm")} - {sale.cashier}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      ${sale.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                      {sale.paymentMethod === "cash" ? "Efectivo" : "Tarjeta"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FiShoppingCart className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No hay ventas hoy</p>
              </div>
            )}
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
              <FiTrendingUp className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Top Productos</h2>
              <p className="text-sm text-gray-500">Los más vendidos</p>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-orange-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 font-bold rounded-lg w-12 h-12 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          ⭐
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">
                      {product.totalQuantity}{" "}
                      <span className="text-sm text-gray-500">uds</span>
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      ${product.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FiTrendingUp className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No hay datos aún</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStock.length > 0 && (
        <div className="relative bg-gradient-to-r from-orange-50 via-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-300 overflow-hidden">
          {/* Decoración de fondo animada */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 opacity-20 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-200 opacity-20 rounded-full -ml-24 -mb-24"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg animate-pulse">
                <FiAlertCircle className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-800">
                  ⚠️ Alertas de Stock
                </h2>
                <p className="text-sm text-orange-600">
                  {lowStock.length} productos necesitan reabastecimiento
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStock.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="group bg-white p-5 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-2">
                    <FiPackage className="text-orange-500 text-xl" />
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {product.stock === 0 ? "AGOTADO" : "BAJO"}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 mb-1">{product.name}</p>
                  <p className="text-xs text-gray-500 mb-3 bg-gray-100 px-2 py-1 rounded-full inline-block">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">Stock actual:</p>
                    <p
                      className={`text-2xl font-bold ${
                        product.stock === 0 ? "text-red-600" : "text-orange-600"
                      }`}
                    >
                      {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
