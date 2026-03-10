UI.register('pdf-to-images', {
  render(root) {
    root.innerHTML = `
      <h3>PDF → Images</h3>
      <input id="file" type="file" accept="application/pdf">
      <div class="row">
        <select id="format"><option value="png">PNG</option><option value="jpg">JPG</option></select>
        <button id="run">Convert</button>
      </div>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      UI.setStatus('Converting PDF pages to images...');
      const zip = await PDFEngine.pdfToImagesZip(file, root.querySelector('#format').value, 1.8);
      PDFEngine.download(zip, 'pdf-images.zip', 'application/zip');
      UI.setStatus('Image ZIP ready.');
    };
  }
});
