
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-study-600" />
          <span className="text-xl font-bold text-gray-800">StudySphere</span>
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
          <Link to="/admin">
            <Button className="bg-study-600 hover:bg-study-700">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
