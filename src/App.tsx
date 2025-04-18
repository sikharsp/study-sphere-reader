
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import Upload from "./pages/Upload";
import Reader from "./pages/Reader";
import AdminLoginPage from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Simple console log to help debug the authentication state
  console.log("ProtectedRoute check - sessionStorage values:", {
    isLoggedIn: sessionStorage.getItem("adminLoggedIn"),
    token: sessionStorage.getItem("adminToken") ? "exists" : "missing"
  });
  
  // Check both conditions for authentication
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true" && 
                    sessionStorage.getItem("adminToken") !== null;
                    
  if (!isLoggedIn) {
    console.log("Authentication failed, redirecting to login");
    return <Navigate to="/admin" replace />;
  }
  
  console.log("Authentication successful");
  return <>{children}</>;
};

// Create a new QueryClient instance with default configs
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize any required data at app startup
const App = () => {
  useEffect(() => {
    // Initialize default programs if needed
    if (!localStorage.getItem("academicPrograms")) {
      const defaultPrograms = [
        { id: "bsc", name: "BSc" },
        { id: "bsccsit", name: "BScCSIT" },
        { id: "bca", name: "BCA" },
        { id: "bbs", name: "BBS" }
      ];
      localStorage.setItem("academicPrograms", JSON.stringify(defaultPrograms));
    }
    
    // Initialize default PDF documents if needed
    if (!localStorage.getItem("pdfDocuments")) {
      const defaultPdfs = [
        {
          id: "1",
          title: "Introduction to Computer Science",
          description: "Fundamentals of programming and computer systems",
          pages: 42,
          uploadDate: "2023-10-15",
          category: "bsccsit",
          hidden: false
        },
        {
          id: "2",
          title: "Biology 101: Cell Structure",
          description: "Comprehensive guide to cell biology and functions",
          pages: 28,
          uploadDate: "2023-11-05",
          category: "bsc",
          hidden: false
        }
      ];
      localStorage.setItem("pdfDocuments", JSON.stringify(defaultPdfs));
    }
    
    console.log("App initialized with default data if needed");
  }, []);

  return (
    <ThemeProvider defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/read/:id" element={<Reader />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
