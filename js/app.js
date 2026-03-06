(() => {
  const dz = document.getElementById('drop-zone');
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.style.borderColor = '#60a5fa'; });
  dz.addEventListener('dragleave', () => dz.style.borderColor = '#334155');
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.style.borderColor = '#334155';
    window.__droppedFiles = [...e.dataTransfer.files];
    UI.setStatus(`${window.__droppedFiles.length} file(s) ready from drag-drop.`);
  });

  UI.buildFilters();
  UI.buildList();
  Search.init();
  UI.loadTool('merge');
})();
