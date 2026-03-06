window.PDFEngine = (() => {
  const ensurePdfJs = () => {
    if (!window.pdfjsLib) throw new Error('pdf.js failed to load.');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    }
  };

  const readArrayBuffer = (file) => file.arrayBuffer();

  const download = (bytes, name, mime = 'application/pdf') => {
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const parsePageSelection = (value, totalPages) => {
    if (!value?.trim()) return [];
    const set = new Set();
    value.split(',').map(v => v.trim()).filter(Boolean).forEach(part => {
      if (part.includes('-')) {
        const [startRaw, endRaw] = part.split('-');
        const start = Number(startRaw);
        const end = Number(endRaw);
        if (Number.isFinite(start) && Number.isFinite(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(totalPages, Math.max(start, end));
          for (let i = min; i <= max; i++) set.add(i - 1);
        }
      } else {
        const n = Number(part);
        if (Number.isFinite(n) && n >= 1 && n <= totalPages) set.add(n - 1);
      }
    });
    return [...set].sort((a, b) => a - b);
  };

  const readPdf = async (file) => PDFLib.PDFDocument.load(await readArrayBuffer(file));

  const merge = async (files) => {
    const out = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const src = await readPdf(file);
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach(p => out.addPage(p));
    }
    return out.save();
  };

  const extractPages = async (file, indexes) => {
    const src = await readPdf(file);
    const out = await PDFLib.PDFDocument.create();
    const pages = await out.copyPages(src, indexes);
    pages.forEach(p => out.addPage(p));
    return out.save();
  };

  const splitByRangesZip = async (file, ranges) => {
    const src = await readPdf(file);
    const zip = new JSZip();
    const total = src.getPageCount();

    let part = 1;
    for (const range of ranges) {
      const indexes = parsePageSelection(range, total);
      if (!indexes.length) continue;
      const out = await PDFLib.PDFDocument.create();
      const pages = await out.copyPages(src, indexes);
      pages.forEach(p => out.addPage(p));
      zip.file(`split-${part++}.pdf`, await out.save());
    }

    return zip.generateAsync({ type: 'uint8array' });
  };

  const renderPageCanvas = async (pdfPage, scale = 1.5) => {
    const viewport = pdfPage.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
    return { canvas, ctx, viewport };
  };

  const previewImages = async (file, scale = 0.35) => {
    ensurePdfJs();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(await readArrayBuffer(file)) }).promise;
    const images = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const { canvas } = await renderPageCanvas(page, scale);
      images.push(canvas.toDataURL('image/png'));
    }
    return images;
  };

  const pdfToImagesZip = async (file, format = 'png', scale = 1.5) => {
    ensurePdfJs();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(await readArrayBuffer(file)) }).promise;
    const zip = new JSZip();
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const { canvas } = await renderPageCanvas(page, scale);
      const isJpg = format === 'jpg';
      const data = canvas.toDataURL(isJpg ? 'image/jpeg' : 'image/png', 0.85).split(',')[1];
      zip.file(`page-${i}.${isJpg ? 'jpg' : 'png'}`, data, { base64: true });
    }
    return zip.generateAsync({ type: 'uint8array' });
  };

  const pdfToText = async (file) => {
    ensurePdfJs();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(await readArrayBuffer(file)) }).promise;
    const all = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const text = await page.getTextContent();
      all.push(`--- Page ${i} ---\n${text.items.map(x => x.str).join(' ')}`);
    }
    return all.join('\n\n');
  };

  const imagesToPdf = async (files) => {
    const pdf = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const bytes = await readArrayBuffer(file);
      const isPng = file.type.includes('png');
      const image = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    return pdf.save();
  };

  const addPageText = async (file, drawer) => {
    const pdf = await readPdf(file);
    const font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
    pdf.getPages().forEach((page, index) => drawer(page, index, font));
    return pdf.save();
  };

  const rgbFromHex = (hex) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    return PDFLib.rgb(r, g, b);
  };

  const getMetadata = async (file) => {
    ensurePdfJs();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(await readArrayBuffer(file)) }).promise;
    return doc.getMetadata();
  };

  const setMetadata = async (file, payload) => {
    const pdf = await readPdf(file);
    if (payload.title) pdf.setTitle(payload.title);
    if (payload.author) pdf.setAuthor(payload.author);
    if (payload.subject) pdf.setSubject(payload.subject);
    if (payload.keywords) pdf.setKeywords(payload.keywords.split(',').map(v => v.trim()).filter(Boolean));
    return pdf.save();
  };

  const compressByResave = async (file) => {
    const pdf = await readPdf(file);
    return pdf.save({ useObjectStreams: true, objectsPerTick: 30 });
  };

  const rebuildFromRenderedPages = async (file, mutator, quality = 0.8, scale = 1.2) => {
    ensurePdfJs();
    const src = await pdfjsLib.getDocument({ data: new Uint8Array(await readArrayBuffer(file)) }).promise;
    const out = await PDFLib.PDFDocument.create();
    for (let i = 1; i <= src.numPages; i++) {
      const page = await src.getPage(i);
      const { canvas, ctx, viewport } = await renderPageCanvas(page, scale);
      if (mutator) mutator(ctx, canvas);
      const jpgData = canvas.toDataURL('image/jpeg', quality);
      const jpg = await out.embedJpg(jpgData);
      const newPage = out.addPage([viewport.width, viewport.height]);
      newPage.drawImage(jpg, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    }
    return out.save();
  };

  const updateProgress = (el, pct) => {
    if (!el) return;
    el.innerHTML = '<div class="progress"><div class="bar"></div></div>';
    el.querySelector('.bar').style.width = `${pct}%`;
  };

  return {
    readPdf,
    readArrayBuffer,
    download,
    parsePageSelection,
    merge,
    extractPages,
    splitByRangesZip,
    previewImages,
    pdfToImagesZip,
    pdfToText,
    imagesToPdf,
    addPageText,
    rgbFromHex,
    getMetadata,
    setMetadata,
    compressByResave,
    rebuildFromRenderedPages,
    updateProgress,
  };
})();
