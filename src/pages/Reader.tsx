import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Download, ThumbsUp, MessageSquare, 
  Edit, Trash, Save, X
} from "lucide-react";
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
import PDFViewer from "@/components/pdf/PDFViewer";
import { listenForStorageEvents } from "@/services/storageEventService";

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

const getStoredComments = () => {
  const stored = localStorage.getItem('pdfComments');
  return stored ? JSON.parse(stored) : {};
};

const getStoredLikes = () => {
  const stored = localStorage.getItem('pdfLikes');
  return stored ? JSON.parse(stored) : {};
};

const generateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  isEditing?: boolean;
  editText?: string;
}

const Reader = () => {
  const { id } = useParams<{ id: string }>();
  const [pdf, setPdf] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId] = useState(generateUserId());
  
  const commentStorage = getStoredComments();
  const likeStorage = getStoredLikes();
  
  const [likes, setLikes] = useState<number>(likeStorage[id as string]?.count || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(likeStorage[id as string]?.users?.includes(currentUserId) || false);
  const [comments, setComments] = useState<Comment[]>(commentStorage[id as string] || []);
  const [newComment, setNewComment] = useState<string>("");
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || "");
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  useEffect(() => {
    const loadPdf = () => {
      if (!id) return;
      
      const storedPdfs = localStorage.getItem("pdfDocuments");
      if (storedPdfs) {
        const pdfs = JSON.parse(storedPdfs);
        const foundPdf = pdfs.find((p: any) => p.id === id);
        if (foundPdf) {
          setPdf(foundPdf);
          setEditTitle(foundPdf.title || "");
          setEditDescription(foundPdf.description || "");
        }
      }
    };
    
    loadPdf();
    
    const unsubscribe = listenForStorageEvents("pdfDocuments", (updatedPdfs) => {
      if (!id) return;
      const foundPdf = updatedPdfs.find((p: any) => p.id === id);
      if (foundPdf) {
        setPdf(foundPdf);
        setEditTitle(foundPdf.title || "");
        setEditDescription(foundPdf.description || "");
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [id]);
  
  useEffect(() => {
    const adminStatus = sessionStorage.getItem("adminLoggedIn") === "true";
    setIsAdmin(adminStatus);
    
    if (userName) {
      localStorage.setItem('userName', userName);
    }
  }, [userName]);

  const canEditComment = (comment: Comment) => {
    return comment.userId === currentUserId || isAdmin;
  };
  
  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    
    const updatedCommentStorage = {...commentStorage};
    updatedCommentStorage[id as string] = updatedComments;
    localStorage.setItem('pdfComments', JSON.stringify(updatedCommentStorage));
    
    toast({
      title: "Comment deleted",
      description: "The comment has been deleted successfully.",
    });
  };

  const handleLike = () => {
    const currentLikeStorage = {...likeStorage};
    const currentLikes = currentLikeStorage[id as string] || { count: 0, users: [] };
    
    if (!hasLiked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      
      const likedUsers = currentLikes.users || [];
      likedUsers.push(currentUserId);
      
      currentLikeStorage[id as string] = { 
        count: newLikes,
        users: likedUsers
      };
      localStorage.setItem('pdfLikes', JSON.stringify(currentLikeStorage));
      
      toast({
        title: "Thanks for your feedback!",
        description: "You liked this document.",
      });
    } else {
      const newLikes = likes - 1;
      setLikes(newLikes);
      setHasLiked(false);
      
      const likedUsers = currentLikes.users || [];
      const updatedUsers = likedUsers.filter(userId => userId !== currentUserId);
      
      currentLikeStorage[id as string] = { 
        count: newLikes,
        users: updatedUsers
      };
      localStorage.setItem('pdfLikes', JSON.stringify(currentLikeStorage));
      
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
      userId: currentUserId,
      userName: userName,
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment("");
    
    localStorage.setItem('userName', userName);
    
    const updatedCommentStorage = {...commentStorage};
    updatedCommentStorage[id as string] = updatedComments;
    localStorage.setItem('pdfComments', JSON.stringify(updatedCommentStorage));
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };
  
  const handleEditComment = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isEditing: true,
          editText: comment.text
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };
  
  const handleSaveCommentEdit = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          text: comment.editText || comment.text,
          isEditing: false,
          editText: undefined
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    
    const updatedCommentStorage = {...commentStorage};
    updatedCommentStorage[id as string] = updatedComments;
    localStorage.setItem('pdfComments', JSON.stringify(updatedCommentStorage));
    
    toast({
      title: "Comment updated",
      description: "Your comment has been updated successfully.",
    });
  };
  
  const handleCancelCommentEdit = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isEditing: false,
          editText: undefined
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };
  
  const handleChangeCommentEdit = (commentId: string, value: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          editText: value
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };
  
  const handleSaveEdit = () => {
    if (!pdf || !id) return;
    
    const storedPdfs = localStorage.getItem("pdfDocuments");
    if (storedPdfs) {
      const pdfs = JSON.parse(storedPdfs);
      const updatedPdfs = pdfs.map((p: any) => {
        if (p.id === id) {
          return {
            ...p,
            title: editTitle,
            description: editDescription
          };
        }
        return p;
      });
      
      localStorage.setItem("pdfDocuments", JSON.stringify(updatedPdfs));
      const event = new CustomEvent('pdfsUpdated', { 
        detail: { pdfs: updatedPdfs } 
      });
      window.dispatchEvent(event);
      
      setPdf({
        ...pdf,
        title: editTitle,
        description: editDescription
      });
    }
    
    toast({
      title: "Changes saved",
      description: "The document has been updated successfully.",
    });
    setIsEditDialogOpen(false);
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

        <PDFViewer 
          documentId={id} 
          pdfContent={pdf.content}
          pdfTitle={pdf.title}
          pdfCategory={pdf.category}
          pdfPages={pdf.pages}
        />

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

        <div className="mt-8 space-y-4">
          <h2 className="flex items-center text-xl font-semibold">
            <MessageSquare className="mr-2 h-5 w-5" /> Comments ({comments.length})
          </h2>
          
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

          {comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border bg-white p-4">
                  {comment.isEditing ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                      </div>
                      <Textarea 
                        value={comment.editText} 
                        onChange={(e) => handleChangeCommentEdit(comment.id, e.target.value)}
                        className="w-full"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelCommentEdit(comment.id)}
                        >
                          <X className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSaveCommentEdit(comment.id)}
                        >
                          <Save className="mr-1 h-4 w-4" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium">{comment.userName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{comment.timestamp}</span>
                          {canEditComment(comment) && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditComment(comment.id)}
                                className="h-6 w-6 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
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
