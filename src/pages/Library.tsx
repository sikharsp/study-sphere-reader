
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Example data for PDFs with academic programs as categories
const SAMPLE_PDFS = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Fundamentals of programming and computer systems",
    pages: 42,
    uploadDate: "2023-10-15",
    category: "bsccsit"
  },
  {
    id: "2",
    title: "Biology 101: Cell Structure",
    description: "Comprehensive guide to cell biology and functions",
    pages: 28,
    uploadDate: "2023-11-05",
    category: "bsc"
  },
  {
    id: "3",
    title: "Business Economics Fundamentals",
    description: "Analysis of key economic principles for business",
    pages: 64,
    uploadDate: "2023-09-22",
    category: "bbs"
  },
  {
    id: "4",
    title: "Calculus Made Simple",
    description: "Step-by-step guide to differential calculus",
    pages: 36,
    uploadDate: "2023-12-01",
    category: "bsc"
  },
  {
    id: "5",
    title: "Programming in Java",
    description: "Fundamentals of Java programming language",
    pages: 50,
    uploadDate: "2023-08-17",
    category: "bca"
  },
  {
    id: "6",
    title: "Database Management Systems",
    description: "Complete guide to DBMS concepts",
    pages: 45,
    uploadDate: "2023-07-30",
    category: "bsccsit"
  },
  {
    id: "7",
    title: "Marketing Principles",
    description: "Introduction to marketing strategies and concepts",
    pages: 38,
    uploadDate: "2023-06-15",
    category: "bbs"
  },
  {
    id: "8",
    title: "Web Development Basics",
    description: "HTML, CSS, and JavaScript fundamentals",
    pages: 52,
    uploadDate: "2023-05-20",
    category: "bca"
  }
];

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [availablePrograms, setAvailablePrograms] = useState<Array<{id: string, name: string}>>([]);
  const [pdfs, setPdfs] = useState(SAMPLE_PDFS);
  const location = useLocation();
  
  // Extract category from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      setActiveCategory(category);
    }
  }, [location.search]);

  // Load programs from localStorage
  useEffect(() => {
    const loadPrograms = () => {
      const storedPrograms = localStorage.getItem("academicPrograms");
      const programs = storedPrograms ? JSON.parse(storedPrograms) : [
        { id: "bsc", name: "BSc" },
        { id: "bsccsit", name: "BScCSIT" },
        { id: "bca", name: "BCA" },
        { id: "bbs", name: "BBS" }
      ];
      setAvailablePrograms(programs);
      
      // If the active category no longer exists, reset to all
      if (activeCategory && !programs.some(p => p.id === activeCategory)) {
        setActiveCategory("");
      }
    };
    
    loadPrograms();
    
    // Listen for program updates
    const handleProgramsUpdated = () => {
      loadPrograms();
    };
    
    window.addEventListener('programsUpdated', handleProgramsUpdated);
    
    return () => {
      window.removeEventListener('programsUpdated', handleProgramsUpdated);
    };
  }, [activeCategory]);

  // Load PDFs
  useEffect(() => {
    // In a real app, you would fetch from API or localStorage
    // For now, we'll use the sample data and filter out PDFs with categories
    // that don't exist anymore
    const storedPrograms = localStorage.getItem("academicPrograms");
    const programs = storedPrograms ? JSON.parse(storedPrograms) : [];
    const programIds = programs.map((p: {id: string}) => p.id);
    
    const storedPdfs = localStorage.getItem("pdfDocuments");
    const allPdfs = storedPdfs ? JSON.parse(storedPdfs) : SAMPLE_PDFS;
    
    // Filter out PDFs with categories that don't exist anymore
    const filteredPdfs = allPdfs.filter((pdf: any) => 
      programIds.includes(pdf.category) || 
      !pdf.hidden // Keep visible PDFs even if their category was deleted
    );
    
    setPdfs(filteredPdfs);
  }, [availablePrograms]);

  const filterPDFs = () => {
    return pdfs.filter(pdf => {
      const matchesSearch = 
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory ? pdf.category === activeCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  };

  const filteredPDFs = filterPDFs();

  return (
    <MainLayout>
      <section className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Academic Resources Library</h1>
          <p className="text-muted-foreground">
            Browse study materials for all academic programs
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or description"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeCategory === "" ? "default" : "outline"} 
              onClick={() => setActiveCategory("")}
            >
              All Programs
            </Button>
            {availablePrograms.map(program => (
              <Button 
                key={program.id}
                variant={activeCategory === program.id ? "default" : "outline"} 
                onClick={() => setActiveCategory(program.id)}
              >
                {program.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredPDFs.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPDFs.map((pdf) => {
              // Find the program name for this PDF's category
              const program = availablePrograms.find(p => p.id === pdf.category);
              const categoryName = program ? program.name : pdf.category;
              
              return (
                <Link key={pdf.id} to={`/read/${pdf.id}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="bg-study-50 p-4">
                      <CardTitle className="line-clamp-1">{pdf.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                        {pdf.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="rounded-full bg-study-100 px-2 py-0.5 text-xs text-study-700">
                          {categoryName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {pdf.pages} pages
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 p-2 text-xs text-gray-500">
                      Uploaded on {pdf.uploadDate}
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Library;
