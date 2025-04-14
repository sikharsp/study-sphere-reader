
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, 
  ChevronRight, Download, ThumbsUp, MessageSquare, 
  Edit, Trash, Eye, EyeOff
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

// Sample PDFs data (same as Library page)
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

// Get stored comments and likes from localStorage
const getStoredComments = () => {
  const stored = localStorage.getItem('pdfComments');
  return stored ? JSON.parse(stored) : {};
};

const getStoredLikes = () => {
  const stored = localStorage.getItem('pdfLikes');
  return stored ? JSON.parse(stored) : {};
};

// Comment type definition
interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

// This is a placeholder component as we can't actually load PDFs in this demo
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
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Get stored comments and likes
  const commentStorage = getStoredComments();
  const likeStorage = getStoredLikes();
  
  const [likes, setLikes] = useState<number>(likeStorage[id as string]?.count || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>(commentStorage[id as string] || []);
  const [newComment, setNewComment] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  
  // Admin editing state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(pdf?.title || "");
  const [editDescription, setEditDescription] = useState(pdf?.description || "");
  
  // Check admin status
  useEffect(() => {
    const adminStatus = sessionStorage.getItem("adminLoggedIn") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      
      // Save likes to localStorage
      const updatedLikes = {...likeStorage};
      updatedLikes[id as string] = { count: newLikes };
      localStorage.setItem('pdfLikes', JSON.stringify(updatedLikes));
      
      toast({
        title: "Thanks for your feedback!",
        description: "You liked this document.",
      });
    } else {
      const newLikes = likes - 1;
      setLikes(newLikes);
      setHasLiked(false);
      
      // Update localStorage
      const updatedLikes = {...likeStorage};
      updatedLikes[id as string] = { count: newLikes };
      localStorage.setItem('pdfLikes', JSON.stringify(updatedLikes));
      
      toast({
        title: "Feedback removed",
        description: "You removed your like from this document.",
      });
    }
  };

  const handleAddComment = () => {
    if (!userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userName: userName,
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment("");
    
    // Save to localStorage
    const updatedCommentStorage = {...commentStorage};
    updatedCommentStorage[id as string] = updatedComments;
    localStorage.setItem('pdfComments', JSON.stringify(updatedCommentStorage));
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };
  
  // Admin functions
  const handleSaveEdit = () => {
    toast({
      title: "Changes saved",
      description: "The document has been updated successfully.",
    });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    
    // Save to localStorage
    const updatedCommentStorage = {...commentStorage};
    updatedCommentStorage[id as string] = updatedComments;
    localStorage.setItem('pdfComments', JSON.stringify(updatedCommentStorage));
    
    toast({
      title: "Comment deleted",
      description: "The comment has been removed.",
    });
  };

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
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        <PDFViewer documentId={id} />

        {/* Like section */}
        <div className="mt-6 flex items-center gap-2">
          <Button 
            variant={hasLiked ? "default" : "outline"} 
            size="sm" 
            onClick={handleLike}
            className={hasLiked ? "bg-study-600 hover:bg-study-700" : ""}
          >
            <ThumbsUp className="mr-1 h-4 w-4" /> 
            {hasLiked ? "Liked" : "Like"} ({likes})
          </Button>
        </div>

        {/* Comments section */}
        <div className="mt-8 space-y-4">
          <h2 className="flex items-center text-xl font-semibold">
            <MessageSquare className="mr-2 h-5 w-5" /> Comments ({comments.length})
          </h2>
          
          {/* Comment form */}
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <div className="space-y-2">
              <Input 
                placeholder="Your name" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Share your thoughts about this document..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <Button onClick={handleAddComment} className="bg-study-600 hover:bg-study-700">
              Post Comment
            </Button>
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium">{comment.userName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{comment.timestamp}</span>
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Admin Edit Dialog */}
      {isAdmin && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>
                Make changes to the document information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="editTitle">Title</label>
                <Input
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="editDescription">Description</label>
                <Textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default Reader;
