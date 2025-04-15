
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
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
    
    // Simulate sending email
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. We'll get back to you soon.",
      });
      
      // Reset form after success
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
      // Reset success message after a delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <MainLayout>
      <section className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">
            Get in touch with us for any questions or inquiries
          </p>
        </div>

        {isSuccess && (
          <Alert className="mb-8 bg-green-50">
            <AlertDescription className="text-green-700">
              Your message has been sent successfully. We'll respond to you at {email} as soon as possible.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-5">
          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="What is this regarding?" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Your message..." 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-2 w-full bg-study-600 hover:bg-study-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-2">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 text-study-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href="mailto:psikhar74@gmail.com" 
                      className="text-gray-600 hover:text-study-600"
                    >
                      psikhar74@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mr-3 h-5 w-5 text-study-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">Available on request</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="mb-3 font-medium">Office Hours</h3>
                <p className="text-sm text-gray-600">
                  Monday - Friday: 9:00 AM - 5:00 PM
                </p>
                <p className="text-sm text-gray-600">
                  Saturday - Sunday: Closed
                </p>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
