class GrammarChecker {
  constructor() {
    this.currentInput = null;
    this.currentIcon = null;
    this.popup = null;
    this.init();
  }

  init() {
    this.createPopup();
    this.attachEventListeners();
    this.observeDOM();
  }

  createPopup() {
    this.popup = document.createElement('div');
    this.popup.id = 'grammar-checker-popup';
    this.popup.style.display = 'none';
    document.body.appendChild(this.popup);
  }

  attachEventListeners() {
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
    document.addEventListener('input', this.handleInput.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  observeDOM() {
    const observer = new MutationObserver(() => {
      this.processNewElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processNewElements() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea, [contenteditable="true"]');
    inputs.forEach(input => {
      if (!input.dataset.grammarProcessed) {
        input.dataset.grammarProcessed = 'true';
      }
    });
  }

  handleFocusIn(event) {
    const target = event.target;
    if (this.isTextInput(target)) {
      this.currentInput = target;
    }
  }

  handleFocusOut(event) {
    setTimeout(() => {
      if (this.currentIcon && !this.popup.contains(event.relatedTarget)) {
        this.hideIcon();
      }
    }, 100);
  }

  handleInput(event) {
    const target = event.target;
    if (this.isTextInput(target) && target.value.trim()) {
      this.showIcon(target);
    } else {
      this.hideIcon();
    }
  }

  handleClick(event) {
    if (event.target.classList.contains('grammar-icon')) {
      event.preventDefault();
      this.checkGrammar(event.target);
    } else if (event.target.classList.contains('grammar-suggestion')) {
      this.applySuggestion(event.target);
    } else if (!this.popup.contains(event.target)) {
      this.hidePopup();
    }
  }

  isTextInput(element) {
    return element.tagName === 'TEXTAREA' || 
           (element.tagName === 'INPUT' && ['text', 'email', 'search'].includes(element.type)) ||
           element.contentEditable === 'true';
  }

  showIcon(input) {
    this.hideIcon();
    
    const icon = document.createElement('div');
    icon.className = 'grammar-icon';
    icon.innerHTML = '✓';
    icon.title = 'Check Grammar';
    
    const rect = input.getBoundingClientRect();
    icon.style.left = (rect.right - 25 + window.scrollX) + 'px';
    icon.style.top = (rect.top + 5 + window.scrollY) + 'px';
    
    document.body.appendChild(icon);
    this.currentIcon = icon;
  }

  hideIcon() {
    if (this.currentIcon) {
      this.currentIcon.remove();
      this.currentIcon = null;
    }
  }

  async checkGrammar(icon) {
    if (!this.currentInput) return;
    
    const text = this.getCurrentText();
    if (!text.trim()) return;

    icon.innerHTML = '⏳';
    icon.style.pointerEvents = 'none';

    try {
      const correctedText = await this.callGrammarAPI(text);
      this.showSuggestion(correctedText, icon);
    } catch (error) {
      console.error('Grammar check failed:', error);
      this.showError(icon);
    }
  }

  getCurrentText() {
    if (this.currentInput.contentEditable === 'true') {
      return this.currentInput.textContent || this.currentInput.innerText;
    }
    return this.currentInput.value;
  }

  async callGrammarAPI(text) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: 'checkGrammar',
        text: text
      }, response => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.correctedText);
        }
      });
    });
  }

  showSuggestion(correctedText, icon) {
    const originalText = this.getCurrentText();
    
    if (correctedText === originalText) {
      this.showNoChanges(icon);
      return;
    }

    this.popup.innerHTML = `
      <div class="grammar-popup-header">Grammar Suggestion</div>
      <div class="grammar-suggestion" data-text="${this.escapeHtml(correctedText)}">
        ${this.escapeHtml(correctedText)}
      </div>
      <div class="grammar-popup-footer">Click to apply</div>
    `;

    const iconRect = icon.getBoundingClientRect();
    this.popup.style.left = (iconRect.left - 200 + window.scrollX) + 'px';
    this.popup.style.top = (iconRect.bottom + 5 + window.scrollY) + 'px';
    this.popup.style.display = 'block';

    icon.innerHTML = '✓';
    icon.style.pointerEvents = 'auto';
  }

  showNoChanges(icon) {
    this.popup.innerHTML = `
      <div class="grammar-popup-header">Grammar Check</div>
      <div class="grammar-no-changes">No corrections needed!</div>
    `;

    const iconRect = icon.getBoundingClientRect();
    this.popup.style.left = (iconRect.left - 200 + window.scrollX) + 'px';
    this.popup.style.top = (iconRect.bottom + 5 + window.scrollY) + 'px';
    this.popup.style.display = 'block';

    icon.innerHTML = '✓';
    icon.style.pointerEvents = 'auto';

    setTimeout(() => {
      this.hidePopup();
    }, 2000);
  }

  showError(icon) {
    this.popup.innerHTML = `
      <div class="grammar-popup-header">Error</div>
      <div class="grammar-error">Unable to check grammar. Please try again.</div>
    `;

    const iconRect = icon.getBoundingClientRect();
    this.popup.style.left = (iconRect.left - 200 + window.scrollX) + 'px';
    this.popup.style.top = (iconRect.bottom + 5 + window.scrollY) + 'px';
    this.popup.style.display = 'block';

    icon.innerHTML = '⚠️';
    icon.style.pointerEvents = 'auto';

    setTimeout(() => {
      this.hidePopup();
    }, 3000);
  }

  applySuggestion(element) {
    const correctedText = element.dataset.text;
    
    if (this.currentInput.contentEditable === 'true') {
      this.currentInput.textContent = correctedText;
      this.currentInput.innerText = correctedText;
    } else {
      this.currentInput.value = correctedText;
    }

    // Trigger input event to notify other scripts
    const event = new Event('input', { bubbles: true });
    this.currentInput.dispatchEvent(event);

    this.hidePopup();
    this.hideIcon();
  }

  hidePopup() {
    this.popup.style.display = 'none';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the grammar checker
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GrammarChecker();
  });
} else {
  new GrammarChecker();
}