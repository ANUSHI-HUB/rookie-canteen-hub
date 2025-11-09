import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/contexts/MenuContext";
import { ShoppingCart } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
  showShopName?: boolean;
}

export function MenuItemCard({ item, onAddToCart, showShopName = true }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{item.name}</h3>
            {showShopName && (
              <p className="text-sm text-muted-foreground">{item.shopName}</p>
            )}
          </div>
          <Badge variant="secondary" className="ml-2">
            {item.category}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">₹{item.price}</span>
          </div>
          {onAddToCart && item.available && (
            <Button
              size="sm"
              onClick={() => onAddToCart(item)}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          )}
          {!item.available && (
            <Badge variant="destructive">Unavailable</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
