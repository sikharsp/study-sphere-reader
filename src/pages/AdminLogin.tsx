
import MainLayout from "@/components/layout/MainLayout";
import AdminLogin from "@/components/admin/AdminLogin";

const AdminLoginPage = () => {
  return (
    <MainLayout>
      <div className="container py-12">
        <AdminLogin />
      </div>
    </MainLayout>
  );
};

export default AdminLoginPage;
