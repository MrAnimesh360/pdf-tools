UI.register('delete-pages', {
  render(root) {
    root.innerHTML = `
      <h3>Delete Pages</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="pages" placeholder="Pages to delete: 2,4-6">
      <button id="run">Delete & Download</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const pdf = await PDFEngine.readPdf(file);
      const remove = new Set(PDFEngine.parsePageSelection(root.querySelector('#pages').value, pdf.getPageCount()));
      const keep = [...Array(pdf.getPageCount()).keys()].filter(i => !remove.has(i));
      const bytes = await PDFEngine.extractPages(file, keep);
      PDFEngine.download(bytes, 'pages-deleted.pdf');
      UI.setStatus('Pages removed.');
    };
  }
});
