
/**
 * Service to handle storage events and data synchronization between tabs
 */

// Function to dispatch custom events when localStorage changes
export const dispatchCustomEvent = (key: string, data: any) => {
  try {
    // Create a custom event with the data
    const event = new CustomEvent(`lovable-${key}-updated`, { 
      detail: { data } 
    });
    
    // Dispatch the event for other components to listen to
    window.dispatchEvent(event);
    
    // Try to update localStorage, but handle quota exceeded errors
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn(`Storage quota exceeded for ${key}. Some data might not be persisted across sessions.`);
        
        // If it's PDF documents, we can try to store them without the content field
        if (key === 'pdfDocuments' && Array.isArray(data)) {
          const minimalPdfs = data.map(pdf => {
            // Create a copy without the content field to reduce size
            const { content, ...minimalPdf } = pdf;
            return minimalPdf;
          });
          
          try {
            localStorage.setItem(key, JSON.stringify(minimalPdfs));
            console.log(`Stored ${minimalPdfs.length} PDFs without content to prevent quota issues`);
          } catch (storageError) {
            console.error('Still unable to store data:', storageError);
          }
        }
      } else {
        console.error('Error storing data:', error);
      }
    }
  } catch (error) {
    console.error('Error dispatching event:', error);
  }
};

// Function to listen for custom events
export const listenForStorageEvents = (key: string, callback: (data: any) => void) => {
  const handleEvent = (event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      callback(JSON.parse(event.newValue));
    }
  };
  
  const handleCustomEvent = (event: CustomEvent) => {
    callback(event.detail.data);
  };
  
  // Listen for both localStorage changes (between tabs) and custom events (same tab)
  window.addEventListener('storage', handleEvent);
  window.addEventListener(`lovable-${key}-updated`, handleCustomEvent as EventListener);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleEvent);
    window.removeEventListener(`lovable-${key}-updated`, handleCustomEvent as EventListener);
  };
};

// Helper to safely store PDF data in memory with fallback to sessionStorage
let inMemoryStore: Record<string, any> = {};

export const storeDocumentContent = (id: string, content: string) => {
  try {
    inMemoryStore[id] = content;
    return true;
  } catch (error) {
    console.warn('Failed to store document in memory, attempting sessionStorage:', error);
    try {
      sessionStorage.setItem(`pdf_content_${id}`, content);
      return true;
    } catch (sessionError) {
      console.error('Failed to store document content:', sessionError);
      return false;
    }
  }
};

export const getDocumentContent = (id: string): string | null => {
  // First try in-memory store
  if (inMemoryStore[id]) {
    return inMemoryStore[id];
  }
  
  // Then try sessionStorage
  try {
    const content = sessionStorage.getItem(`pdf_content_${id}`);
    if (content) return content;
  } catch (error) {
    console.warn('Error accessing sessionStorage:', error);
  }
  
  return null;
};
