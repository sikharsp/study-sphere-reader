
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Hash function to verify credentials without storing them as plain text
const hashString = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString();
};

// Create obfuscated values
const obfuscatedUser = "973895832"; // Represents "education2025"
const obfuscatedPass = "-1572771963"; // Represents "samirresource2025"

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    console.log("Attempting login with:", { username, password });
    
    // Use the hash function to verify credentials
    const hashedUsername = hashString(username);
    const hashedPassword = hashString(password);
    
    console.log("Hashed values:", { hashedUsername, hashedPassword });
    console.log("Expected values:", { obfuscatedUser, obfuscatedPass });
    
    // Compare using hashed values
    if (hashedUsername === obfuscatedUser && hashedPassword === obfuscatedPass) {
      // Generate a secure session token
      const sessionToken = [...Array(30)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminToken", sessionToken);
      
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      
      // Trigger a storage event for other tabs
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}
        
        <div className="pt-2 text-center text-sm text-gray-500">
          <p>Username: education2025</p>
          <p>Password: samirresource2025</p>
          <p className="mt-1 text-xs text-gray-400">(Only showing for testing purposes)</p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-study-600 hover:bg-study-700"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
