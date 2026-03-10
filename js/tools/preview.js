UI.register('preview', {
  render(root) {
    root.innerHTML = `
      <h3>PDF Preview Generator</h3>
      <input id="file" type="file" accept="application/pdf">
      <button id="run">Generate Preview</button>
      <div id="grid" class="preview-grid"></div>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      UI.setStatus('Rendering thumbnails...');
      const thumbs = await PDFEngine.previewImages(file, 0.45);
      const grid = root.querySelector('#grid');
      grid.innerHTML = thumbs.map((src, i) => `<figure class="thumb"><img src="${src}" alt="Page ${i + 1}" width="100%"><figcaption>Page ${i + 1}</figcaption></figure>`).join('');
      UI.setStatus('Preview ready.');
    };
  }
});
