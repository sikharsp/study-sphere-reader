
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    // Simple direct comparison for demo purposes
    if (username === "education2025" && password === "samirresource2025") {
      // Set session data
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminToken", "admin-session-token");
      
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      
      // Trigger storage event for Header component
      window.dispatchEvent(new Event('storage'));
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 rounded-lg shadow-md dark:bg-gray-800 bg-white">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold dark:text-white text-gray-900">Admin Login</h1>
        <p className="dark:text-gray-300 text-gray-600">Enter your credentials to access the admin area</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="dark:text-white text-gray-900">Username</Label>
          <Input 
            id="username"
            placeholder="Enter admin username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="dark:text-white text-gray-900">Password</Label>
          <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showDemo ? "Hide Demo Credentials" : "Show Demo Credentials"}
          </Button>
        </div>
        
        {showDemo && (
          <div className="pt-2 text-center text-sm border rounded-md p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: <code className="px-1 rounded dark:bg-gray-800 bg-gray-100">education2025</code></p>
            <p>Password: <code className="px-1 rounded dark:bg-gray-800 bg-gray-100">samirresource2025</code></p>
            <p className="mt-1 text-xs dark:text-gray-400 text-gray-500">For demonstration purposes only</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
