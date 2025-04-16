
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    // Set submitting state
    setIsSubmitting(true);
    
    try {
      // Create proper form data for FormSubmit.io
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("_subject", "New contact form submission");
      formData.append("_captcha", "false");
      formData.append("_next", window.location.href);

      // Send to psikhar74@gmail.com via FormSubmit.io
      const response = await fetch("https://formsubmit.co/psikhar74@gmail.com", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
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
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
              Your message has been sent successfully. We'll get back to you soon.
            </AlertDescription>
          </Alert>
        )}

        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4" action="https://formsubmit.co/psikhar74@gmail.com" method="POST">
              <input type="hidden" name="_next" value={window.location.href} />
              <input type="hidden" name="_subject" value="New contact form submission" />
              <input type="hidden" name="_captcha" value="false" />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    name="name"
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
                    name="email"
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
                  name="subject"
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
                  name="message"
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
      </section>
    </MainLayout>
  );
};

export default Contact;
