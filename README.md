# PDF Tools

A professional browser-based PDF toolkit that runs entirely client-side and is deployable on GitHub Pages.

## Live URLs
- Landing: https://mranimesh360.github.io/pdf-tools/
- Toolkit: https://mranimesh360.github.io/pdf-tools/tools.html

## Features
- 20 implemented tools across Organize, Convert, Edit, Optimize, Security, Utility
- Dark responsive UI with category filters and tool search
- Drag-and-drop uploads, progress/status messaging, previews, instant downloads
- Modular architecture: shared engine + lazy-loaded tool modules
- Client-side processing using `pdf-lib`, `pdf.js`, `JSZip`

## Structure

```text
pdf-tools/
  index.html
  tools.html
  css/
    main.css
    tools.css
  js/
    app.js
    ui.js
    search.js
    pdf-engine.js
    tools/
      merge.js
      split.js
      reorder-pages.js
      delete-pages.js
      rotate-pages.js
      extract-pages.js
      pdf-to-images.js
      images-to-pdf.js
      pdf-to-text.js
      preview.js
      watermark.js
      page-numbers.js
      header-footer.js
      add-background.js
      add-border.js
      compress.js
      grayscale.js
      protect.js
      metadata-viewer.js
      metadata-editor.js
  lib/
    pdf-lib.min.js
    pdf.min.js
    jszip.min.js
```

## Local run
Use a static server:

```bash
python3 -m http.server 4173
```

Then open:
- `http://localhost:4173/index.html`
- `http://localhost:4173/tools.html`

## GitHub Pages deployment
1. Push to GitHub.
2. Open **Repository Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main` and folder `/ (root)`.
5. Save and wait for publish.

## Blogger iframe embed
```html
<iframe src="https://mranimesh360.github.io/pdf-tools/tools.html" width="100%" height="900" style="border:0;"></iframe>
```
