UI.register('rotate-pages', {
  render(root) {
    root.innerHTML = `
      <h3>Rotate Pages</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="pages" placeholder="Pages: 1-3 (blank = all)">
      <select id="angle"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select>
      <button id="run">Rotate</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const pdf = await PDFEngine.readPdf(file);
      const count = pdf.getPageCount();
      const selection = root.querySelector('#pages').value.trim();
      const indexes = selection ? PDFEngine.parsePageSelection(selection, count) : [...Array(count).keys()];
      const angle = Number(root.querySelector('#angle').value);
      indexes.forEach(i => pdf.getPage(i).setRotation(PDFLib.degrees(angle)));
      PDFEngine.download(await pdf.save(), 'rotated.pdf');
      UI.setStatus('Rotation complete.');
    };
  }
});
