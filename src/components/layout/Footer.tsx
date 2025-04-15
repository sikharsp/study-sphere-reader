
import { BookOpen, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleQuickMessage = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to contact us",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Create mailto link with just the email for a quick contact
    const mailtoLink = `mailto:psikhar74@gmail.com?subject=${encodeURIComponent("Quick Contact Request")}&body=${encodeURIComponent(
      `I'd like to get in touch. Please contact me at: ${email}`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Contact request initiated",
      description: "Your email client has been opened. Please send the email to complete.",
    });
    
    setEmail("");
  };

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
        
        {/* Contact Section */}
        <div className="mt-8 border-t pt-6">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-study-600" />
              <h3 className="text-lg font-medium text-gray-800">Contact Us</h3>
            </div>
            <p className="mb-4 text-center text-sm text-gray-600">
              Leave your email for a quick contact request
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                onClick={handleQuickMessage}
                className="bg-study-600 hover:bg-study-700"
              >
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Direct email: <a href="mailto:psikhar74@gmail.com" className="underline hover:text-study-600">psikhar74@gmail.com</a>
            </p>
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
