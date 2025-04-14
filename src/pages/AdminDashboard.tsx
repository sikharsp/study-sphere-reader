
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Edit, Trash, EyeOff, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Using the same sample PDFs data for now
const SAMPLE_PDFS = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Fundamentals of programming and computer systems",
    pages: 42,
    uploadDate: "2023-10-15",
    category: "Computer Science",
    hidden: false
  },
  {
    id: "2",
    title: "Biology 101: Cell Structure",
    description: "Comprehensive guide to cell biology and functions",
    pages: 28,
    uploadDate: "2023-11-05",
    category: "Biology",
    hidden: false
  },
  {
    id: "3",
    title: "World History: Modern Era",
    description: "Analysis of key events from 1900 to present day",
    pages: 64,
    uploadDate: "2023-09-22",
    category: "History",
    hidden: false
  },
  {
    id: "4",
    title: "Calculus Made Simple",
    description: "Step-by-step guide to differential calculus",
    pages: 36,
    uploadDate: "2023-12-01",
    category: "Mathematics",
    hidden: true
  },
  {
    id: "5",
    title: "Introduction to Psychology",
    description: "Fundamentals of human behavior and mental processes",
    pages: 50,
    uploadDate: "2023-08-17",
    category: "Psychology",
    hidden: false
  },
  {
    id: "6",
    title: "English Literature: Shakespeare",
    description: "Analysis of major works by William Shakespeare",
    pages: 45,
    uploadDate: "2023-07-30",
    category: "Literature",
    hidden: false
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState(SAMPLE_PDFS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Check if admin is logged in
  useEffect(() => {
    // In a real app, we would check for an authentication token
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleEdit = (pdf: any) => {
    setCurrentPdf(pdf);
    setTitle(pdf.title);
    setDescription(pdf.description);
    setCategory(pdf.category);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentPdf) return;
    
    const updatedPdfs = pdfs.map(pdf => 
      pdf.id === currentPdf.id 
        ? { ...pdf, title, description, category }
        : pdf
    );
    
    setPdfs(updatedPdfs);
    setIsEditModalOpen(false);
    toast({
      title: "PDF updated",
      description: "The document has been successfully updated.",
    });
  };

  const handleToggleVisibility = (id: string) => {
    const updatedPdfs = pdfs.map(pdf => 
      pdf.id === id ? { ...pdf, hidden: !pdf.hidden } : pdf
    );
    
    setPdfs(updatedPdfs);
    const pdf = updatedPdfs.find(pdf => pdf.id === id);
    
    toast({
      title: pdf?.hidden ? "PDF hidden" : "PDF visible",
      description: pdf?.hidden 
        ? "The document is now hidden from users." 
        : "The document is now visible to users.",
    });
  };

  const handleDelete = (id: string) => {
    const updatedPdfs = pdfs.filter(pdf => pdf.id !== id);
    setPdfs(updatedPdfs);
    
    toast({
      title: "PDF deleted",
      description: "The document has been permanently deleted.",
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <section className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all PDF resources from this central dashboard
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">PDF Documents</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pdfs.map(pdf => (
                <TableRow key={pdf.id}>
                  <TableCell className="font-medium">{pdf.title}</TableCell>
                  <TableCell>{pdf.category}</TableCell>
                  <TableCell>{pdf.uploadDate}</TableCell>
                  <TableCell>{pdf.pages}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      pdf.hidden 
                        ? "bg-red-100 text-red-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {pdf.hidden ? "Hidden" : "Visible"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(pdf)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleToggleVisibility(pdf.id)}
                      >
                        {pdf.hidden ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(pdf.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit PDF Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit PDF</DialogTitle>
              <DialogDescription>
                Make changes to the PDF document here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category">Category</label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </MainLayout>
  );
};

export default AdminDashboard;
