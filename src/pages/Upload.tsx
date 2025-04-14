
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Upload = () => {
  const { toast } = useToast();
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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate upload process
    setUploading(true);

    // Fake upload delay
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      
      toast({
        title: "Upload successful",
        description: "Your PDF has been uploaded to the library",
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setDescription("");
        setCategory("");
        setSuccess(false);
      }, 2000);
    }, 2000);
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
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Upload;
