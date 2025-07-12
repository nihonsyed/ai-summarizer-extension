import { summarizeWithGemini } from './agent.js';

document.getElementById('summarizeBtn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      document.getElementById('summary').textContent = '❌ No active tab found.';
      return;
    }

    // Block special pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      document.getElementById('summary').textContent = '❌ Cannot summarize browser pages';
      return;
    }

    document.getElementById('summary').textContent = '⏳ Extracting content...';
    
    let response;
    try {
      // First try regular message passing
      response = await chrome.tabs.sendMessage(tab.id, { action: 'extract_text' });
    } catch (err) {
      console.warn('Message failed, trying programmatic injection:', err);
      
      // Fallback: programmatic injection
      try {
        const injectionResults = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            return window.extractMainContent 
              ? window.extractMainContent()
              : document.body.innerText;
          }
        });
        response = { text: injectionResults[0].result };
      } catch (injectionError) {
        console.error('Injection failed:', injectionError);
        throw new Error('Failed to access page content. Try refreshing the page.');
      }
    }

    if (!response?.text) {
      throw new Error('No content extracted');
    }

    document.getElementById('summary').textContent = '⏳ Summarizing...';
    const summary = await summarizeWithGemini(response.text.slice(0, 8000));
    document.getElementById('summary').textContent = summary;

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('summary').textContent = `❌ Error: ${error.message}`;
  }
});