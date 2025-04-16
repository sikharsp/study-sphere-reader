
import { BookOpen, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Get programs from localStorage or use default ones
  const getPrograms = () => {
    const storedPrograms = localStorage.getItem("academicPrograms");
    return storedPrograms ? JSON.parse(storedPrograms) : [
      { id: "bsc", name: "BSc" },
      { id: "bsccsit", name: "BScCSIT" },
      { id: "bca", name: "BCA" },
      { id: "bbs", name: "BBS" }
    ];
  };
  
  const programs = getPrograms();

  return (
    <footer className="border-t bg-white py-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-study-600" />
              <span className="text-lg font-bold text-gray-800">StudySphere</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Your platform for educational resource sharing and learning
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Resources</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/library" className="text-sm text-gray-600 hover:text-study-600">
                  PDF Library
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-gray-600 hover:text-study-600">
                  Upload Documents
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Company</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-study-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-study-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-study-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} StudySphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
