import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu, MenuItem } from "@/contexts/MenuContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuItemCard } from "@/components/MenuItemCard";
import { UserAvatar } from "@/components/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ShopDashboard() {
  const { user, logout } = useAuth();
  const { menuItems, orders, addMenuItem, updateOrderStatus } = useMenu();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Omit<MenuItem, "id"> = {
      name: newItem.name,
      price: Number(newItem.price),
      category: newItem.category,
      shopId: user!.id,
      shopName: user!.name,
      available: true,
    };
    addMenuItem(item);
    setNewItem({ name: "", price: "", category: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Menu item added!", description: `${item.name} is now available` });
  };

  const myMenuItems = menuItems.filter((item) => item.shopId === user?.id);
  const myOrders = orders.filter((order) => 
    order.items.some((item) => item.menuItem.shopId === user?.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar name={user?.name || ""} avatar={user?.avatar} size="lg" />
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-sm opacity-90">Shop Owner Portal</p>
            </div>
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
            <TabsTrigger value="menu">My Menu ({myMenuItems.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({myOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMenuItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="e.g., Paneer Sandwich"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="e.g., Sandwiches"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Item</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {myMenuItems.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No menu items yet. Add your first item!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myMenuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} showShopName={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Incoming Orders
            </h2>
            {myOrders.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No orders yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {order.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                    <div className="space-y-2 mb-4">
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
                      <span className="font-bold text-lg text-primary">
                        Total: ₹{order.totalPrice}
                      </span>
                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateOrderStatus(order.id, "ready")}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateOrderStatus(order.id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
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
