# PDF Tools

A modern **browser-based PDF toolkit** that runs entirely on the client side.
All processing happens locally in the user’s browser — **no file uploads, no servers, no privacy risk**.

This project is designed to be **lightweight, fast, and deployable on GitHub Pages** while providing a clean professional interface for common PDF operations.

---

## Live Demo

**Landing Page**
https://mranimesh360.github.io/pdf-tools/

**Toolkit Workspace**
https://mranimesh360.github.io/pdf-tools/tools.html

---

## Overview

PDF Tools is a modular web application that provides a set of practical utilities for working with PDF files directly in the browser.

Unlike traditional online PDF tools, this project processes files **entirely client-side**, ensuring:

* better privacy
* faster performance
* zero backend infrastructure

The application is suitable for deployment on **static hosting platforms** such as GitHub Pages.

---

## Key Features

* Client-side PDF processing
* Responsive workspace UI
* Drag-and-drop file uploads
* Tool category filters
* Instant search for tools
* Real-time progress and status messages
* File previews where applicable
* Direct download of processed files

---

## Available Tool Categories

### Organize

* Merge PDF
* Split PDF
* Reorder Pages
* Delete Pages
* Rotate Pages
* Extract Pages

### Convert

* PDF to Images
* Images to PDF
* PDF to Text

### Edit

* Watermark PDF
* Page Numbers
* Header & Footer
* Add Background
* Add Border

### Optimize

* Compress PDF
* Grayscale Conversion

### Security

* Protect PDF

### Metadata & Utility

* Metadata Viewer
* Metadata Editor
* Preview Tools

---

## Technologies Used

This project is built using lightweight client-side libraries:

* **pdf-lib**
  PDF creation and manipulation

* **PDF.js**
  Rendering and previewing PDF documents

* **JSZip**
  Packaging files for download

* **Vanilla JavaScript**
  Application logic and UI behavior

* **Modern CSS**
  Responsive layout and styling

---

## Project Structure

```
pdf-tools/
│
├── index.html
├── tools.html
│
├── css/
│   ├── main.css
│   └── tools.css
│
├── js/
│   ├── bootstrap.js
│   └── tools/
│       ├── merge.js
│       ├── split.js
│       ├── reorder-pages.js
│       ├── delete-pages.js
│       ├── rotate-pages.js
│       ├── extract-pages.js
│       ├── pdf-to-images.js
│       ├── images-to-pdf.js
│       ├── pdf-to-text.js
│       ├── preview.js
│       ├── watermark.js
│       ├── page-numbers.js
│       ├── header-footer.js
│       ├── add-background.js
│       ├── add-border.js
│       ├── compress.js
│       ├── grayscale.js
│       ├── protect.js
│       ├── metadata-viewer.js
│       └── metadata-editor.js
│
└── lib/
    ├── pdf-lib.min.js
    ├── pdf.min.js
    └── jszip.min.js
```

---

## Running Locally

You can run the project locally using any static web server.

Example using Python:

```
python3 -m http.server 4173
```

Then open in your browser:

```
http://localhost:4173/index.html
```

or

```
http://localhost:4173/tools.html
```

---

## Deployment

This project is deployed using **GitHub Pages**.

Live site:

https://mranimesh360.github.io/pdf-tools/

Because the project is fully client-side, **no backend server is required**.

---

## Privacy

All PDF processing happens directly in the browser using JavaScript.
Files are **never uploaded or stored on any server**.

This ensures complete user privacy and secure document handling.

---

## License

This project is open source and available for educational and personal use.
