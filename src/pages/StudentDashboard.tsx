import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu, MenuItem } from "@/contexts/MenuContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "@/components/MenuItemCard";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, LogOut, History, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { menuItems, orders, placeOrder } = useMenu();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast({ title: "Added to cart", description: `${item.name} added successfully` });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    placeOrder({
      studentId: user!.id,
      studentName: user!.name,
      items: cart.map(({ item, quantity }) => ({ menuItem: item, quantity })),
      totalPrice: getTotalPrice(),
      status: "pending",
    });

    setCart([]);
    toast({ title: "Order placed!", description: "Your order has been sent to the shop" });
  };

  const myOrders = orders.filter((o) => o.studentId === user?.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-sm opacity-90">Student Portal</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">My Orders ({myOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({cart.length} items)
                  </h3>
                  <Button size="sm" variant="destructive" onClick={() => setCart([])}>
                    Clear Cart
                  </Button>
                </div>
                <div className="space-y-2 mb-4">
                  {cart.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.name} × {quantity}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">₹{item.price * quantity}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-bold">Total: ₹{getTotalPrice()}</span>
                  <Button onClick={handlePlaceOrder}>Place Order</Button>
                </div>
              </Card>
            )}

            {/* Menu Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <History className="h-6 w-6" />
              Order History
            </h2>
            {myOrders.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No orders yet. Start ordering!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "ready"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm flex justify-between">
                          <span>
                            {item.menuItem.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹{item.menuItem.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg text-primary">
                        ₹{order.totalPrice}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
