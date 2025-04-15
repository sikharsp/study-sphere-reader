
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Edit, Trash, EyeOff, Eye, FileUp, Plus } from "lucide-react";
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  
  // Upload states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
      }
    }
  };

  const handleUploadPdf = () => {
    if (!file || !newTitle || !newDescription || !newCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a PDF file",
        variant: "destructive"
      });
      return;
    }

    // In a real app, we would upload the file to a server
    // For now, we'll just add it to our local array
    const newPdf = {
      id: (pdfs.length + 1).toString(),
      title: newTitle,
      description: newDescription,
      category: newCategory,
      pages: Math.floor(Math.random() * 50) + 10, // Random page count for demo
      uploadDate: new Date().toISOString().split('T')[0],
      hidden: false
    };
    
    setPdfs([...pdfs, newPdf]);
    setIsUploadModalOpen(false);
    
    // Reset form
    setNewTitle("");
    setNewDescription("");
    setNewCategory("");
    setFile(null);
    
    toast({
      title: "PDF uploaded",
      description: "The document has been successfully added to the library.",
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <section className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all PDF resources from this central dashboard
            </p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)} className="bg-study-600 hover:bg-study-700">
            <Plus className="mr-2 h-4 w-4" /> Upload New PDF
          </Button>
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

        {/* Upload PDF Dialog */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload New PDF</DialogTitle>
              <DialogDescription>
                Upload a new PDF document to the library
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <FileUp className="mb-2 h-10 w-10 text-gray-400" />
                  {file ? (
                    <div className="text-center">
                      <p className="mb-1 font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="mb-1">Drag and drop your PDF here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                  )}
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept=".pdf" 
                    className="mt-4"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="newTitle">Title</Label>
                <Input
                  id="newTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="newCategory">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BSc">BSc</SelectItem>
                    <SelectItem value="BScCSIT">BScCSIT</SelectItem>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="BBS">BBS</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="newDescription">Description</Label>
                <Textarea
                  id="newDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide a brief description of this document"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadPdf}>Upload PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </MainLayout>
  );
};

export default AdminDashboard;
