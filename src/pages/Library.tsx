
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

// Example data for PDFs
const SAMPLE_PDFS = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Fundamentals of programming and computer systems",
    pages: 42,
    uploadDate: "2023-10-15",
    category: "Computer Science"
  },
  {
    id: "2",
    title: "Biology 101: Cell Structure",
    description: "Comprehensive guide to cell biology and functions",
    pages: 28,
    uploadDate: "2023-11-05",
    category: "Biology"
  },
  {
    id: "3",
    title: "World History: Modern Era",
    description: "Analysis of key events from 1900 to present day",
    pages: 64,
    uploadDate: "2023-09-22",
    category: "History"
  },
  {
    id: "4",
    title: "Calculus Made Simple",
    description: "Step-by-step guide to differential calculus",
    pages: 36,
    uploadDate: "2023-12-01",
    category: "Mathematics"
  },
  {
    id: "5",
    title: "Introduction to Psychology",
    description: "Fundamentals of human behavior and mental processes",
    pages: 50,
    uploadDate: "2023-08-17",
    category: "Psychology"
  },
  {
    id: "6",
    title: "English Literature: Shakespeare",
    description: "Analysis of major works by William Shakespeare",
    pages: 45,
    uploadDate: "2023-07-30",
    category: "Literature"
  }
];

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPDFs = SAMPLE_PDFS.filter(pdf => 
    pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <section className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">PDF Library</h1>
          <p className="text-muted-foreground">
            Browse our collection of educational resources
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, description, or category"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Categories</Button>
            <Button variant="outline">Recent</Button>
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
            {filteredPDFs.map((pdf) => (
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
                        {pdf.category}
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
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Library;
