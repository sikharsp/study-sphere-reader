
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Check, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { dispatchCustomEvent, storeDocumentContent } from "@/services/storageEventService";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "File required",
        description: "Please select a PDF to upload",
        variant: "destructive"
      });
      return;
    }

    if (!title || !description || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Start upload process
    setUploading(true);

    try {
      // Read file as data URL (base64)
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          
          // Get existing PDFs from localStorage
          const storedPdfs = localStorage.getItem("pdfDocuments");
          const existingPdfs = storedPdfs ? JSON.parse(storedPdfs) : [];
          
          // Generate a unique ID for the PDF
          const newId = crypto.randomUUID().toString();
          
          // Store content separately to avoid localStorage quota issues
          const contentSaved = storeDocumentContent(newId, content);
          
          // Create new PDF object without the actual content
          const newPdf = {
            id: newId,
            title: title,
            description: description,
            category: category,
            pages: Math.floor(Math.random() * 50) + 10,
            uploadDate: new Date().toISOString().split('T')[0],
            hidden: false,
            hasContent: contentSaved
          };
          
          // Add new PDF to existing PDFs
          const updatedPdfs = [...existingPdfs, newPdf];
          
          // Use the storage service to update localStorage and dispatch event
          dispatchCustomEvent("pdfDocuments", updatedPdfs);
          
          // Update UI
          setUploading(false);
          setSuccess(true);
          
          toast({
            title: "Upload successful",
            description: contentSaved
              ? "Your PDF has been uploaded to the library"
              : "Your PDF has been uploaded but content might not persist between sessions due to size constraints",
          });
          
          // Navigate to library or reset form after delay
          setTimeout(() => {
            navigate("/library");
          }, 1500);
        } catch (error) {
          console.error("Error processing file:", error);
          setUploading(false);
          
          toast({
            title: "Upload failed",
            description: "There was an error processing your file. Please try again.",
            variant: "destructive"
          });
        }
      };
      
      reader.onerror = () => {
        setUploading(false);
        toast({
          title: "Upload failed",
          description: "There was an error reading your file. Please try again.",
          variant: "destructive"
        });
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File upload error:", error);
      setUploading(false);
      toast({
        title: "Upload error",
        description: "There was a problem with the file upload. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get program categories
  const getPrograms = () => {
    const storedPrograms = localStorage.getItem("academicPrograms");
    return storedPrograms ? JSON.parse(storedPrograms) : [
      { id: "bsc", name: "BSc" },
      { id: "bsccsit", name: "BScCSIT" },
      { id: "bca", name: "BCA" },
      { id: "bbs", name: "BBS" }
    ];
  };

  return (
    <MainLayout>
      <section className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Upload Document</h1>
          <p className="text-muted-foreground">
            Share educational materials with students
          </p>
        </div>

        {success ? (
          <Alert className="mb-8 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Upload Complete</AlertTitle>
            <AlertDescription className="text-green-700">
              Your document was successfully uploaded to the library.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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
            
            <div className="mb-4">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Document title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe this document" 
                className="min-h-24" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {getPrograms().map(program => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Upload;
