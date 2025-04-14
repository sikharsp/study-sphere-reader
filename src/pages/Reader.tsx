
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Sample PDFs data (same as Library page)
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

// This is a placeholder component as we can't actually load PDFs in this demo
// In a real implementation, you would use a library like react-pdf or pdf.js
const PDFViewer = ({ documentId }: { documentId: string }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-lg border bg-white shadow">
      {loading ? (
        <div className="flex h-full flex-col items-center justify-center p-8">
          <Skeleton className="h-4/5 w-full rounded" />
          <div className="mt-4 flex w-full justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="pdf-container p-4">
            <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold">
                  {SAMPLE_PDFS.find(pdf => pdf.id === documentId)?.title || "Document"}
                </h2>
                <p className="text-sm text-gray-500">
                  {SAMPLE_PDFS.find(pdf => pdf.id === documentId)?.category || "Uncategorized"}
                </p>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  This is a placeholder for the actual PDF content. In a real implementation, 
                  this would display the PDF document using a library like react-pdf or pdf.js.
                </p>
                <p>
                  The document would be fully interactive, allowing users to scroll through pages,
                  zoom in and out, and potentially even highlight or annotate content.
                </p>
                <p>
                  For this demo, we're simulating the PDF reader interface without loading an actual PDF.
                </p>
                <p>
                  {SAMPLE_PDFS.find(pdf => pdf.id === documentId)?.description || "No description available."}
                </p>
                {/* Sample content blocks to simulate a document */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded bg-gray-100 p-4">
                    <h3 className="mb-2 font-medium">Section {i + 1}</h3>
                    <div className="h-16 w-full rounded-sm bg-gray-200" />
                    <p className="mt-2 text-sm">Sample content paragraph {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous Page
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page 1 of {SAMPLE_PDFS.find(pdf => pdf.id === documentId)?.pages || '?'}</span>
                <Button variant="outline" size="icon">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Next Page <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Reader = () => {
  const { id } = useParams<{ id: string }>();
  const pdf = SAMPLE_PDFS.find((pdf) => pdf.id === id);

  if (!pdf || !id) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold">Document Not Found</h1>
          <p className="mb-6">The document you're looking for doesn't exist or was removed.</p>
          <Button asChild>
            <Link to="/library">Return to Library</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="container py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/library">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Library
              </Link>
            </Button>
            <h1 className="text-xl font-bold md:text-2xl">{pdf.title}</h1>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" /> Download
          </Button>
        </div>

        <PDFViewer documentId={id} />
      </section>
    </MainLayout>
  );
};

export default Reader;
