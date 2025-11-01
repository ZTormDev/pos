import { createContext, useContext, useState, useEffect } from "react";
import { format } from "date-fns";

const POSContext = createContext();

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOS debe ser usado dentro de un POSProvider");
  }
  return context;
};

// Datos iniciales de productos de demostración
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Coca Cola 600ml",
    category: "Bebidas",
    price: 2.5,
    stock: 150,
    barcode: "7501234567890",
  },
  {
    id: 2,
    name: "Pan Integral",
    category: "Panadería",
    price: 3.2,
    stock: 80,
    barcode: "7501234567891",
  },
  {
    id: 3,
    name: "Leche Entera 1L",
    category: "Lácteos",
    price: 4.5,
    stock: 100,
    barcode: "7501234567892",
  },
  {
    id: 4,
    name: "Arroz 1kg",
    category: "Abarrotes",
    price: 5.8,
    stock: 200,
    barcode: "7501234567893",
  },
  {
    id: 5,
    name: "Aceite Vegetal 1L",
    category: "Abarrotes",
    price: 8.9,
    stock: 75,
    barcode: "7501234567894",
  },
  {
    id: 6,
    name: "Huevos x12",
    category: "Lácteos",
    price: 4.2,
    stock: 120,
    barcode: "7501234567895",
  },
  {
    id: 7,
    name: "Agua 2L",
    category: "Bebidas",
    price: 1.5,
    stock: 300,
    barcode: "7501234567896",
  },
  {
    id: 8,
    name: "Galletas María",
    category: "Snacks",
    price: 2.8,
    stock: 90,
    barcode: "7501234567897",
  },
  {
    id: 9,
    name: "Yogurt Natural",
    category: "Lácteos",
    price: 3.5,
    stock: 60,
    barcode: "7501234567898",
  },
  {
    id: 10,
    name: "Jamón 500g",
    category: "Carnes",
    price: 12.5,
    stock: 45,
    barcode: "7501234567899",
  },
  {
    id: 11,
    name: "Queso 500g",
    category: "Lácteos",
    price: 15.0,
    stock: 35,
    barcode: "7501234567800",
  },
  {
    id: 12,
    name: "Cerveza 355ml",
    category: "Bebidas",
    price: 3.0,
    stock: 200,
    barcode: "7501234567801",
  },
];

export const POSProvider = ({ children }) => {
  // Estado de productos
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("pos_products");
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });

  // Estado de ventas
  const [sales, setSales] = useState(() => {
    const stored = localStorage.getItem("pos_sales");
    return stored ? JSON.parse(stored) : [];
  });

  // Estado de caja registradora
  const [cashRegister, setCashRegister] = useState(() => {
    const stored = localStorage.getItem("pos_cashRegister");
    return stored ? JSON.parse(stored) : null;
  });

  // Movimientos de efectivo
  const [cashMovements, setCashMovements] = useState(() => {
    const stored = localStorage.getItem("pos_cashMovements");
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem("pos_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("pos_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    if (cashRegister) {
      localStorage.setItem("pos_cashRegister", JSON.stringify(cashRegister));
    } else {
      localStorage.removeItem("pos_cashRegister");
    }
  }, [cashRegister]);

  useEffect(() => {
    localStorage.setItem("pos_cashMovements", JSON.stringify(cashMovements));
  }, [cashMovements]);

  // ========== FUNCIONES DE PRODUCTOS ==========
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      barcode: product.barcode || `750${Date.now().toString().slice(-10)}`,
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateStock = (productId, quantity) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      )
    );
  };

  // ========== FUNCIONES DE VENTAS ==========
  const createSale = (saleData, cashierName) => {
    const newSale = {
      id: Date.now(),
      date: new Date().toISOString(),
      cashier: cashierName,
      items: saleData.items,
      subtotal: saleData.subtotal,
      tax: saleData.tax,
      total: saleData.total,
      paymentMethod: saleData.paymentMethod,
      amountPaid: saleData.amountPaid,
      change: saleData.change,
      cashRegisterId: cashRegister?.id,
    };

    // Actualizar stock de productos
    saleData.items.forEach((item) => {
      updateStock(item.id, -item.quantity);
    });

    // Agregar venta
    setSales([newSale, ...sales]);

    // Actualizar efectivo en caja si el pago fue en efectivo
    if (saleData.paymentMethod === "cash" && cashRegister) {
      setCashRegister({
        ...cashRegister,
        currentAmount: cashRegister.currentAmount + saleData.total,
      });
    }

    return newSale;
  };

  // ========== FUNCIONES DE CAJA ==========
  const openCashRegister = (initialAmount, cashierName) => {
    const newRegister = {
      id: Date.now(),
      cashier: cashierName,
      openedAt: new Date().toISOString(),
      initialAmount,
      currentAmount: initialAmount,
      status: "open",
    };
    setCashRegister(newRegister);

    // Registrar movimiento
    addCashMovement({
      type: "opening",
      amount: initialAmount,
      description: "Apertura de caja",
      cashier: cashierName,
    });

    return newRegister;
  };

  const closeCashRegister = (closingAmount, cashierName) => {
    if (!cashRegister) return null;

    const closedRegister = {
      ...cashRegister,
      closedAt: new Date().toISOString(),
      closingAmount,
      difference: closingAmount - cashRegister.currentAmount,
      status: "closed",
    };

    // Registrar movimiento
    addCashMovement({
      type: "closing",
      amount: closingAmount,
      description: "Cierre de caja",
      cashier: cashierName,
    });

    setCashRegister(null);
    return closedRegister;
  };

  const addCashMovement = (movement) => {
    const newMovement = {
      id: Date.now(),
      ...movement,
      date: new Date().toISOString(),
      cashRegisterId: cashRegister?.id,
    };
    setCashMovements([newMovement, ...cashMovements]);

    // Actualizar monto en caja si está abierta
    if (
      cashRegister &&
      (movement.type === "income" || movement.type === "expense")
    ) {
      const amount =
        movement.type === "income" ? movement.amount : -movement.amount;
      setCashRegister({
        ...cashRegister,
        currentAmount: cashRegister.currentAmount + amount,
      });
    }

    return newMovement;
  };

  // ========== FUNCIONES DE REPORTES ==========
  const getSalesToday = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return sales.filter(
      (sale) => format(new Date(sale.date), "yyyy-MM-dd") === today
    );
  };

  const getSalesThisWeek = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sales.filter((sale) => new Date(sale.date) >= weekAgo);
  };

  const getSalesThisMonth = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === month && saleDate.getFullYear() === year;
    });
  };

  const getTopSellingProducts = (limit = 5) => {
    const productSales = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            ...item,
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }
        productSales[item.id].totalQuantity += item.quantity;
        productSales[item.id].totalRevenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  };

  const getLowStockProducts = (threshold = 20) => {
    return products.filter((p) => p.stock <= threshold);
  };

  const getTotalRevenue = () => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const value = {
    // Estado
    products,
    sales,
    cashRegister,
    cashMovements,

    // Funciones de productos
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,

    // Funciones de ventas
    createSale,

    // Funciones de caja
    openCashRegister,
    closeCashRegister,
    addCashMovement,

    // Funciones de reportes
    getSalesToday,
    getSalesThisWeek,
    getSalesThisMonth,
    getTopSellingProducts,
    getLowStockProducts,
    getTotalRevenue,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};
