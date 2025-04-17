
/**
 * Service to handle storage events and data synchronization between tabs
 */

// Function to dispatch custom events when localStorage changes
export const dispatchCustomEvent = (key: string, data: any) => {
  // Create a custom event with the data
  const event = new CustomEvent(`lovable-${key}-updated`, { 
    detail: { data } 
  });
  
  // Dispatch the event for other components to listen to
  window.dispatchEvent(event);
  
  // Also update localStorage
  localStorage.setItem(key, JSON.stringify(data));
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
