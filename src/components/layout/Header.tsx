
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, UserCog, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = () => {
      const adminStatus = sessionStorage.getItem("adminLoggedIn") === "true";
      setIsAdmin(adminStatus);
    };
    
    checkAdminStatus();
    
    // Add event listener to check admin status when storage changes
    window.addEventListener('storage', checkAdminStatus);
    
    // Also check periodically (in case user logs in in another tab)
    const interval = setInterval(checkAdminStatus, 5000);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    setIsAdmin(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

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
