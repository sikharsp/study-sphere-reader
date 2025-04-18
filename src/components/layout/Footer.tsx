
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [programs, setPrograms] = useState<Array<{id: string, name: string}>>([]);
  
  // Load programs from localStorage
  useEffect(() => {
    console.log("Footer component mounted");
    
    const loadPrograms = () => {
      try {
        const storedPrograms = localStorage.getItem("academicPrograms");
        if (storedPrograms) {
          const programsData = JSON.parse(storedPrograms);
          setPrograms(programsData);
          console.log("Programs loaded in footer:", programsData);
        } else {
          const defaultPrograms = [
            { id: "bsc", name: "BSc" },
            { id: "bsccsit", name: "BScCSIT" },
            { id: "bca", name: "BCA" },
            { id: "bbs", name: "BBS" }
          ];
          setPrograms(defaultPrograms);
          console.log("Default programs set in footer:", defaultPrograms);
        }
      } catch (error) {
        console.error("Error loading programs in footer:", error);
        // Fallback to defaults if error
        const defaultPrograms = [
          { id: "bsc", name: "BSc" },
          { id: "bsccsit", name: "BScCSIT" },
          { id: "bca", name: "BCA" },
          { id: "bbs", name: "BBS" }
        ];
        setPrograms(defaultPrograms);
      }
    };
    
    loadPrograms();
    
    // Listen for program updates
    const handleProgramsUpdated = () => {
      console.log("Programs updated event received");
      loadPrograms();
    };
    
    window.addEventListener('programsUpdated', handleProgramsUpdated);
    window.addEventListener('storage', (e) => {
      if (e.key === "academicPrograms") {
        console.log("Program storage changed");
        loadPrograms();
      }
    });
    
    return () => {
      window.removeEventListener('programsUpdated', handleProgramsUpdated);
      window.removeEventListener('storage', handleProgramsUpdated);
    };
  }, []);

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
              {programs.length > 0 && (
                <li className="pt-2">
                  <span className="text-xs font-medium uppercase text-gray-500">Programs:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {programs.map(program => (
                      <Link 
                        key={program.id} 
                        to={`/library?category=${program.id}`} 
                        className="text-xs text-study-600 hover:text-study-800"
                      >
                        {program.name}
                      </Link>
                    ))}
                  </div>
                </li>
              )}
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
