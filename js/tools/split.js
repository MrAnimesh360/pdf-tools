UI.register('split', {
  render(root) {
    root.innerHTML = `
      <h3>Split PDF</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="ranges" placeholder="Ranges: 1-2, 3-5, 6">
      <button id="run">Split & Download ZIP</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const ranges = root.querySelector('#ranges').value.split(',').map(v => v.trim()).filter(Boolean);
      if (!ranges.length) return UI.setStatus('Enter at least one range.');
      UI.setStatus('Splitting...');
      const zip = await PDFEngine.splitByRangesZip(file, ranges);
      PDFEngine.download(zip, 'split-output.zip', 'application/zip');
      UI.setStatus('Split complete.');
    };
  }
});
