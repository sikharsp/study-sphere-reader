
import MainLayout from "@/components/layout/MainLayout";
import AdminLogin from "@/components/admin/AdminLogin";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";

const AdminLoginPage = () => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <MainLayout>
        <div className="container py-12 relative">
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
          <AdminLogin />
        </div>
      </MainLayout>
    </ThemeProvider>
  );
};

export default AdminLoginPage;
