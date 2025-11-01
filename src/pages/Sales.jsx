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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Punto de Venta</h1>
        {!cashRegister && (
          <div className="bg-orange-100 border border-orange-300 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <FiDollarSign />
            <span className="text-sm font-medium">
              Caja cerrada - Solo tarjeta
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Panel de Productos */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          {/* Búsqueda y Filtros */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o código de barras..."
                className="w-full pl-10 input-field"
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category === "all" ? "Todos" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="card hover:shadow-lg transition-all duration-200 text-left group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </p>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <FiPlus className="text-primary-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Carrito */}
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-primary-600 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiShoppingCart />
              Carrito ({cart.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                    </div>
                    <p className="font-bold text-primary-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FiShoppingCart className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">El carrito está vacío</p>
              </div>
            )}
          </div>

          {/* Totales y Pago */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (16%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={processSale}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
              >
                <FiCheck />
                Procesar Venta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Procesar Pago
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total a Pagar
                </label>
                <div className="text-3xl font-bold text-primary-600">
                  ${total.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    disabled={!cashRegister}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "cash"
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${!cashRegister ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <FiDollarSign className="text-2xl mx-auto mb-1" />
                    <p className="font-medium text-sm">Efectivo</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "card"
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FiCreditCard className="text-2xl mx-auto mb-1" />
                    <p className="font-medium text-sm">Tarjeta</p>
                  </button>
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Recibido
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="input-field text-lg"
                    placeholder="0.00"
                    autoFocus
                  />
                  {amountPaid && parseFloat(amountPaid) >= total && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Cambio:</p>
                      <p className="text-xl font-bold text-green-600">
                        ${(parseFloat(amountPaid) - total).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button onClick={confirmSale} className="flex-1 btn-primary">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de Venta Completada */}
      {saleCompleted && lastSale && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl animate-slide-in z-50">
          <div className="flex items-start gap-3">
            <FiCheck className="text-2xl mt-1" />
            <div>
              <p className="font-bold text-lg">¡Venta Completada!</p>
              <p className="text-sm opacity-90">
                Total: ${lastSale.total.toFixed(2)}
              </p>
              {lastSale.change > 0 && (
                <p className="text-sm opacity-90">
                  Cambio: ${lastSale.change.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
