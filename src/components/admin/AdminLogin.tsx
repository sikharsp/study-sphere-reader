
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin credentials - username: admin, password: admin123
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("adminLoggedIn", "true");
      
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <p className="text-gray-500">Enter your credentials to access the admin area</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username"
            placeholder="Enter admin username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password"
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-study-600 hover:bg-study-700">
          Log in
        </Button>
      </form>
      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        <p><strong>Note:</strong> Use these credentials to log in:</p>
        <p>Username: <code>admin</code></p>
        <p>Password: <code>admin123</code></p>
      </div>
    </div>
  );
};

export default AdminLogin;
