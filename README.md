# Grammar Checker Firefox Extension

A smart Firefox extension that provides real-time grammar correction suggestions for any text input on any website using AI-powered grammar checking.

## Features

- 🔍 **Universal Detection**: Works on all text inputs across all websites
- ⚡ **Real-time Suggestions**: Get grammar corrections as you type
- 🎯 **Smart UI**: Minimal, non-intrusive interface with context menu-style popup
- 🤖 **AI-Powered**: Uses Hugging Face's grammar correction model
- 🔒 **Privacy-First**: No user data stored, API key managed securely
- 📱 **Responsive**: Works on desktop and mobile Firefox

## How It Works

1. **Detection**: The extension automatically detects when you're typing in any text field
2. **Icon Display**: A small green checkmark icon appears near the text input when you have content
3. **Grammar Check**: Click the icon to get AI-powered grammar suggestions
4. **One-Click Fix**: Click the suggestion to instantly replace your text with the corrected version

## Installation

### For Development/Testing:

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder
6. The extension will be loaded and active immediately

### For Distribution:

1. Create a ZIP file containing all extension files
2. Submit to Mozilla Add-ons store for review and publication

## File Structure

```
grammar-checker-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main functionality script
├── content.css           # Styling for UI elements
├── background.js         # API handling and background tasks
├── .env                  # Environment variables (for reference)
├── README.md            # Documentation
└── icons/               # Extension icons (16x16, 32x32, 48x48, 128x128)
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## Technical Details

### API Integration
- Uses Hugging Face Inference API
- Model: `prithivida/grammar_error_correcter_v1`
- Handles various response formats and error states
- Built-in retry logic for model loading delays

### Supported Input Types
- `<input type="text">`
- `<input type="email">`
- `<input type="search">`
- `<textarea>`
- Elements with `contenteditable="true"`

### Browser Compatibility
- Firefox 57+ (WebExtensions API)
- Manifest V2 format for maximum compatibility

## Security & Privacy

- **No Data Collection**: Extension doesn't store or track user data
- **Secure API**: API key is embedded in extension (not exposed to websites)
- **Minimal Permissions**: Only requests necessary permissions for functionality
- **Local Processing**: Text processing happens locally where possible

## Development

### Prerequisites
- Firefox Developer Edition (recommended)
- Basic knowledge of JavaScript, HTML, CSS

### API Key Management
The Hugging Face API key is embedded in `background.js` for distribution. For development:

1. The current API key is already configured
2. To use your own key, replace the `API_KEY` constant in `background.js`
3. The `.env` file is for reference only (not loaded by the extension)

### Testing
1. Load the extension in Firefox
2. Navigate to any website with text inputs
3. Type some text with grammar errors
4. Click the green checkmark icon that appears
5. Verify the grammar correction suggestions work

### Debugging
- Use Firefox Developer Tools
- Check the Browser Console for extension logs
- Use `about:debugging` to inspect the extension

## Known Limitations

- Requires internet connection for grammar checking
- API rate limits may apply (typically generous for individual use)
- Very long texts may be truncated due to model limitations
- Some specialized text formats may not be handled optimally

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in Firefox
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues:
1. Check the Firefox console for error messages
2. Verify your internet connection
3. Try reloading the extension
4. Report bugs via GitHub issues

---

**Note**: This extension includes a pre-configured API key for immediate use. The key is provided for testing and initial usage. For production deployment, consider implementing your own API key management system.