UI.register('metadata-editor', {
  render(root) {
    root.innerHTML = `
      <h3>Edit Metadata</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="title" placeholder="Title">
      <input id="author" placeholder="Author">
      <input id="subject" placeholder="Subject">
      <input id="keywords" placeholder="Keywords (comma separated)">
      <button id="run">Save Metadata</button>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const bytes = await PDFEngine.setMetadata(file, {
        title: root.querySelector('#title').value,
        author: root.querySelector('#author').value,
        subject: root.querySelector('#subject').value,
        keywords: root.querySelector('#keywords').value,
      });
      PDFEngine.download(bytes, 'metadata-updated.pdf');
      UI.setStatus('Metadata updated.');
    };
  }
});
