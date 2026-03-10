UI.register('grayscale', {
  render(root) {
    root.innerHTML = `
      <h3>Grayscale PDF</h3>
      <input id="file" type="file" accept="application/pdf">
      <button id="run">Convert to Grayscale</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      UI.setStatus('Converting to grayscale...');
      const bytes = await PDFEngine.rebuildFromRenderedPages(file, (ctx, canvas) => {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < data.data.length; i += 4) {
          const g = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
          data.data[i] = g;
          data.data[i + 1] = g;
          data.data[i + 2] = g;
        }
        ctx.putImageData(data, 0, 0);
      }, 0.8, 1.15);
      PDFEngine.download(bytes, 'grayscale.pdf');
      UI.setStatus('Grayscale PDF ready.');
    };
  }
});
