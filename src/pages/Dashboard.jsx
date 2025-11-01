import { usePOS } from "../context/POSContext";
import { useAuth } from "../context/AuthContext";
import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiTrendingUp,
  FiAlertCircle,
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">{format(new Date(), "dd/MM/yyyy")}</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-2xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Ventas */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiShoppingCart className="text-primary-600" />
            Últimas Ventas
          </h2>
          <div className="space-y-3">
            {salesToday.slice(0, 5).length > 0 ? (
              salesToday.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Venta #{sale.id.toString().slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(sale.date), "HH:mm")} - {sale.cashier}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${sale.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {sale.paymentMethod}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No hay ventas hoy
              </p>
            )}
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-primary-600" />
            Productos Más Vendidos
          </h2>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 text-primary-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {product.totalQuantity} uds
                    </p>
                    <p className="text-sm text-green-600">
                      ${product.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No hay datos aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStock.length > 0 && (
        <div className="card bg-orange-50 border border-orange-200">
          <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
            <FiAlertCircle className="text-orange-600" />
            Alertas de Stock Bajo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg border border-orange-200"
              >
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">
                  {product.stock} unidades
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
