(() => {
  const dz = document.getElementById('drop-zone');
  window.__droppedFiles = [];

  const setDropState = (active) => dz.classList.toggle('active', active);

  dz.addEventListener('dragover', (e) => { e.preventDefault(); setDropState(true); });
  dz.addEventListener('dragleave', () => setDropState(false));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    setDropState(false);
    window.__droppedFiles = [...e.dataTransfer.files];
    UI.setStatus(`${window.__droppedFiles.length} dropped file(s) available for current tool.`);
  });

  UI.buildFilters();
  UI.buildToolList();
  Search.init();
  Search.apply();
  UI.loadTool('merge');
})();
