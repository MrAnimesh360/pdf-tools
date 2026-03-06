UI.register('reorder-pages', {
  render(root) {
    root.innerHTML = `
      <h3>Reorder Pages</h3>
      <input id="file" type="file" accept="application/pdf">
      <button id="load" class="secondary">Load Pages</button>
      <ul id="list" class="drag-list"></ul>
      <button id="run">Export Reordered PDF</button>`;

    const list = root.querySelector('#list');
    let file;

    const makeDraggable = (li) => {
      li.draggable = true;
      li.addEventListener('dragstart', () => li.classList.add('dragging'));
      li.addEventListener('dragend', () => li.classList.remove('dragging'));
      li.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = list.querySelector('.dragging');
        if (dragging && dragging !== li) list.insertBefore(dragging, li.nextSibling);
      });
    };

    root.querySelector('#load').onclick = async () => {
      file = root.querySelector('#file').files[0] || window.__droppedFiles.find(f => f.type.includes('pdf'));
      if (!file) return UI.setStatus('Select a PDF file.');
      const pdf = await PDFEngine.readPdf(file);
      list.innerHTML = '';
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const li = document.createElement('li');
        li.className = 'drag-item';
        li.dataset.index = String(i);
        li.textContent = `Page ${i + 1}`;
        makeDraggable(li);
        list.appendChild(li);
      }
      UI.setStatus('Drag items to reorder pages.');
    };

    root.querySelector('#run').onclick = async () => {
      if (!file) return UI.setStatus('Load a PDF first.');
      const indexes = [...list.children].map(li => Number(li.dataset.index));
      const bytes = await PDFEngine.extractPages(file, indexes);
      PDFEngine.download(bytes, 'reordered.pdf');
      UI.setStatus('Reordered PDF ready.');
    };
  }
});
