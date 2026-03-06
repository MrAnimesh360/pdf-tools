window.Search = (() => {
  const apply = () => {
    const query = document.getElementById('tool-search').value.toLowerCase().trim();
    document.querySelectorAll('.tool-btn').forEach(btn => {
      const textMatch = btn.textContent.toLowerCase().includes(query);
      const catMatch = !UI.state.currentFilter || btn.dataset.category === UI.state.currentFilter;
      btn.style.display = textMatch && catMatch ? 'block' : 'none';
    });
  };

  const init = () => {
    document.getElementById('tool-search').addEventListener('input', apply);
  };

  return { init, apply };
})();
