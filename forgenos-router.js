// FORGENOS SMART ROUTER v2
// Yeh file tool page se sirf "Asli Tool" uthati hai, purana navigation chhod deti hai.

window.loadSPA = async function(url, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Loader chalao
    if (window.triggerPageLoader) window.triggerPageLoader();

    // URL check: Agar extension nahi hai toh .html add karo (Github pages fix)
    let fetchUrl = url;
    if (!fetchUrl.endsWith('.html') && !fetchUrl.includes('#') && !fetchUrl.includes('?')) {
        fetchUrl = fetchUrl + ".html";
    }

    // Browser history update
    history.pushState({ path: url }, '', url);

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Network error');
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Sabse zaroori: Tool page ke andar ka asli content area dhundo
        // Aapke har tool mein <div id="ai-tool-workspace"> hai, hum sirf wahi uthayenge!
        const toolContent = doc.getElementById('ai-tool-workspace');
        const toolTitle = doc.getElementById('tool-title');
        const toolDesc = doc.getElementById('tool-desc');
        const toolInfo = doc.getElementById('tool-info-section');

        const dashboard = document.getElementById('view-content');
        
        if (toolContent && dashboard) {
            // Dashboard ko khali karo aur naya content dalo
            dashboard.innerHTML = `
                <div class="px-6 md:px-16 py-8 animate-fade-up">
                    <button onclick="window.handleNavClick('home')" class="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm font-bold w-max">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Home
                    </button>
                    <div class="mb-10">
                        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter">${toolTitle ? toolTitle.innerText : 'Tool'}</h1>
                        <p class="text-gray-500 mt-2">${toolDesc ? toolDesc.innerText : ''}</p>
                    </div>
                    <div id="spa-tool-mount"></div>
                    <div class="mt-20">${toolInfo ? toolInfo.innerHTML : ''}</div>
                </div>
            `;
            
            // Tool ki asli logic mount karo
            document.getElementById('spa-tool-mount').appendChild(toolContent);
        }

        // Scripts aur Styles handle karo
        document.title = doc.title;
        
        // Purani dynamic styles hatao
        document.querySelectorAll('.spa-temp-style').forEach(s => s.remove());
        doc.head.querySelectorAll('style').forEach(s => {
            const style = document.createElement('style');
            style.className = 'spa-temp-style';
            style.innerHTML = s.innerHTML;
            document.head.appendChild(style);
        });

        // Scripts execute karo
        document.querySelectorAll('.spa-temp-script').forEach(s => s.remove());
        doc.querySelectorAll('script').forEach(oldScript => {
            if (oldScript.src && (oldScript.src.includes('tailwind') || oldScript.src.includes('lucide') || oldScript.src.includes('tools.js'))) return;
            
            const newScript = document.createElement('script');
            newScript.className = 'spa-temp-script';
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.innerHTML = oldScript.innerHTML;
            document.body.appendChild(newScript);
        });

        // Icons refresh
        if (window.lucide) lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("SPA Load Error:", error);
        window.location.href = url; // Fail hone par normal load kar do
    }
};

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.path) window.loadSPA(e.state.path, null);
    else location.reload();
});
