UI.register('pdf-to-text', {
  render(root) {
    root.innerHTML = `
      <h3>PDF → Text</h3>
      <input id="file" type="file" accept="application/pdf">
      <div class="row">
        <button id="extract">Extract Text</button>
        <button id="download" class="secondary">Download TXT</button>
      </div>
      <textarea id="output" placeholder="Extracted text will appear here."></textarea>`;

    root.querySelector('#extract').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      UI.setStatus('Extracting text...');
      root.querySelector('#output').value = await PDFEngine.pdfToText(file);
      UI.setStatus('Text extracted.');
    };

    root.querySelector('#download').onclick = () => {
      const text = root.querySelector('#output').value;
      if (!text.trim()) return UI.setStatus('No text to download.');
      PDFEngine.download(new TextEncoder().encode(text), 'pdf-text.txt', 'text/plain');
    };
  }
});
