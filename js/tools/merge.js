UI.register('merge', {
  render(root) {
    root.innerHTML = `
      <h3>Merge PDF</h3>
      <input id="files" type="file" accept="application/pdf" multiple>
      <div class="row"><button id="run">Merge & Download</button><div id="progress"></div></div>`;

    root.querySelector('#run').onclick = async () => {
      const files = [...root.querySelector('#files').files, ...window.__droppedFiles].filter(f => f.type.includes('pdf'));
      if (!files.length) return UI.setStatus('Select at least one PDF file.');
      UI.setStatus('Merging...');
      PDFEngine.updateProgress(root.querySelector('#progress'), 25);
      const bytes = await PDFEngine.merge(files);
      PDFEngine.updateProgress(root.querySelector('#progress'), 100);
      PDFEngine.download(bytes, 'merged.pdf');
      UI.setStatus('Merge complete.');
    };
  }
});
