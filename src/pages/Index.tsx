import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, GraduationCap, BookType, School, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";

const Index = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
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
      // Form submission to Formspree
      const response = await fetch("https://formspree.io/f/psikhar74@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
        });
        
        // Reset form after success
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-study-700 to-study-900 py-20 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Educational Resources Hub
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Access quality study materials for your academic programs. Find organized resources for BSc, BScCSIT, BCA, and BBS programs.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/library">
                  <Button size="lg" className="bg-white text-study-700 hover:bg-gray-100">
                    Browse Library
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-80 w-80 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="absolute inset-0 m-auto flex h-64 w-64 items-center justify-center rounded bg-white shadow-lg">
                  <BookOpen className="h-32 w-32 text-study-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Academic Programs</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Browse study materials by your specific academic program
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/library?category=bsc" className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md group-hover:border-study-500">
                <GraduationCap className="mb-4 h-10 w-10 text-study-500" />
                <h3 className="mb-2 text-xl font-bold group-hover:text-study-600">BSc</h3>
                <p className="text-gray-600">
                  Bachelor of Science resources and reading materials
                </p>
              </div>
            </Link>
            
            <Link to="/library?category=bsccsit" className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md group-hover:border-study-500">
                <BookType className="mb-4 h-10 w-10 text-study-500" />
                <h3 className="mb-2 text-xl font-bold group-hover:text-study-600">BScCSIT</h3>
                <p className="text-gray-600">
                  Computer Science and Information Technology materials
                </p>
              </div>
            </Link>
            
            <Link to="/library?category=bca" className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md group-hover:border-study-500">
                <School className="mb-4 h-10 w-10 text-study-500" />
                <h3 className="mb-2 text-xl font-bold group-hover:text-study-600">BCA</h3>
                <p className="text-gray-600">
                  Bachelor of Computer Applications study resources
                </p>
              </div>
            </Link>
            
            <Link to="/library?category=bbs" className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md group-hover:border-study-500">
                <FileText className="mb-4 h-10 w-10 text-study-500" />
                <h3 className="mb-2 text-xl font-bold group-hover:text-study-600">BBS</h3>
                <p className="text-gray-600">
                  Bachelor of Business Studies reference materials
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-study-50 py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Why Use This Resource Hub?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Find everything you need for your academic success
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <FileText className="mb-4 h-10 w-10 text-study-500" />
              <h3 className="mb-2 text-xl font-bold">Easy Document Reading</h3>
              <p className="text-gray-600">
                Clean, user-friendly interface for comfortable reading during long study sessions
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <BookOpen className="mb-4 h-10 w-10 text-study-500" />
              <h3 className="mb-2 text-xl font-bold">Organized by Program</h3>
              <p className="text-gray-600">
                Find exactly what you need with resources categorized by academic program
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <GraduationCap className="mb-4 h-10 w-10 text-study-500" />
              <h3 className="mb-2 text-xl font-bold">Academic Success</h3>
              <p className="text-gray-600">
                Improve your learning outcomes with high-quality educational materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white border-t">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="h-6 w-6 text-study-600" />
              <h2 className="text-3xl font-bold">Send us a message</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Reach out to us directly using the form below.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Your Name</Label>
                    <Input 
                      id="contact-name" 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Your Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email"
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input 
                    id="contact-subject" 
                    placeholder="What is this regarding?" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea 
                    id="contact-message" 
                    placeholder="Your message..." 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="bg-study-600 hover:bg-study-700 w-full"
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Learning?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Access a growing library of educational materials for your academic program
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/library">
                <Button size="lg" className="bg-study-600 hover:bg-study-700">
                  Browse Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
