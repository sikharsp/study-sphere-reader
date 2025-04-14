
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, UserCog, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
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
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link to="/admin/dashboard">
              <Button className="bg-green-600 hover:bg-green-700">
                <LayoutDashboard className="mr-1 h-4 w-4" /> Admin Dashboard
              </Button>
            </Link>
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
