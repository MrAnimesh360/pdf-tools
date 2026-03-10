UI.register('page-numbers', {
  render(root) {
    root.innerHTML = `
      <h3>Add Page Numbers</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="start" type="number" value="1" min="1">
      <button id="run">Apply</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const start = Number(root.querySelector('#start').value || 1);
      const bytes = await PDFEngine.addPageText(file, (page, i, font) => {
        const { width } = page.getSize();
        page.drawText(String(start + i), { x: width - 45, y: 18, size: 11, font, color: PDFLib.rgb(.95, .95, .95) });
      });
      PDFEngine.download(bytes, 'page-numbers.pdf');
      UI.setStatus('Page numbers added.');
    };
  }
});
