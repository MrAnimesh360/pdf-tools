window.UI = (() => {
  const toolDefs = [
    ['merge','Merge PDF','Organize'],['split','Split PDF','Organize'],['reorder-pages','Reorder Pages','Organize'],['delete-pages','Delete Pages','Organize'],['rotate-pages','Rotate Pages','Organize'],['extract-pages','Extract Pages','Organize'],
    ['pdf-to-images','PDF → Images','Convert'],['images-to-pdf','Images → PDF','Convert'],['pdf-to-text','PDF → Text','Convert'],['preview','PDF Preview Generator','Convert'],
    ['watermark','Add Watermark','Edit'],['page-numbers','Add Page Numbers','Edit'],['header-footer','Header / Footer','Edit'],['add-background','Add Background','Edit'],['add-border','Add Page Border','Edit'],
    ['compress','Compress PDF','Optimize'],['grayscale','Grayscale PDF','Optimize'],
    ['protect','Protect PDF','Security'],
    ['metadata-viewer','View Metadata','Utility'],['metadata-editor','Edit Metadata','Utility']
  ].map(([id,name,category])=>({id,name,category}));

  const state = { active:null, registry:new Map(), defs: toolDefs };

  const register = (id, config) => state.registry.set(id, config);

  const buildList = () => {
    const list = document.getElementById('tool-list');
    list.innerHTML='';
    for (const t of state.defs) {
      const btn = document.createElement('button');
      btn.className='tool-btn'; btn.dataset.id=t.id; btn.dataset.category=t.category; btn.textContent=t.name;
      btn.onclick = () => loadTool(t.id);
      list.appendChild(btn);
    }
  };

  const buildFilters = () => {
    const c = document.getElementById('category-filters');
    ['All',...new Set(state.defs.map(d=>d.category))].forEach((f)=>{
      const chip = document.createElement('span'); chip.className='chip'; chip.textContent=f;
      chip.onclick = () => window.Search.filterCategory(f === 'All' ? '' : f);
      c.appendChild(chip);
    });
  };

  const loadTool = async (id) => {
    state.active = id;
    document.querySelectorAll('.tool-btn').forEach((b)=>b.classList.toggle('active', b.dataset.id===id));
    const def = state.defs.find((d)=>d.id===id); document.getElementById('tool-title').textContent = def.name;
    if (!state.registry.has(id)) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `js/tools/${id}.js`; s.onload = resolve; s.onerror = reject; document.body.appendChild(s);
      });
    }
    const tool = state.registry.get(id);
    const root = document.getElementById('tool-container');
    root.innerHTML = '<div class="panel"></div>';
    tool.render(root.querySelector('.panel'));
  };

  const setStatus = (message) => document.getElementById('status').textContent = message;

  return { state, register, buildList, buildFilters, loadTool, setStatus };
})();
