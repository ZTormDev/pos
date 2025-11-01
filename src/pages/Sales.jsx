import { useState } from "react";
import { usePOS } from "../context/POSContext";
import { useAuth } from "../context/AuthContext";
import {
  FiSearch,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingCart,
  FiCreditCard,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";

const Sales = () => {
  const { products, createSale, cashRegister } = usePOS();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  // Obtener categorías únicas
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Actualizar cantidad
  const updateQuantity = (productId, change) => {
    const item = cart.find((i) => i.id === productId);
    const product = products.find((p) => p.id === productId);
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= product.stock) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Eliminar del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Calcular totales
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.16; // 16% IVA
  const total = subtotal + tax;

  // Procesar venta
  const processSale = () => {
    if (cart.length === 0) return;
    if (!cashRegister && paymentMethod === "cash") {
      alert("Debes abrir la caja antes de realizar ventas en efectivo");
      return;
    }
    setShowPaymentModal(true);
  };

  // Confirmar venta
  const confirmSale = () => {
    const paid =
      parseFloat(amountPaid) || (paymentMethod === "card" ? total : 0);

    if (paymentMethod === "cash" && paid < total) {
      alert("El monto pagado es insuficiente");
      return;
    }

    const saleData = {
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      amountPaid: paid,
      change: paymentMethod === "cash" ? paid - total : 0,
    };

    const newSale = createSale(saleData, user.name);
    setLastSale(newSale);

    // Limpiar y mostrar confirmación
    setCart([]);
    setAmountPaid("");
    setShowPaymentModal(false);
    setSaleCompleted(true);

    setTimeout(() => {
      setSaleCompleted(false);
      setLastSale(null);
    }, 5000);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💳 Punto de Venta
          </h1>
          <p className="text-gray-500">
            Gestiona tus transacciones de forma rápida y eficiente
          </p>
        </div>
        {!cashRegister && (
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400 text-orange-800 px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg animate-pulse">
            <FiDollarSign className="text-2xl" />
            <div>
              <p className="text-sm font-medium">Caja Cerrada</p>
              <p className="text-xs">Solo pagos con tarjeta</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Panel de Productos */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Búsqueda y Filtros */}
          <div className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-b-2 border-primary-200 space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-600 text-xl" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o código de barras..."
                className="w-full pl-12 pr-4 py-3 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-md"
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  {category === "all" ? "📦 Todos" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 text-left overflow-hidden transform hover:scale-105 border-2 border-transparent hover:border-primary-400"
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-semibold">
                          {product.category}
                        </span>
                        <FiPlus className="text-primary-600 text-lg opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-90 duration-300" />
                      </div>
                      <p className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Precio</p>
                          <p className="text-2xl font-bold text-primary-600">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Stock</p>
                          <p
                            className={`text-lg font-bold ${
                              product.stock <= 10
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {product.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <FiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No se encontraron productos
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Carrito */}
        <div className="flex flex-col bg-white rounded-xl shadow-xl border-2 border-primary-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                  <FiShoppingCart className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Carrito</h2>
                  <p className="text-sm text-primary-100">
                    {cart.length} productos
                  </p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                  title="Limpiar carrito"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm mb-1">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          ${item.price.toFixed(2)} c/u
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl border-2 border-gray-300 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2.5 hover:bg-primary-100 hover:text-primary-700 rounded-l-xl transition-all"
                      >
                        <FiMinus className="text-sm font-bold" />
                      </button>
                      <span className="px-4 font-bold text-lg text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2.5 hover:bg-primary-100 hover:text-primary-700 rounded-r-xl transition-all"
                      >
                        <FiPlus className="text-sm font-bold" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="font-bold text-primary-600 text-xl">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <FiShoppingCart className="text-4xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-semibold">Carrito vacío</p>
                <p className="text-gray-400 text-sm mt-1">
                  Agrega productos para comenzar
                </p>
              </div>
            )}
          </div>

          {/* Totales y Pago */}
          {cart.length > 0 && (
            <div className="border-t-2 border-gray-200 bg-white p-6 space-y-4 shadow-lg">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="font-semibold text-lg">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">IVA (16%):</span>
                  <span className="font-semibold text-lg">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t-2 border-gray-300 pt-3 mt-2">
                  <span>TOTAL:</span>
                  <span className="text-primary-600 text-3xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={processSale}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiCheck className="text-2xl" />
                Procesar Venta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slide-in overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FiCreditCard className="text-3xl" />
                Procesar Pago
              </h2>
              <p className="text-primary-100 mt-1">
                Completa la información de pago
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border-2 border-primary-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Total a Pagar
                </label>
                <div className="text-5xl font-black text-primary-600">
                  ${total.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    disabled={!cashRegister}
                    className={`group p-6 rounded-xl border-3 transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === "cash"
                        ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    } ${!cashRegister ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <FiDollarSign
                      className={`text-4xl mx-auto mb-2 ${
                        paymentMethod === "cash"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    />
                    <p className="font-bold text-lg">Efectivo</p>
                    {!cashRegister && (
                      <p className="text-xs text-red-600 mt-1">Caja cerrada</p>
                    )}
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`group p-6 rounded-xl border-3 transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <FiCreditCard
                      className={`text-4xl mx-auto mb-2 ${
                        paymentMethod === "card"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                    <p className="font-bold text-lg">Tarjeta</p>
                  </button>
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💵 Monto Recibido
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xl font-bold"
                    placeholder="0.00"
                    autoFocus
                  />
                  {amountPaid && parseFloat(amountPaid) >= total && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-400 animate-slide-up">
                      <p className="text-sm text-green-700 font-semibold mb-1">
                        💵 Cambio:
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        ${(parseFloat(amountPaid) - total).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all border-2 border-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSale}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ✓ Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de Venta Completada */}
      {saleCompleted && lastSale && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-5 rounded-2xl shadow-2xl animate-slide-in z-50 border-2 border-green-400 max-w-sm">
          <div className="flex items-start gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <FiCheck className="text-3xl" />
            </div>
            <div>
              <p className="font-bold text-xl mb-1">✅ ¡Venta Completada!</p>
              <div className="space-y-1 text-sm text-green-50">
                <p className="flex items-center justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-base ml-3">
                    ${lastSale.total.toFixed(2)}
                  </span>
                </p>
                {lastSale.change > 0 && (
                  <p className="flex items-center justify-between">
                    <span>Cambio:</span>
                    <span className="font-bold text-base ml-3">
                      ${lastSale.change.toFixed(2)}
                    </span>
                  </p>
                )}
                <p className="text-xs text-green-100 mt-2">
                  Método:{" "}
                  {lastSale.paymentMethod === "cash"
                    ? "💵 Efectivo"
                    : "💳 Tarjeta"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
