// Background script for handling API requests
const API_KEY = 'process.env.HUGGINGFACE_API_KEY';
const API_URL = 'https://api-inference.huggingface.co/models/prithivida/grammar_error_correcter_v1';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkGrammar') {
    checkGrammar(request.text)
      .then(correctedText => {
        sendResponse({ correctedText });
      })
      .catch(error => {
        console.error('Grammar API error:', error);
        sendResponse({ error: error.message });
      });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

async function checkGrammar(text) {
  try {
    // Clean and prepare the text
    const cleanText = text.trim();
    if (!cleanText) {
      throw new Error('Empty text provided');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: cleanText,
        parameters: {
          max_length: Math.min(cleanText.length * 2, 512),
          temperature: 0.1,
          do_sample: false
        }
      })
    });

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('Model is loading. Please try again in a few seconds.');
      } else if (response.status === 401) {
        throw new Error('API authentication failed');
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }

    const result = await response.json();
    
    // Handle different response formats
    let correctedText = '';
    
    if (Array.isArray(result) && result.length > 0) {
      // Handle array response
      if (result[0].generated_text) {
        correctedText = result[0].generated_text;
      } else if (typeof result[0] === 'string') {
        correctedText = result[0];
      }
    } else if (result.generated_text) {
      // Handle object response
      correctedText = result.generated_text;
    } else if (typeof result === 'string') {
      // Handle string response
      correctedText = result;
    }

    // Clean up the corrected text
    correctedText = correctedText.trim();
    
    // Remove any repeated input text if present
    if (correctedText.includes(cleanText)) {
      const parts = correctedText.split(cleanText);
      if (parts.length > 1) {
        correctedText = parts[parts.length - 1].trim();
      }
    }

    // If no correction was made or the result is empty, return original text
    if (!correctedText || correctedText === cleanText) {
      return cleanText;
    }

    return correctedText;
    
  } catch (error) {
    console.error('Grammar check error:', error);
    throw error;
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Grammar Checker extension installed');
  }
});