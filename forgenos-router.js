// FORGENOS SMART ROUTER v2.1
// Yeh file tool page se sirf "Asli Tool" uthati hai aur Home Page ke dashboard mein inject karti hai.

window.loadSPA = async function(url, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // 1. Loader aur Overlay chalao (Professional Feel)
    if (window.triggerPageLoader) window.triggerPageLoader();
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Browser history update (Back button support)
    history.pushState({ path: url }, '', url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Tool load nahi ho saka');
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 3. Tool Content Extraction
        // Hum tool page se Title, Desc aur Workspace uthayenge
        const toolContent = doc.getElementById('ai-tool-workspace');
        const toolTitle = doc.getElementById('tool-title');
        const toolDesc = doc.getElementById('tool-desc');
        const toolInfo = doc.getElementById('tool-info-section');
        const dashboard = document.getElementById('view-content');
        
        if (toolContent && dashboard) {
            // Dashboard ko naye Tool UI se replace karo
            dashboard.innerHTML = `
                <div class="px-6 md:px-16 py-12 animate-fade-up max-w-7xl mx-auto">
                    <button onclick="window.handleNavClick('home')" class="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 text-sm font-bold w-max group">
                        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Back to Home
                    </button>
                    
                    <div class="mb-12 text-left">
                        <h1 class="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                            ${toolTitle ? toolTitle.innerText : 'Forgenos Tool'}
                        </h1>
                        <p class="text-gray-500 text-lg mt-4 max-w-3xl font-medium">
                            ${toolDesc ? toolDesc.innerText : ''}
                        </p>
                    </div>

                    <div id="spa-tool-mount" class="relative z-10"></div>

                    ${toolInfo ? `<div class="mt-24 pt-12 border-t border-white/5">${toolInfo.innerHTML}</div>` : ''}
                </div>
            `;
            
            // Asli Tool Logic yahan mount hogi
            document.getElementById('spa-tool-mount').appendChild(toolContent);
            
            // Re-init Lucide Icons
            if (window.lucide) lucide.createIcons();
            
            // Update Page Title
            document.title = doc.title;

            // 4. Styles & Scripts Handling
            // Purani temporary styles hatao
            document.querySelectorAll('.spa-temp-style').forEach(s => s.remove());
            doc.head.querySelectorAll('style').forEach(s => {
                const style = document.createElement('style');
                style.className = 'spa-temp-style';
                style.innerHTML = s.innerHTML;
                document.head.appendChild(style);
            });

            // Scripts execution (Re-run tool logic)
            document.querySelectorAll('.spa-temp-script').forEach(s => s.remove());
            doc.querySelectorAll('script').forEach(oldScript => {
                // Common libraries ko ignore karo jo index.html mein pehle se hain
                if (oldScript.src && (
                    oldScript.src.includes('tailwind') || 
                    oldScript.src.includes('lucide') || 
                    oldScript.src.includes('gsap') || 
                    oldScript.src.includes('tools.js') ||
                    oldScript.src.includes('forgenos-router.js')
                )) return;
                
                const newScript = document.createElement('script');
                newScript.className = 'spa-temp-script';
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    // Script content fix for DOMContentLoaded
                    let scriptContent = oldScript.innerHTML;
                    if(scriptContent.includes('DOMContentLoaded')) {
                        scriptContent = scriptContent.replace(/window\.addEventListener\(['"]DOMContentLoaded['"],\s*(.*?)\);/g, '$1();');
                    }
                    newScript.innerHTML = scriptContent;
                }
                document.body.appendChild(newScript);
            });
        } else {
            throw new Error('ai-tool-workspace ID nahi mili tool file mein');
        }

    } catch (error) {
        console.error("SPA Error:", error);
        // Agar kuch fail ho jaye toh normal reload kar do safe side ke liye
        window.location.href = url;
    }
};

// Back/Forward button handle karne ke liye
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.path) {
        window.loadSPA(e.state.path, null);
    } else {
        location.reload();
    }
});
