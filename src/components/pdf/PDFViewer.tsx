
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  documentId: string;
  pdfContent?: string;
  pdfTitle?: string;
  pdfCategory?: string;
  pdfPages?: number;
}

const PDFViewer = ({ 
  documentId, 
  pdfContent, 
  pdfTitle = "Document", 
  pdfCategory = "Uncategorized",
  pdfPages = 0 
}: PDFViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [totalPages, setTotalPages] = useState(pdfPages || 1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Load PDF when component mounts or when pdfContent changes
  useEffect(() => {
    if (!pdfContent) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    async function loadPDF() {
      try {
        setLoading(true);

        // Check if pdfContent is a base64 string
        if (pdfContent && pdfContent.startsWith('data:application/pdf;base64,')) {
          // Remove the data URL prefix to get just the base64 content
          const base64Content = pdfContent.split(',')[1];
          
          // Convert base64 to binary
          const binaryString = window.atob(base64Content);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: bytes });
          const pdf = await loadingTask.promise;
          
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          renderPage(pdf, currentPage, scale);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    }

    loadPDF();
  }, [pdfContent]);

  // Render page when currentPage or scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage, scale);
    }
  }, [currentPage, scale, pdfDoc]);

  const renderPage = async (pdf: any, pageNum: number, pageScale: number) => {
    try {
      setLoading(true);
      
      if (!canvasRef.current) return;
      
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: pageScale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context!,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      setLoading(false);
    } catch (error) {
      console.error("Error rendering page:", error);
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
  };

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
                <h2 className="text-xl font-bold">{pdfTitle}</h2>
                <p className="text-sm text-gray-500">{pdfCategory}</p>
              </div>
              
              {pdfContent ? (
                <div className="flex justify-center">
                  <canvas 
                    ref={canvasRef} 
                    className="border border-gray-200"
                    style={{ 
                      transform: `scale(${scale})`, 
                      transformOrigin: 'center top' 
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4 text-gray-700">
                  <p>
                    This is a placeholder for the PDF content. The actual PDF cannot be displayed.
                  </p>
                  <p>
                    Please upload a valid PDF document to view its contents.
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
              )}
            </div>
          </div>
          <div className="border-t bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || !pdfContent}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous Page
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={!pdfContent}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {pdfContent ? `Page ${currentPage} of ${totalPages}` : 'No PDF loaded'}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={!pdfContent}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || !pdfContent}
              >
                Next Page <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
