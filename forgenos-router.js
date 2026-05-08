// FORGENOS SPA ROUTER
// Yeh file bina page reload kiye tools ko load karti hai

window.loadSPA = async function(url, event) {
    if (event) event.preventDefault(); // Default link opening roko

    // Loader chalao
    if (window.triggerPageLoader) window.triggerPageLoader();

    // URL ko browser history me dalo (Back button kaam karne ke liye)
    history.pushState({ path: url }, '', url);

    try {
        // Naya page background me fetch karo
        const response = await fetch(url);
        const html = await response.text();
        
        // HTML ko parse karo
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 1. Dashboard Content Swap (Sirf <main> element ko badlo)
        const newMain = doc.getElementById('main-container');
        if (newMain) {
            document.getElementById('main-container').innerHTML = newMain.innerHTML;
        }

        // 2. Page Title update karo (SEO ke liye zaroori)
        document.title = doc.title;

        // 3. Naye Tool ki CSS load karo
        const oldStyles = document.querySelectorAll('style.spa-dynamic-style');
        oldStyles.forEach(s => s.remove()); // Purane tool ki style hatao

        doc.head.querySelectorAll('style').forEach(style => {
            const newStyle = document.createElement('style');
            newStyle.className = 'spa-dynamic-style';
            newStyle.innerHTML = style.innerHTML;
            document.head.appendChild(newStyle);
        });

        // 4. Tool ki specific JavaScript run karo
        const oldScripts = document.querySelectorAll('script.spa-dynamic-script');
        oldScripts.forEach(s => s.remove()); // Purani hatao

        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            // External libraries (Tailwind, GSAP) ko wapas load mat karo
            if (script.src && (script.src.includes('tailwind') || script.src.includes('lucide') || script.src.includes('gsap') || script.src.includes('tools.js'))) {
                return; 
            }
            
            const newScript = document.createElement('script');
            newScript.className = 'spa-dynamic-script';
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.innerHTML = script.innerHTML;
            }
            document.body.appendChild(newScript);
        });

        // Scroll to top aur icons reload
        if (window.lucide) lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("SPA Load Error:", error);
        // Agar fetch me koi error aaye toh normal tarike se page khol do
        window.location.href = url;
    }
};

// Browser ka Back aur Forward button properly handle karne ke liye
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.path) {
        window.loadSPA(e.state.path, null);
    } else {
        location.reload();
    }
});
