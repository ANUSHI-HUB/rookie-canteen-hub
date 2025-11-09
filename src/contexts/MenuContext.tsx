import { createContext, useContext, useState, ReactNode } from "react";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  shopId: string;
  shopName: string;
  available: boolean;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  items: { menuItem: MenuItem; quantity: number }[];
  totalPrice: number;
  status: "pending" | "preparing" | "ready" | "completed";
  timestamp: Date;
}

interface MenuContextType {
  menuItems: MenuItem[];
  orders: Order[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  placeOrder: (order: Omit<Order, "id" | "timestamp">) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Mock menu items
const initialMenuItems: MenuItem[] = [
  { id: "1", name: "Veg Burger", price: 50, category: "Burgers", shopId: "2", shopName: "Jane's Shop", available: true },
  { id: "2", name: "Cheese Sandwich", price: 40, category: "Sandwiches", shopId: "2", shopName: "Jane's Shop", available: true },
  { id: "3", name: "Cold Coffee", price: 35, category: "Beverages", shopId: "2", shopName: "Jane's Shop", available: true },
  { id: "4", name: "Masala Dosa", price: 60, category: "South Indian", shopId: "2", shopName: "Jane's Shop", available: true },
  { id: "5", name: "Samosa", price: 20, category: "Snacks", shopId: "2", shopName: "Jane's Shop", available: true },
];

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [orders, setOrders] = useState<Order[]>([]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: String(Date.now()),
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const placeOrder = (order: Omit<Order, "id" | "timestamp">) => {
    const newOrder: Order = {
      ...order,
      id: String(Date.now()),
      timestamp: new Date(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return (
    <MenuContext.Provider value={{ menuItems, orders, addMenuItem, placeOrder, updateOrderStatus }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within MenuProvider");
  return context;
}
