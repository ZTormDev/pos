import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiShoppingCart,
  FiUser,
  FiLock,
  FiAlertCircle,
  FiZap,
} from "react-icons/fi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = login(username, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("cajero");
      setPassword("cajero123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card de Login */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-fade-in border border-white/20">
          {/* Logo y Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform">
              <FiShoppingCart className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              POS System
            </h1>
            <p className="text-gray-600 mt-2 font-medium">
              Sistema de Punto de Venta
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-slide-in shadow-sm">
                <FiAlertCircle className="text-xl flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Usuario */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Credenciales de demo */}
          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiZap className="text-indigo-600" />
              <p className="text-sm text-gray-700 font-semibold">
                Acceso Rápido - Demo
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto shadow-md">
                    <FiUser className="text-white text-lg" />
                  </div>
                  <p className="font-bold text-gray-800 text-sm">
                    Administrador
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Full Access</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials("cajero")}
                className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-400 p-4 rounded-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-2 mx-auto shadow-md">
                    <FiShoppingCart className="text-white text-lg" />
                  </div>
                  <p className="font-bold text-gray-800 text-sm">Cajero</p>
                  <p className="text-xs text-gray-600 mt-1">Ventas</p>
                </div>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4 italic">
              Haz clic en un botón para autocompletar las credenciales
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6 font-medium drop-shadow-lg">
          © 2025 POS System - by ZTormDev
        </p>
      </div>
    </div>
  );
};

export default Login;
