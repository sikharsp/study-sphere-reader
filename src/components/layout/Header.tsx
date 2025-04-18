
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, UserCog, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Header component mounted");
    
    // Check if admin is logged in with valid token
    const checkAdminStatus = () => {
      const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
      const adminToken = sessionStorage.getItem("adminToken");
      
      console.log("Admin status check:", { adminLoggedIn, hasToken: adminToken !== null });
      
      const adminStatus = adminLoggedIn === "true" && adminToken !== null;
      setIsAdmin(adminStatus);
    };
    
    checkAdminStatus();
    
    // Add event listener to check admin status when storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "adminLoggedIn" || event.key === "adminToken") {
        console.log("Storage changed, rechecking admin status");
        checkAdminStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCustomStorageChange = () => {
      console.log("Custom storage event, rechecking admin status");
      checkAdminStatus();
    };
    
    window.addEventListener('adminStatusChanged', handleCustomStorageChange);
    
    // Also check periodically (in case user logs in in another tab)
    const interval = setInterval(checkAdminStatus, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminStatusChanged', handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out admin");
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminToken");
    setIsAdmin(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('adminStatusChanged'));
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  // Log re-renders to track state changes
  useEffect(() => {
    console.log("Header re-rendered, isAdmin:", isAdmin);
  }, [isAdmin]);

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-study-600" />
          <span className="text-xl font-bold text-gray-800">Academic Resources</span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-study-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/library" className="text-gray-600 hover:text-study-600">
                Library
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-study-600">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard">
                <Button className="bg-green-600 hover:bg-green-700">
                  <LayoutDashboard className="mr-1 h-4 w-4" /> Admin Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Link to="/admin">
              <Button className="bg-study-600 hover:bg-study-700">
                <UserCog className="mr-1 h-4 w-4" /> Admin Portal
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
