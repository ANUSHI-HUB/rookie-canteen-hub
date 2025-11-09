import { useAuth } from "@/contexts/AuthContext";
import { useMenu } from "@/contexts/MenuContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Users, Store, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { menuItems, orders } = useMenu();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const uniqueShops = new Set(menuItems.map((item) => item.shopId)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm opacity-90">Welcome, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">System Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-primary">{orders.length}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
          </Card>

          <Card className="p-6 hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Store className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-3xl font-bold text-secondary">{uniqueShops}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Active Shops</h3>
          </Card>

          <Card className="p-6 hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <span className="text-3xl font-bold text-accent">{menuItems.length}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Menu Items</h3>
          </Card>

          <Card className="p-6 hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-primary">₹{totalRevenue}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.slice(-5).reverse().map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.studentName} • {order.items.length} items • ₹{order.totalPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {order.timestamp.toLocaleString()}
                      </p>
                      <span className="text-sm font-medium capitalize">{order.status}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
