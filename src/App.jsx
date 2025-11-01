import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { POSProvider } from "./context/POSContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import CashRegister from "./pages/CashRegister";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";

function App() {
  return (
    <AuthProvider>
      <POSProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RoleBasedRedirect />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="sales" element={<Sales />} />
              <Route
                path="inventory"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route path="cash-register" element={<CashRegister />} />
              <Route
                path="reports"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </POSProvider>
    </AuthProvider>
  );
}

export default App;
