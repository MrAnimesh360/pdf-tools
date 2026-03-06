/* Core client-side PDF operations shared by all tool modules. */
window.PDFEngine = (() => {
  const { PDFDocument, StandardFonts, rgb, degrees } = PDFLib;

  const readArrayBuffer = (file) => file.arrayBuffer();
  const download = (bytes, name, mime = 'application/pdf') => {
    const blob = new Blob([bytes], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1200);
  };

  const parseRanges = (text, max) => {
    const parts = text.split(',').map((v) => v.trim()).filter(Boolean);
    const pages = new Set();
    for (const p of parts) {
      if (p.includes('-')) {
        const [a, b] = p.split('-').map((n) => Math.max(1, parseInt(n, 10)));
        for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (i <= max) pages.add(i - 1);
      } else {
        const n = parseInt(p, 10);
        if (n >= 1 && n <= max) pages.add(n - 1);
      }
    }
    return [...pages].sort((a, b) => a - b);
  };

  const merge = async (files) => {
    const out = await PDFDocument.create();
    for (const file of files) {
      const src = await PDFDocument.load(await readArrayBuffer(file));
      const copied = await out.copyPages(src, src.getPageIndices());
      copied.forEach((p) => out.addPage(p));
    }
    return out.save();
  };

  const split = async (file, chunks) => {
    const src = await PDFDocument.load(await readArrayBuffer(file));
    const zip = new JSZip();
    const max = src.getPageCount();
    let i = 1;
    for (const range of chunks) {
      const idx = parseRanges(range, max);
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, idx);
      pages.forEach((p) => out.addPage(p));
      zip.file(`split-${i++}.pdf`, await out.save());
    }
    return zip.generateAsync({ type: 'uint8array' });
  };

  const copySelected = async (file, indices) => {
    const src = await PDFDocument.load(await readArrayBuffer(file));
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, indices);
    pages.forEach((p) => out.addPage(p));
    return out.save();
  };

  const rotate = async (file, indices, angle) => {
    const pdf = await PDFDocument.load(await readArrayBuffer(file));
    indices.forEach((i) => pdf.getPage(i).setRotation(degrees(angle)));
    return pdf.save();
  };

  const addTextToPages = async (file, drawFn) => {
    const pdf = await PDFDocument.load(await readArrayBuffer(file));
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    pdf.getPages().forEach((page, i) => drawFn(page, i, font, rgb));
    return pdf.save();
  };

  const addImageWatermark = async (file, imageFile, opacity=0.3) => {
    const pdf = await PDFDocument.load(await readArrayBuffer(file));
    const bytes = await readArrayBuffer(imageFile);
    const ext = imageFile.type.includes('png') ? 'png' : 'jpg';
    const img = ext === 'png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    for (const page of pdf.getPages()) {
      const { width, height } = page.getSize();
      const w = width * 0.4;
      const h = (img.height / img.width) * w;
      page.drawImage(img, { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h, opacity });
    }
    return pdf.save();
  };

  const imagesToPdf = async (files) => {
    const pdf = await PDFDocument.create();
    for (const file of files) {
      const bytes = await readArrayBuffer(file);
      const img = file.type.includes('png') ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    return pdf.save();
  };

  const pdfToText = async (file) => {
    const raw = new Uint8Array(await readArrayBuffer(file));
    const doc = await pdfjsLib.getDocument({ data: raw }).promise;
    let txt = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const c = await page.getTextContent();
      txt += `\n\n--- Page ${i} ---\n` + c.items.map((x) => x.str).join(' ');
    }
    return txt.trim();
  };

  const pdfToImages = async (file, format='png', scale=1.5) => {
    const raw = new Uint8Array(await readArrayBuffer(file));
    const doc = await pdfjsLib.getDocument({ data: raw }).promise;
    const zip = new JSZip();
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const vp = p.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width; canvas.height = vp.height;
      await p.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const data = canvas.toDataURL(mime, 0.82).split(',')[1];
      zip.file(`page-${i}.${format === 'jpg' ? 'jpg' : 'png'}`, data, { base64: true });
    }
    return zip.generateAsync({ type: 'uint8array' });
  };

  const previewThumbs = async (file, scale=0.4) => {
    const raw = new Uint8Array(await readArrayBuffer(file));
    const doc = await pdfjsLib.getDocument({ data: raw }).promise;
    const thumbs = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const vp = p.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width; canvas.height = vp.height;
      await p.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      thumbs.push(canvas.toDataURL('image/png'));
    }
    return thumbs;
  };

  const metadata = async (file) => {
    const raw = new Uint8Array(await readArrayBuffer(file));
    const doc = await pdfjsLib.getDocument({ data: raw }).promise;
    const { info, metadata } = await doc.getMetadata();
    return { info, metadata: metadata?.getAll?.() || {} };
  };

  const setMetadata = async (file, meta) => {
    const pdf = await PDFDocument.load(await readArrayBuffer(file));
    if (meta.title) pdf.setTitle(meta.title);
    if (meta.author) pdf.setAuthor(meta.author);
    if (meta.subject) pdf.setSubject(meta.subject);
    if (meta.keywords) pdf.setKeywords(meta.keywords.split(',').map((k) => k.trim()).filter(Boolean));
    return pdf.save();
  };

  const withProgress = async (cb, progressEl) => {
    progressEl.innerHTML = '<div class="progress"><div class="bar"></div></div>';
    const bar = progressEl.querySelector('.bar');
    bar.style.width = '20%';
    const res = await cb((v) => bar.style.width = `${v}%`);
    bar.style.width = '100%';
    setTimeout(() => progressEl.innerHTML = '', 900);
    return res;
  };

  return { readArrayBuffer, download, parseRanges, merge, split, copySelected, rotate, addTextToPages, addImageWatermark, imagesToPdf, pdfToText, pdfToImages, previewThumbs, metadata, setMetadata, withProgress };
})();
