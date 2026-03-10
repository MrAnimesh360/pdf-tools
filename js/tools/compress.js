UI.register('compress', {
  render(root) {
    root.innerHTML = `
      <h3>Compress PDF</h3>
      <input id="file" type="file" accept="application/pdf">
      <select id="mode">
        <option value="fast">Fast (object stream)</option>
        <option value="strong">Strong (rebuild with JPEG)</option>
      </select>
      <button id="run">Compress</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      UI.setStatus('Compressing PDF...');
      const mode = root.querySelector('#mode').value;
      const bytes = mode === 'strong'
        ? await PDFEngine.rebuildFromRenderedPages(file, null, 0.68, 1.0)
        : await PDFEngine.compressByResave(file);
      PDFEngine.download(bytes, 'compressed.pdf');
      UI.setStatus('Compression complete.');
    };
  }
});
