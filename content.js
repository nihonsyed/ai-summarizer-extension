// Ensure the listener is properly set up
console.log('Content script loaded and ready');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Message received:', msg);
  
  if (msg.action === 'extract_text') {
    try {
      const text = window.extractMainContent 
        ? window.extractMainContent()
        : document.body.innerText;
      
      console.log('Content extracted, length:', text.length);
      sendResponse({ text: text.trim().slice(0, 8000) });
    } catch (error) {
      console.error('Extraction error:', error);
      sendResponse({ error: error.message });
    }
    return true; // Keep the message channel open
  }
});