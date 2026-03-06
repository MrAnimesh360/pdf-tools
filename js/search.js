window.Search = (() => {
  const filterCategory = (category) => {
    const q = document.getElementById('tool-search').value.toLowerCase();
    document.querySelectorAll('.tool-btn').forEach((el) => {
      const match = el.textContent.toLowerCase().includes(q);
      const categoryMatch = !category || el.dataset.category === category;
      el.style.display = match && categoryMatch ? 'block' : 'none';
    });
  };

  const init = () => {
    document.getElementById('tool-search').addEventListener('input', () => filterCategory(''));
  };

  return { init, filterCategory };
})();
