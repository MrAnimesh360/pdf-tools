# PDF Tools

Professional browser-based PDF toolkit built for GitHub Pages and Blogger iframe embeds.

## Highlights
- 20 fully client-side PDF tools
- Dark modern responsive UI with search and category filters
- Drag-drop support, progress indicators, and output downloads
- Uses `pdf-lib`, `pdf.js`, and `JSZip`

## Project Structure

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
    tools/*.js
  lib/
    pdf-lib.min.js
    pdf.min.js
    jszip.min.js
```

## Run Locally
Open `index.html` or serve with any static server.

## Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to `Deploy from a branch`, choose `main` and `/root`.
4. Save and wait for deployment.

Published URLs:
- Landing page: `https://USERNAME.github.io/pdf-tools/`
- Toolkit page: `https://USERNAME.github.io/pdf-tools/tools.html`

## Blogger Embed
```html
<iframe src="https://USERNAME.github.io/pdf-tools/tools.html" width="100%" height="800" style="border:0;"></iframe>
```
