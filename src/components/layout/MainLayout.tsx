
import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [hasError, setHasError] = useState(false);

  // Log when layout is rendered to help with debugging
  useEffect(() => {
    console.log("MainLayout rendered");
    
    // Add error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Simple error boundary fallback
  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="mb-4">We encountered an error loading this page.</p>
            <button 
              className="bg-study-600 text-white px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
