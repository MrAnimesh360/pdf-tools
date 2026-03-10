UI.register('metadata-viewer', {
  render(root) {
    root.innerHTML = `
      <h3>View Metadata</h3>
      <input id="file" type="file" accept="application/pdf">
      <button id="run">View Metadata</button>
      <textarea id="out" readonly></textarea>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const data = await PDFEngine.getMetadata(file);
      root.querySelector('#out').value = JSON.stringify({ info: data.info, metadata: data.metadata?.getAll?.() || {} }, null, 2);
      UI.setStatus('Metadata loaded.');
    };
  }
});
