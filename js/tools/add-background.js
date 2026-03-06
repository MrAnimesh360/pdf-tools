UI.register('add-background', {
  render(root) {
    root.innerHTML = `
      <h3>Add Background</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="color" type="color" value="#ffffff">
      <input id="image" type="file" accept="image/png,image/jpeg">
      <button id="run">Apply Background</button>`;

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
      const color = PDFEngine.rgbFromHex(root.querySelector('#color').value);

      for (const page of pdf.getPages()) {
        const { width, height } = page.getSize();
        page.drawRectangle({ x: 0, y: 0, width, height, color });
        if (image) page.drawImage(image, { x: 0, y: 0, width, height, opacity: 0.18 });
      }
      PDFEngine.download(await pdf.save(), 'background.pdf');
      UI.setStatus('Background applied.');
    };
  }
});
