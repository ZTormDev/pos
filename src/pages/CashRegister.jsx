import { useState } from "react";
import { usePOS } from "../context/POSContext";
import { useAuth } from "../context/AuthContext";
import {
  FiDollarSign,
  FiUnlock,
  FiLock,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiUser,
} from "react-icons/fi";
import { format } from "date-fns";

const CashRegister = () => {
  const { user } = useAuth();
  const {
    cashRegister,
    openCashRegister,
    closeCashRegister,
    addCashMovement,
    cashMovements,
  } = usePOS();

  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [initialAmount, setInitialAmount] = useState("");
  const [closingAmount, setClosingAmount] = useState("");
  const [movementType, setMovementType] = useState("income");
  const [movementAmount, setMovementAmount] = useState("");
  const [movementDescription, setMovementDescription] = useState("");

  // Filtrar movimientos de la caja actual
  const currentMovements = cashRegister
    ? cashMovements.filter((m) => m.cashRegisterId === cashRegister.id)
    : [];

  const handleOpenCash = () => {
    if (initialAmount && parseFloat(initialAmount) >= 0) {
      openCashRegister(parseFloat(initialAmount), user.name);
      setInitialAmount("");
      setShowOpenModal(false);
    }
  };

  const handleCloseCash = () => {
    if (closingAmount && parseFloat(closingAmount) >= 0) {
      closeCashRegister(parseFloat(closingAmount), user.name);
      setClosingAmount("");
      setShowCloseModal(false);
    }
  };

  const handleAddMovement = () => {
    if (
      movementAmount &&
      parseFloat(movementAmount) > 0 &&
      movementDescription
    ) {
      addCashMovement({
        type: movementType,
        amount: parseFloat(movementAmount),
        description: movementDescription,
        cashier: user.name,
      });
      setMovementAmount("");
      setMovementDescription("");
      setShowMovementModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Caja Registradora
          </h1>
          <p className="text-gray-500 mt-1">Gestión de efectivo y turnos</p>
        </div>

        {!cashRegister ? (
          <button
            onClick={() => setShowOpenModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiUnlock />
            Abrir Caja
          </button>
        ) : (
          <button
            onClick={() => setShowCloseModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <FiLock />
            Cerrar Caja
          </button>
        )}
      </div>

      {/* Estado de la Caja */}
      <div className="card">
        {cashRegister ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <FiUnlock className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Caja Abierta
                  </h2>
                  <p className="text-sm text-gray-500">
                    Turno actual en proceso
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                Activa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FiDollarSign />
                  <p className="text-sm font-medium">Monto Inicial</p>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  ${cashRegister.initialAmount.toFixed(2)}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FiTrendingUp />
                  <p className="text-sm font-medium">Monto Actual</p>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  ${cashRegister.currentAmount.toFixed(2)}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <FiClock />
                  <p className="text-sm font-medium">Apertura</p>
                </div>
                <p className="text-lg font-semibold text-purple-700">
                  {format(new Date(cashRegister.openedAt), "HH:mm")}
                </p>
                <p className="text-xs text-purple-600">
                  {format(new Date(cashRegister.openedAt), "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-600" />
                <span className="text-gray-700">
                  Cajero: <strong>{cashRegister.cashier}</strong>
                </span>
              </div>
              <button
                onClick={() => setShowMovementModal(true)}
                className="btn-primary text-sm"
              >
                Registrar Movimiento
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 text-gray-400 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FiLock className="text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Caja Cerrada
            </h2>
            <p className="text-gray-500 mb-6">
              Abre la caja para comenzar a operar
            </p>
            <button
              onClick={() => setShowOpenModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiUnlock />
              Abrir Caja
            </button>
          </div>
        )}
      </div>

      {/* Movimientos */}
      {cashRegister && currentMovements.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Movimientos del Turno
          </h2>
          <div className="space-y-2">
            {currentMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      movement.type === "income" || movement.type === "opening"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {movement.type === "income" ||
                    movement.type === "opening" ? (
                      <FiTrendingUp />
                    ) : (
                      <FiTrendingDown />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {movement.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(movement.date), "HH:mm:ss")} -{" "}
                      {movement.cashier}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      movement.type === "income" || movement.type === "opening"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {movement.type === "income" || movement.type === "opening"
                      ? "+"
                      : "-"}
                    ${movement.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {movement.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Abrir Caja */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Abrir Caja
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Inicial
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="input-field text-lg"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Cajero:</strong> {user.name}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Hora:</strong> {format(new Date(), "HH:mm:ss")}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowOpenModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button onClick={handleOpenCash} className="flex-1 btn-primary">
                  Abrir Caja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cerrar Caja */}
      {showCloseModal && cashRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Cerrar Caja
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto Inicial:</span>
                  <span className="font-semibold">
                    ${cashRegister.initialAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto en Sistema:</span>
                  <span className="font-semibold text-green-600">
                    ${cashRegister.currentAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Real en Caja
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)}
                  className="input-field text-lg"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              {closingAmount && (
                <div
                  className={`p-4 rounded-lg ${
                    Math.abs(
                      parseFloat(closingAmount) - cashRegister.currentAmount
                    ) < 0.01
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p className="text-sm font-medium">Diferencia:</p>
                  <p
                    className={`text-2xl font-bold ${
                      Math.abs(
                        parseFloat(closingAmount) - cashRegister.currentAmount
                      ) < 0.01
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {(
                      parseFloat(closingAmount) - cashRegister.currentAmount
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCloseCash}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cerrar Caja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Movimiento */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Registrar Movimiento
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMovementType("income")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      movementType === "income"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FiTrendingUp className="text-2xl mx-auto mb-1 text-green-600" />
                    <p className="font-medium text-sm">Ingreso</p>
                  </button>
                  <button
                    onClick={() => setMovementType("expense")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      movementType === "expense"
                        ? "border-red-600 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FiTrendingDown className="text-2xl mx-auto mb-1 text-red-600" />
                    <p className="font-medium text-sm">Egreso</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={movementDescription}
                  onChange={(e) => setMovementDescription(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Motivo del movimiento..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMovementModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddMovement}
                  className="flex-1 btn-primary"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashRegister;
