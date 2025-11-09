import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UtensilsCrossed, ArrowLeft, User } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [adminCode, setAdminCode] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Secure admin access code (In production, this should be server-side)
  const ADMIN_ACCESS_CODE = "ROOKIES2024";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate admin access code
    if (role === "admin" && adminCode !== ADMIN_ACCESS_CODE) {
      toast({
        title: "Invalid access code",
        description: "Please enter the correct admin access code.",
        variant: "destructive",
      });
      return;
    }
    
    const success = register(name, username, password, role, avatarPreview);
    
    if (success) {
      toast({
        title: "Registration successful!",
        description: "You can now log in with your credentials.",
      });
      navigate("/");
    } else {
      toast({
        title: "Registration failed",
        description: "Username already exists. Please choose another.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <UtensilsCrossed className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Rookies Canteen</h1>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
          <p className="text-muted-foreground">Join our canteen community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Avatar Upload */}
          <div className="space-y-3">
            <Label htmlFor="avatar">Profile Picture (Optional)</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max 2MB. JPG, PNG, or GIF
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Register as</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger id="role" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="shop">Shop Owner</SelectItem>
                <SelectItem value="admin">Admin (Requires Access Code)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "admin" && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-primary/20">
              <Label htmlFor="adminCode" className="flex items-center gap-2">
                Admin Access Code
                <span className="text-xs text-muted-foreground">(Required)</span>
              </Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin access code"
                required
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Contact system administrator for access code
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Register
          </Button>
        </form>

        {role === "admin" && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-center text-muted-foreground">
              <strong>Demo Code:</strong> ROOKIES2024
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
}
