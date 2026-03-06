UI.register('images-to-pdf', {
  render(root) {
    root.innerHTML = `
      <h3>Images → PDF</h3>
      <input id="files" type="file" accept="image/png,image/jpeg" multiple>
      <button id="run">Create PDF</button>`;

    root.querySelector('#run').onclick = async () => {
      const files = [...root.querySelector('#files').files, ...window.__droppedFiles].filter(f => f.type.startsWith('image/'));
      if (!files.length) return UI.setStatus('Select one or more images.');
      const bytes = await PDFEngine.imagesToPdf(files);
      PDFEngine.download(bytes, 'images-to-pdf.pdf');
      UI.setStatus('PDF created from images.');
    };
  }
});
