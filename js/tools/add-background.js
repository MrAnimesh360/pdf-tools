UI.register('add-background', {
  render(root) {
    root.innerHTML = `
      <h3>Add Background</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="color" type="color" value="#ffffff">
      <input id="image" type="file" accept="image/png,image/jpeg">
      <button id="run">Apply Background</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find((f) => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');

      const imageFile = root.querySelector('#image').files[0];
      const color = PDFEngine.rgbFromHex(root.querySelector('#color').value);
      const options = { color, imageOpacity: 0.16 };

      if (imageFile) {
        options.imageBytes = await imageFile.arrayBuffer();
        options.imageType = imageFile.type.includes('png') ? 'png' : 'jpg';
      }

      const out = await PDFEngine.addBackgroundToPdf(file, options);
      PDFEngine.download(out, 'background.pdf');
      UI.setStatus('Background applied without hiding original content.');
    };
  }
});
