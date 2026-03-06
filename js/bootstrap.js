(() => {
  const addScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

  const start = async () => {
    try {
      await addScript('https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js');
      await addScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
      if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      }
      await addScript('https://cdn.jsdelivr.net/npm/jszip/dist/jszip.min.js');

      await addScript('js/pdf-engine.js');
      await addScript('js/ui.js');
      await addScript('js/search.js');
      await addScript('js/app.js');
    } catch (error) {
      const status = document.getElementById('status');
      if (status) status.textContent = `Startup error: ${error.message}`;
      console.error(error);
    }
  };

  start();
})();
