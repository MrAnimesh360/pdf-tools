UI.register('add-border', {
  render(root) {
    root.innerHTML = `
      <h3>Add Page Border</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="width" type="number" value="2" min="1" max="20">
      <input id="color" type="color" value="#111111">
      <button id="run">Add Border</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const borderWidth = Number(root.querySelector('#width').value || 2);
      const color = PDFEngine.rgbFromHex(root.querySelector('#color').value);
      const bytes = await PDFEngine.addPageText(file, (page) => {
        const { width, height } = page.getSize();
        page.drawRectangle({ x: 8, y: 8, width: width - 16, height: height - 16, borderColor: color, borderWidth });
      });
      PDFEngine.download(bytes, 'bordered.pdf');
      UI.setStatus('Border added.');
    };
  }
});
