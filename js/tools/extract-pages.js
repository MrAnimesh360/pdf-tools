UI.register('extract-pages', {
  render(root) {
    root.innerHTML = `
      <h3>Extract Pages</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="pages" placeholder="Pages to extract: 1,3-5">
      <button id="run">Extract</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const pdf = await PDFEngine.readPdf(file);
      const indexes = PDFEngine.parsePageSelection(root.querySelector('#pages').value, pdf.getPageCount());
      if (!indexes.length) return UI.setStatus('Enter valid pages to extract.');
      const bytes = await PDFEngine.extractPages(file, indexes);
      PDFEngine.download(bytes, 'extracted.pdf');
      UI.setStatus('Extraction complete.');
    };
  }
});
