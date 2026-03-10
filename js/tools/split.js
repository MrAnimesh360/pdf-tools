UI.register('split', {
  render(root) {
    root.innerHTML = `
      <h3>Split PDF</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="ranges" placeholder="Parts: 1-3; 4-6; 7,8">
      <small class="muted">Use semicolon (;) to define separate output PDFs. Commas/ranges inside each part are supported.</small>
      <button id="run">Split & Download ZIP</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find((f) => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const groups = root.querySelector('#ranges').value.split(';').map((v) => v.trim()).filter(Boolean);
      if (!groups.length) return UI.setStatus('Enter at least one split group.');

      UI.setStatus('Splitting...');
      const zip = await PDFEngine.splitByRangesZip(file, groups);
      PDFEngine.download(zip, 'split-output.zip', 'application/zip');
      UI.setStatus('Split complete.');
    };
  }
});
