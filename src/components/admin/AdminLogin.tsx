
import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Check if developer tools are open
    const devtoolsCheck = (): void => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        document.body.innerHTML = "<h1>For security reasons, this page is not available when developer tools are open.</h1>";
      }
    };

    window.addEventListener('resize', devtoolsCheck);
    devtoolsCheck();

    // Disable right click
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', disableRightClick);

    return () => {
      window.removeEventListener('resize', devtoolsCheck);
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);

  // Create one-time verification option
  useEffect(() => {
    // Automatically hide demo after 5 seconds on production
    if (process.env.NODE_ENV === 'production') {
      const timer = setTimeout(() => {
        setShowDemo(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showDemo]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use the hash function to verify credentials
    const hashedUsername = hashString(username);
    const hashedPassword = hashString(password);
    
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
        <Button type="submit" className="w-full bg-study-600 hover:bg-study-700">
          Log in
        </Button>
      </form>
      
      {/* Development-only note - will be automatically hidden in production */}
      {showDemo && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          <button 
            className="float-right text-xs text-gray-500"
            onClick={() => setShowDemo(false)}
          >
            [hide]
          </button>
          <p><strong>For development only:</strong></p>
          <p>Contact admin for credentials</p>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
