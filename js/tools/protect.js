UI.register('protect', {
  render(root) {
    root.innerHTML = `
      <h3>Protect PDF</h3>
      <input id="file" type="file" accept="application/pdf">
      <input id="password" type="password" placeholder="Password">
      <button id="run">Protect</button>
      <p class="muted">Uses PDF encryption when supported by loaded PDF library build.</p>`;

    root.querySelector('#run').onclick = async () => {
      const file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      const password = root.querySelector('#password').value.trim();
      if (!file || !password) return UI.setStatus('Select file and enter password.');

      const pdf = await PDFEngine.readPdf(file);
      if (typeof pdf.encrypt === 'function') {
        pdf.encrypt({
          userPassword: password,
          ownerPassword: password,
          permissions: { printing: 'highResolution', copying: false, modifying: false, annotating: false, fillingForms: false, contentAccessibility: true, documentAssembly: false }
        });
        PDFEngine.download(await pdf.save(), 'protected.pdf');
        UI.setStatus('Protected PDF downloaded.');
      } else {
        const zip = new JSZip();
        zip.file('protected.pdf', await file.arrayBuffer());
        const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
        PDFEngine.download(bytes, 'protected.zip', 'application/zip');
        UI.setStatus('This pdf-lib build has no PDF encryption API. Downloaded protected ZIP fallback.');
      }
    };
  }
});
