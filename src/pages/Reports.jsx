import { usePOS } from "../context/POSContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiPackage,
} from "react-icons/fi";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const {
    sales,
    getSalesToday,
    getSalesThisWeek,
    getSalesThisMonth,
    getTopSellingProducts,
    products,
  } = usePOS();

  const salesToday = getSalesToday();
  const salesWeek = getSalesThisWeek();
  const salesMonth = getSalesThisMonth();
  const topProducts = getTopSellingProducts(5);

  // Estadísticas generales
  const stats = [
    {
      title: "Ventas Hoy",
      value: `$${salesToday.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      subtitle: `${salesToday.length} transacciones`,
      icon: FiDollarSign,
      color: "bg-green-500",
      change: "+12.5%",
    },
    {
      title: "Ventas Semana",
      value: `$${salesWeek.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      subtitle: `${salesWeek.length} transacciones`,
      icon: FiTrendingUp,
      color: "bg-blue-500",
      change: "+8.2%",
    },
    {
      title: "Ventas Mes",
      value: `$${salesMonth.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      subtitle: `${salesMonth.length} transacciones`,
      icon: FiShoppingCart,
      color: "bg-purple-500",
      change: "+15.3%",
    },
    {
      title: "Productos",
      value: products.length,
      subtitle: `${products.filter((p) => p.stock > 0).length} disponibles`,
      icon: FiPackage,
      color: "bg-orange-500",
      change: "+3",
    },
  ];

  // Datos para gráfico de ventas por día (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    subDays(new Date(), 6 - i)
  );
  const salesByDay = last7Days.map((day) => {
    const daySales = sales.filter(
      (sale) =>
        format(new Date(sale.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
    return {
      day: format(day, "EEE"),
      total: daySales.reduce((sum, sale) => sum + sale.total, 0),
      count: daySales.length,
    };
  });

  const salesChartData = {
    labels: salesByDay.map((d) => d.day),
    datasets: [
      {
        label: "Ventas ($)",
        data: salesByDay.map((d) => d.total),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfico de transacciones
  const transactionsChartData = {
    labels: salesByDay.map((d) => d.day),
    datasets: [
      {
        label: "Transacciones",
        data: salesByDay.map((d) => d.count),
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgb(16, 185, 129)",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfico de categorías
  const categoryData = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = 0;
      }
      categoryData[item.category] += item.price * item.quantity;
    });
  });

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(234, 179, 8, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Datos para métodos de pago
  const paymentMethods = {
    cash: sales.filter((s) => s.paymentMethod === "cash").length,
    card: sales.filter((s) => s.paymentMethod === "card").length,
  };

  const paymentChartData = {
    labels: ["Efectivo", "Tarjeta"],
    datasets: [
      {
        data: [paymentMethods.cash, paymentMethods.card],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(59, 130, 246, 0.8)"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Reportes y Análisis
        </h1>
        <p className="text-gray-500 mt-1">
          Visualización de ventas y estadísticas
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
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
            <div className="flex items-center gap-1">
              <span className="text-green-600 text-sm font-semibold">
                {stat.change}
              </span>
              <span className="text-gray-500 text-xs">vs semana pasada</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Día */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Ventas por Día (Últimos 7 días)
          </h2>
          <div className="h-80">
            <Bar data={salesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Transacciones */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Transacciones Diarias
          </h2>
          <div className="h-80">
            <Line data={transactionsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Ventas por Categoría */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Ventas por Categoría
          </h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Métodos de Pago
          </h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={paymentChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Top 5 Productos Más Vendidos
        </h2>
        <div className="space-y-3">
          {topProducts.map((product, index) => {
            const maxRevenue = Math.max(
              ...topProducts.map((p) => p.totalRevenue)
            );
            const percentage = (product.totalRevenue / maxRevenue) * 100;

            return (
              <div key={product.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 text-primary-600 font-bold rounded-full w-10 h-10 flex items-center justify-center">
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
                    <p className="font-bold text-primary-600">
                      ${product.totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.totalQuantity} vendidos
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen de Ventas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total de Ventas</h3>
          <p className="text-4xl font-bold">
            ${sales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}
          </p>
          <p className="text-blue-100 mt-2">Histórico completo</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Transacciones Totales</h3>
          <p className="text-4xl font-bold">{sales.length}</p>
          <p className="text-green-100 mt-2">Todas las operaciones</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Ticket Promedio</h3>
          <p className="text-4xl font-bold">
            $
            {sales.length > 0
              ? (
                  sales.reduce((sum, s) => sum + s.total, 0) / sales.length
                ).toFixed(2)
              : "0.00"}
          </p>
          <p className="text-purple-100 mt-2">Por transacción</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
