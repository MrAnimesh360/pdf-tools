UI.register('watermark', {
  render(root) {
    root.innerHTML = `
      <h3>Add Watermark</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="text" placeholder="Watermark text (optional)">
      <input id="image" type="file" accept="image/png,image/jpeg">
      <button id="run">Apply Watermark</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const pdf = await PDFEngine.readPdf(file);
      const imageFile = root.querySelector('#image').files[0];
      let image;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        image = imageFile.type.includes('png') ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      }

      for (const page of pdf.getPages()) {
        const { width, height } = page.getSize();
        if (image) {
          const w = width * 0.32;
          const h = (image.height / image.width) * w;
          page.drawImage(image, { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h, opacity: 0.25 });
        }
        const text = root.querySelector('#text').value.trim();
        if (text) {
          page.drawText(text, { x: width * 0.2, y: height * 0.55, size: 42, rotate: PDFLib.degrees(35), opacity: 0.22, color: PDFLib.rgb(0.8, 0.2, 0.2) });
        }
      }
      PDFEngine.download(await pdf.save(), 'watermarked.pdf');
      UI.setStatus('Watermark applied.');
    };
  }
});
