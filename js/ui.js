window.UI = (() => {
  const defs = [
    { id: 'merge', name: 'Merge PDF', category: 'Organize', desc: 'Combine multiple PDF files.' },
    { id: 'split', name: 'Split PDF', category: 'Organize', desc: 'Split by ranges or pages.' },
    { id: 'reorder-pages', name: 'Reorder Pages', category: 'Organize', desc: 'Reorder with drag list.' },
    { id: 'delete-pages', name: 'Delete Pages', category: 'Organize', desc: 'Remove selected pages.' },
    { id: 'rotate-pages', name: 'Rotate Pages', category: 'Organize', desc: 'Rotate 90/180/270.' },
    { id: 'extract-pages', name: 'Extract Pages', category: 'Organize', desc: 'Export selected pages.' },
    { id: 'pdf-to-images', name: 'PDF → Images', category: 'Convert', desc: 'Convert pages to PNG/JPG.' },
    { id: 'images-to-pdf', name: 'Images → PDF', category: 'Convert', desc: 'Build PDF from images.' },
    { id: 'pdf-to-text', name: 'PDF → Text', category: 'Convert', desc: 'Extract selectable text.' },
    { id: 'preview', name: 'PDF Preview Generator', category: 'Convert', desc: 'Render page thumbnails.' },
    { id: 'watermark', name: 'Add Watermark', category: 'Edit', desc: 'Text or image watermark.' },
    { id: 'page-numbers', name: 'Add Page Numbers', category: 'Edit', desc: 'Custom start number.' },
    { id: 'header-footer', name: 'Header / Footer', category: 'Edit', desc: 'Header/footer text.' },
    { id: 'add-background', name: 'Add Background', category: 'Edit', desc: 'Background color/image.' },
    { id: 'add-border', name: 'Add Page Border', category: 'Edit', desc: 'Border color and width.' },
    { id: 'compress', name: 'Compress PDF', category: 'Optimize', desc: 'Reduce output size.' },
    { id: 'grayscale', name: 'Grayscale PDF', category: 'Optimize', desc: 'Convert to grayscale.' },
    { id: 'protect', name: 'Protect PDF', category: 'Security', desc: 'Password protect PDF.' },
    { id: 'metadata-viewer', name: 'View Metadata', category: 'Utility', desc: 'Read document metadata.' },
    { id: 'metadata-editor', name: 'Edit Metadata', category: 'Utility', desc: 'Update metadata fields.' },
  ];

  const state = { registry: new Map(), activeId: null, currentFilter: '' };

  const setStatus = (text) => { document.getElementById('status').textContent = text || ''; };
  const register = (id, handler) => state.registry.set(id, handler);

  const buildFilters = () => {
    const host = document.getElementById('category-filters');
    const categories = ['All', ...new Set(defs.map(d => d.category))];
    categories.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = cat;
      chip.onclick = () => {
        state.currentFilter = cat === 'All' ? '' : cat;
        document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.textContent === cat));
        window.Search.apply();
      };
      host.appendChild(chip);
    });
    host.querySelector('.chip')?.classList.add('active');
  };

  const buildToolList = () => {
    const host = document.getElementById('tool-list');
    host.innerHTML = '';
    defs.forEach(tool => {
      const btn = document.createElement('button');
      btn.className = 'tool-btn';
      btn.dataset.id = tool.id;
      btn.dataset.category = tool.category;
      btn.innerHTML = `${tool.name}<small>${tool.category}</small>`;
      btn.onclick = () => loadTool(tool.id);
      host.appendChild(btn);
    });
  };

  const loadTool = async (id) => {
    const meta = defs.find(d => d.id === id);
    state.activeId = id;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    document.getElementById('tool-title').textContent = meta.name;
    document.getElementById('tool-subtitle').textContent = meta.desc;

    if (!state.registry.has(id)) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `js/tools/${id}.js`;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    const mount = document.getElementById('tool-container');
    mount.innerHTML = '<div class="panel"></div>';
    state.registry.get(id).render(mount.firstElementChild);
  };

  return { defs, state, setStatus, register, buildFilters, buildToolList, loadTool };
})();
