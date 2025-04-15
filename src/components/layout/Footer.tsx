
import { BookOpen, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Footer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!name || !email || !subject || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
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

    // Create mailto link
    const mailtoLink = `mailto:psikhar74@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Message ready to send",
      description: "Your email client has been opened with the message. Please send the email to complete.",
    });
    
    // Clear the form
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
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
        
        {/* Contact Form Section */}
        <div className="mt-8 border-t pt-6">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-study-600" />
              <h3 className="text-lg font-medium text-gray-800">Send us a message</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="footer-name">Your Name</Label>
                <Input 
                  id="footer-name" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer-email">Your Email</Label>
                <Input 
                  id="footer-email" 
                  type="email"
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="footer-subject">Subject</Label>
              <Input 
                id="footer-subject" 
                placeholder="What is this regarding?" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="footer-message">Message</Label>
              <Textarea 
                id="footer-message" 
                placeholder="Your message..." 
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleSendMessage}
              className="bg-study-600 hover:bg-study-700 w-full"
            >
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
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
