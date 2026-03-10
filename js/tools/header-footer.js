UI.register('header-footer', {
  render(root) {
    root.innerHTML = `
      <h3>Header / Footer</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="header" placeholder="Header text">
      <input id="footer" placeholder="Footer text, supports {n}">
      <button id="run">Apply</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const header = root.querySelector('#header').value;
      const footer = root.querySelector('#footer').value;
      const bytes = await PDFEngine.addPageText(file, (page, i, font) => {
        const { width, height } = page.getSize();
        if (header) page.drawText(header, { x: 20, y: height - 20, size: 11, font });
        if (footer) page.drawText(footer.replaceAll('{n}', String(i + 1)), { x: 20, y: 14, size: 11, font });
      });
      PDFEngine.download(bytes, 'header-footer.pdf');
      UI.setStatus('Header/footer added.');
    };
  }
});
