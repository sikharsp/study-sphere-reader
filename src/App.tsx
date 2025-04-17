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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true" && 
                    sessionStorage.getItem("adminToken") !== null;
                    
  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" enableSystem>
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

export default App;
