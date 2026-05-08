// FORGENOS SEAMLESS APP ROUTER
// Yeh file aapke poore platform ki routing aur UI handle karti hai bina freeze huye.

const announcementConfig = {
    enabled: false, 
    id: 'announce_v1', 
    delaySeconds: 6,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    category: 'New Update',
    title: 'NeuralForge AI Beta',
    description: 'Experience the next generation of decentralized AI processing directly in your browser.',
    buttonText: 'Open Tool',
    buttonLink: 'https://forgenos.com/tool-page'
};

const categoriesList = [
    { id: 'finance', title: 'Finance & Wealth', icon: 'dollar-sign', color: 'text-green-500', img: 'https://forgenos.com/assets/finance.webp', filter: t => t.category === 'finance' },
    { id: 'dev', title: 'Developer Tools', icon: 'code-2', color: 'text-blue-500', img: 'https://forgenos.com/assets/dev.webp', filter: t => t.category === 'dev' },
    { id: 'student', title: 'Study Zone', icon: 'graduation-cap', color: 'text-yellow-500', img: 'https://forgenos.com/assets/study.webp', filter: t => t.category === 'student' },
    { id: 'brain', title: 'Brain Training', icon: 'brain-circuit', color: 'text-purple-500', img: 'https://forgenos.com/assets/brain.webp', filter: t => t.category === 'brain' },
    { id: 'health', title: 'Health & Wellness', icon: 'heart-pulse', color: 'text-rose-400', img: 'https://forgenos.com/assets/health.webp', filter: t => t.category === 'health' },
    { id: 'pdf', title: 'PDF Magic', icon: 'file-text', color: 'text-cyan-400', img: 'https://forgenos.com/assets/pdfmagic.webp', filter: t => t.category === 'pdf' },
    { id: 'image', title: 'Image Lab', icon: 'image', color: 'text-fuchsia-400', img: 'https://forgenos.com/assets/imagelab.webp', filter: t => t.category === 'image' }
];

const catColorsMap = { 
    'trending': 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]', 
    'finance': 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]', 
    'dev': 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]', 
    'student': 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]', 
    'brain': 'text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]', 
    'health': 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    'pdf': 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    'image': 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]'
};

const heroSlides = [
    { id: 25, tag: "New", title: 'Fire<span class="text-brand-accent">Calc</span> ', subtitle: "Calculate your financial independence timeline and safe withdrawal rates.", desc: "Plan your early retirement with precision using our secure, free calculator.", img: "https://forgenos.com/finance/img/tool_5.webp" },
    { id: 16, tag: "Health", title: 'Circadia<span class="text-brand-accent">Synic</span> ', subtitle: "Optimize your sleep cycles for peak energy and focus.", desc: "Calibrate your internal clock for maximum productivity and recovery.", img: "https://forgenos.com/health/img/tool_1.jpg" },
    { id: 23, tag: "PDF", title: 'PDF<span class="text-brand-accent">Protect</span>', subtitle: "Add or remove passwords from your PDF files securely.", desc: "Keep your sensitive documents safe. Everything happens directly in your browser.", img: "https://forgenos.com/pdfmagic/img/tool_1.webp" }
];

let savedTools = JSON.parse(localStorage.getItem('forgenos_saved')) || [];
let pinnedTools = JSON.parse(localStorage.getItem('forgenos_pinned')) || []; 
let myProjects = JSON.parse(localStorage.getItem('forgenos_projects')) || [];
let appSettings = JSON.parse(localStorage.getItem('forgenos_settings')) || { 
    interactiveBg: false, privacyBlur: false, reduceMotion: false, notifications: false, compactMode: false, smoothScroll: false 
};

let currentView = 'home';
let heroInterval = null;
let currentHeroIndex = 0;
let lenisInstance;
let selectedToolsForProject = [];
let projectToDeleteId = null;
let currentOpenProjectId = null;

// ==========================================
// 🌟 1. SEAMLESS TOOL LOADER (CRASH-PROOF) 🌟
// ==========================================
window.loadSeamlessTool = function(url, toolId, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    window.triggerPageLoader();
    
    // Clean URL Structure
    let toolPath = url.startsWith('/') ? url.substring(1) : url;
    history.pushState({ view: 'run-tool', id: toolId, url: url }, '', '#/' + toolPath);

    const dashboard = document.getElementById('view-content');
    const footer = document.getElementById('main-footer');
    if(footer) footer.style.display = 'none';

    // Build Seamless Container (No popup borders)
    dashboard.innerHTML = `
        <div class="w-full flex flex-col flex-1 animate-fade-up">
            <!-- Tool Header -->
            <div class="w-full h-14 bg-[#141414] border-b border-white/5 flex items-center px-4 md:px-8 shrink-0 relative z-20">
                <button onclick="window.handleNavClick('tool-${toolId}')" class="flex items-center gap-2 text-brand-accent hover:text-white transition-colors text-sm font-bold group">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Exit Tool
                </button>
                <span class="ml-auto text-[10px] text-gray-500 hidden md:flex items-center gap-2 font-black tracking-widest uppercase px-3 py-1 rounded-md border border-white/5 bg-white/5">
                    <i data-lucide="shield-check" class="w-3 h-3 text-green-500"></i> Secure Environment
                </span>
            </div>
            
            <!-- Seamless Iframe -->
            <div class="flex-1 w-full relative bg-[#141414]" style="min-height: calc(100vh - 140px);">
                <div id="iframe-loader" class="absolute inset-0 flex flex-col items-center justify-center bg-[#141414] z-10">
                    <div class="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-gray-400 mt-4 text-xs tracking-widest uppercase font-bold">Starting Engine...</p>
                </div>
                <iframe src="${url}" id="tool-iframe" class="w-full h-full border-none absolute inset-0 opacity-0 transition-opacity duration-500"></iframe>
            </div>
        </div>
    `;
    
    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const iframe = document.getElementById('tool-iframe');
    iframe.onload = function() {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            
            // CSS Inject: Hide old elements from tool so it looks like dashboard
            const style = doc.createElement('style');
            style.innerHTML = `
                aside#sidebar, header, footer { display: none !important; }
                main, #main-container, .md\\:ml-\\[5\\.5rem\\] { 
                    margin-left: 0 !important; 
                    padding-top: 0 !important; 
                    min-height: 100vh !important;
                }
                a[href*="index.html"], a[href*="/"] { display: none !important; }
                body { background: transparent !important; }
            `;
            doc.head.appendChild(style);
        } catch(e) {
            console.log("Iframe isolated (CORS). Tool loaded safely.");
        }
        
        document.getElementById('iframe-loader').style.display = 'none';
        iframe.style.opacity = '1';
        window.unlockScroll();
    };
};

// ==========================================
// 🌟 2. ROUTING & NAVIGATION 🌟
// ==========================================
window.addEventListener('popstate', (e) => { 
    if(window.location.hash.startsWith('#/')) {
        const urlPath = '/' + window.location.hash.replace('#/', '').split('?')[0]; 
        let tool = typeof toolsData !== 'undefined' ? toolsData.find(t => t.link && (t.link === urlPath || t.link === urlPath.replace('.html', ''))) : null;
        if(tool) window.loadSeamlessTool(tool.link, tool.id, null);
        else window.loadSeamlessTool(urlPath, 999, null);
    } else if(e.state && e.state.view) {
        window.handleNavClick(e.state.view, true); 
    } else {
        const hash = window.location.hash.substring(1);
        if(hash && !hash.startsWith('/')) window.handleNavClick(hash, true);
        else window.handleNavClick('home', true); 
    }
});

window.handleNavClick = function(view, isPopState=false) {
    if(currentView === view && view !== 'projects' && view !== 'home') return;
    if(!isPopState) history.pushState({view: view}, '', '#'+view);
    
    const footer = document.getElementById('main-footer');
    if(footer) footer.style.display = (view === 'home') ? 'block' : 'none';
    
    window.triggerPageLoader();
    currentView = view;
    window.renderSidebar();
    window.scrollTo({top: 0, behavior: 'smooth'});
    window.unlockScroll(); 
    
    if(heroInterval) { clearInterval(heroInterval); heroInterval = null; }
    
    const container = document.getElementById('view-content');
    
    const renderTarget = () => {
        if(view === 'home') window.renderHome();
        else if(view === 'settings') window.renderSettings();
        else if(view === 'saved') window.renderSavedView();
        else if(view === 'projects') window.renderProjectsView();
        else if(['privacy','terms','about','contact','disclaimer'].includes(view)) { 
            window.location.href = '/' + view; return; 
        }
        else if(view.startsWith('tool-')) window.renderToolDetailPage(parseInt(view.split('-')[1]));
        else window.renderCategoryPage(view);
    };

    if(typeof gsap !== 'undefined') {
        gsap.to(container, {
            opacity: 0, y: 20, duration: 0.2, 
            onComplete: () => {
                renderTarget();
                container.style.opacity = '1';
                gsap.to(container, { y: 0, duration: 0.4 });
            }
        });
    } else {
        renderTarget();
        container.style.opacity = '1'; 
        container.style.transform = 'translateY(0)';
    }
};

window.renderSidebar = function() {
    const navItems = [
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'projects', icon: 'folder-heart', label: 'Projects' },
        { id: 'finance', icon: 'dollar-sign', label: 'Finance' },
        { id: 'dev', icon: 'code-2', label: 'Dev' },
        { id: 'student', icon: 'graduation-cap', label: 'Study' },
        { id: 'brain', icon: 'brain-circuit', label: 'Brain' },
        { id: 'health', icon: 'heart-pulse', label: 'Health' },
        { id: 'pdf', icon: 'file-text', label: 'PDF' },
        { id: 'image', icon: 'image', label: 'Image' },
        { id: 'saved', icon: 'bookmark', label: 'My List' },
        { id: 'settings', icon: 'settings', label: 'Settings' }
    ];

    const navContainer = document.getElementById('desktop-nav');
    if(navContainer) {
        navContainer.innerHTML = `<div class="flex items-center gap-2 md:ml-auto">` +
        navItems.map(item => {
            const isActive = currentView === item.id || (currentView.startsWith('tool-') && typeof toolsData !== 'undefined' && toolsData.find(t => t.id === parseInt(currentView.split('-')[1]))?.category === item.id);
            const activeColorClass = catColorsMap[item.id] || 'text-brand-accent drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]';
            const activeBgClass = isActive ? 'bg-white/10 text-white border-white/20 shadow-inner' : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10';

            return `
            <div onclick="window.handleNavClick('${item.id}')" class="cursor-pointer flex items-center px-4 py-2 rounded-full border transition-all duration-300 group shrink-0 ${activeBgClass}">
                <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? activeColorClass : 'text-gray-400 group-hover:text-white'}"></i>
                <span class="ml-2 font-bold text-sm whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}">${item.label}</span>
            </div>`;
        }).join('') + `</div>`;
    }

    const mobileNavContainer = document.getElementById('mobile-nav');
    if(mobileNavContainer) {
        mobileNavContainer.innerHTML = navItems.map(item => {
            const isActive = currentView === item.id;
            const activeColorClass = catColorsMap[item.id] || 'text-brand-accent';
            const activeBgClass = isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white';
            return `
            <div onclick="window.handleNavClick('${item.id}'); window.toggleMobileMenu();" class="cursor-pointer flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeBgClass}">
                <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? activeColorClass : ''}"></i>
                <span class="font-bold text-base">${item.label}</span>
            </div>`;
        }).join('');
    }
    window.tryCreateIcons();
};

// ==========================================
// 🌟 3. RENDERING ENGINE 🌟
// ==========================================
window.createCard = function(tool, isSelectMode = false, isPinnedSection = false) {
    const isSaved = savedTools.includes(tool.id);
    const isPinned = pinnedTools.includes(tool.id);
    const isSelected = selectedToolsForProject.includes(tool.id);
    const isDisabled = tool.disabled === true;
    
    let cardAction = isSelectMode ? `window.toggleToolSelection(${tool.id})` : ``;
    let clickImageAction = !isSelectMode ? `window.handleNavClick('tool-${tool.id}')` : '';
    let titleAction = !isSelectMode ? `window.handleNavClick('tool-${tool.id}')` : '';

    if (isDisabled) { cardAction = ''; clickImageAction = ''; titleAction = ''; }

    const cardGlowClass = (!isSelectMode && isPinnedSection) ? 'pinned-glow' : '';

    return `
    <div class="premium-card ${cardGlowClass} rounded-2xl overflow-hidden flex flex-col group ${isSelectMode && isSelected ? 'border-brand-accent ring-1 ring-brand-accent' : ''}" onclick="${cardAction}" style="${isDisabled ? 'filter: grayscale(100%); pointer-events: auto;' : ''}">
        <div class="card-image-wrapper ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} skeleton-bg" onclick="${clickImageAction}">
            <img src="${tool.img}" loading="lazy" class="card-image w-full h-full object-cover opacity-0 transition-opacity duration-500" onload="this.classList.remove('opacity-0'); this.parentElement.classList.remove('skeleton-bg');">
            ${isDisabled ? `<div class="absolute inset-0 bg-black/50 z-[15] pointer-events-none"></div>` : ''}
            
            <div class="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
                <span class="bg-brand-accent text-white text-[8px] md:text-[9px] font-black px-2 py-1 rounded tracking-tighter shadow-xl uppercase">${tool.category}</span>
            </div>
            
            ${isSelectMode ? `
            <div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-brand-accent border-brand-accent' : 'bg-black/40 border-white/40'} flex items-center justify-center transition-all z-20">
                ${isSelected ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}
            </div>` : `
            <div class="absolute top-3 right-3 flex flex-col gap-2 z-30 transition-all duration-300">
                ${isDisabled ? `<button onclick="event.stopPropagation(); window.showDisabledModal()" class="p-2 rounded-xl bg-[#27272a] border border-white/20"><i data-lucide="info" class="w-4 h-4 text-white"></i></button>` : ''}
                <button onclick="window.togglePin(event, ${tool.id})" data-pin-btn="${tool.id}" class="p-2 rounded-xl bg-black/40 border border-white/10 hover:bg-white hover:text-black transition-all pointer-events-auto"><i data-lucide="pin" class="w-4 h-4 ${isPinned && !isDisabled ? 'fill-brand-accent text-brand-accent' : 'text-white'}"></i></button>
                <button onclick="window.toggleSave(event, ${tool.id})" data-save-btn="${tool.id}" class="p-2 rounded-xl bg-black/40 border border-white/10 hover:bg-white hover:text-black transition-all pointer-events-auto"><i data-lucide="bookmark" class="w-4 h-4 ${isSaved && !isDisabled ? 'fill-brand-accent text-brand-accent' : 'text-white'}"></i></button>
            </div>`}
        </div>
        <div class="p-6 flex flex-col gap-2 flex-1 text-left ${isDisabled ? 'pointer-events-none' : ''}">
            <h3 class="text-xl font-bold text-white group-hover:text-brand-accent transition-colors cursor-pointer" onclick="${titleAction}">${tool.title}</h3>
            <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-1">${tool.desc}</p>
            ${!isSelectMode ? `
            <div class="pt-4 mt-auto flex gap-2">
                <button onclick="window.handleNavClick('tool-${tool.id}')" class="flex-1 py-2 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold transition-all text-gray-400">Details</button>
                ${isDisabled ? 
                    `<button disabled class="flex-1 py-2 bg-white/5 opacity-40 cursor-not-allowed rounded-xl text-xs font-bold text-white">Open</button>` : 
                    `<button onclick="window.loadSeamlessTool('${tool.link || ''}', ${tool.id}, event)" class="flex-1 py-2 bg-white/5 hover:bg-white hover:text-black rounded-xl text-xs font-bold transition-all text-white shadow-lg"><i data-lucide="external-link" class="inline w-3 h-3 mr-1"></i> Open</button>`
                }
            </div>` : ''}
        </div>
    </div>`;
};

window.renderHome = function() {
    window.startHeroCarousel();
    
    let html = `
        <div class="px-6 md:px-16 pt-6 pb-8 text-left max-w-5xl animate-fade-up">
            <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                The Ultimate <span class="text-brand-accent">Toolkit</span>
            </h1>
            <p class="text-gray-400 text-base md:text-lg font-medium max-w-2xl mb-8 leading-relaxed">
                The definitive arsenal for your digital productivity. A curated collection of precision-engineered tools covering everything from visual processing to technical development.
            </p> 
            <div class="relative max-w-2xl">
                <i data-lucide="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"></i>
                <input type="text" id="inline-search-input" oninput="window.performInlineSearch()" placeholder="Search premium tools, categories, or keywords..." class="w-full bg-[#1c1c1e] border border-white/10 text-white text-base md:text-lg rounded-full py-4 pl-16 pr-6 focus:outline-none focus:border-brand-accent transition-shadow shadow-[0_10px_30px_rgba(0,0,0,0.8)] focus:shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <button onclick="window.closeInlineSearch()" id="inline-search-clear" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white hidden"><i data-lucide="x-circle" class="w-5 h-5"></i></button>
            </div>
        </div>

        <div id="search-results-area" class="hidden relative z-50 px-6 md:px-16 pb-20 w-full animate-fade-up min-h-[50vh]">
            <div class="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 class="text-white font-black text-2xl md:text-3xl">Search Results</h3>
                <span id="search-results-count" class="text-brand-accent text-xs font-black uppercase tracking-widest bg-brand-accent/10 px-3 py-1.5 rounded-lg border border-brand-accent/20"></span>
            </div>
            <div id="search-results-grid" class="grid-container text-left justify-start"></div>
        </div>

        <div id="home-main-content">
            <div class="px-6 md:px-16 pb-8 text-left max-w-5xl animate-fade-up" style="animation-delay: 0.1s">
                <div class="flex flex-wrap justify-start gap-3">
                    ${categoriesList.map(cat => `<button onclick="window.handleNavClick('${cat.id}')" class="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-[#1c1c1e] hover:bg-white/10 transition-all text-xs md:text-sm font-bold text-white shadow-md"><i data-lucide="${cat.icon}" class="w-4 h-4 ${cat.color}"></i> ${cat.title}</button>`).join('')}
                </div>
            </div>
            
            <section class="animate-fade-up relative h-[45vh] md:h-[55vh] overflow-hidden mx-6 md:px-0 md:mx-16 rounded-3xl mb-16 border border-white/10 shadow-2xl bg-black" style="animation-delay: 0.2s">
                <div id="hero-slider" class="absolute inset-0 w-full h-full flex">
                    ${heroSlides.map((slide, i) => `
                    <div class="min-w-full h-full relative">
                        <img src="${slide.img}" class="absolute inset-0 w-full h-full object-cover opacity-60">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent"></div>
                        <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                        <div class="absolute bottom-10 md:bottom-16 left-6 md:left-16 max-w-2xl z-20 space-y-4">
                            <span class="px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-accent backdrop-blur-md">${slide.tag}</span>
                            <h1 class="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter">${slide.title}</h1>
                            <p class="text-gray-300 font-medium">${slide.subtitle}</p>
                            <div class="flex gap-4 pt-2">
                                <button onclick="window.loadSeamlessTool('${slide.link || ''}', ${slide.id}, event)" class="bg-brand-accent text-white px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.5)]">Launch Now</button>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
                <div class="absolute bottom-6 md:bottom-8 right-6 md:right-10 z-30 flex gap-2">
                    ${heroSlides.map((_, i) => `<div class="hero-dot w-2 h-2 rounded-full transition-all duration-500 ${i === 0 ? 'w-8 bg-brand-accent' : 'bg-white/30'}"></div>`).join('')}
                </div>
            </section>

            <div class="px-6 md:px-16 py-10 md:py-16">
    `;

    if (pinnedTools.length > 0) {
        const pTools = typeof toolsData !== 'undefined' ? toolsData.filter(t => pinnedTools.includes(t.id)) : [];
        html += `
            <section class="animate-fade-up mb-16 md:mb-24">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3"><i data-lucide="pin" class="text-brand-accent w-8 h-8"></i> Pinned Arsenal</h2>
                </div>
                <div class="grid-container">${pTools.map(t => window.createCard(t, false, true)).join('')}</div>
            </section>`;
    }

    let trendingTools = typeof toolsData !== 'undefined' ? toolsData.filter(t => t.tags && t.tags.includes('trending')).slice(0,8) : [];
    if(trendingTools.length === 0 && typeof toolsData !== 'undefined') trendingTools = toolsData.slice(0,8);
    
    if(trendingTools.length > 0) {
        html += `
            <section class="animate-fade-up mb-16">
                <div class="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight">Trending Tools</h2>
                </div>
                <div class="grid-container">${trendingTools.map(t => window.createCard(t)).join('')}</div>
            </section>`;
    }

    html += `</div></div>`;
    document.getElementById('view-content').innerHTML = html;
    window.tryCreateIcons();
};

window.renderToolDetailPage = function(id) {
    const tool = typeof toolsData !== 'undefined' ? toolsData.find(t => t.id === id) : null;
    if(!tool) return window.handleNavClick('home');

    document.getElementById('view-content').innerHTML = `
        <div class="px-6 md:px-16 py-8">
            <button onclick="window.handleNavClick('${tool.category}')" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-bold w-max">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Category
            </button>
            
            <div class="flex flex-col md:flex-row gap-10 bg-[#1c1c1e] rounded-3xl p-8 border border-white/5 shadow-2xl animate-fade-up">
                <div class="w-full md:w-80 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src="${tool.img}" class="w-full h-full object-cover">
                </div>
                <div class="flex-col justify-center flex-1">
                    <span class="text-[10px] font-black uppercase px-3 py-1 rounded bg-brand-accent/10 text-brand-accent mb-4 inline-block">${tool.category}</span>
                    <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">${tool.title}</h1>
                    <p class="text-lg text-gray-400 mb-8">${tool.desc}</p>
                    <button onclick="window.loadSeamlessTool('${tool.link || ''}', ${tool.id}, event)" class="px-10 py-4 bg-brand-accent text-white rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.3)]">Launch Tool <i data-lucide="external-link" class="inline w-5 h-5 ml-2"></i></button>
                </div>
            </div>

            <div class="max-w-4xl mt-12 md:mt-16 text-left pb-12 animate-fade-up" style="animation-delay: 0.1s">
                <h2 class="text-3xl font-black text-white mb-6">Overview</h2>
                <p class="text-gray-400 text-base leading-relaxed mb-10">${tool.details?.overview || 'Premium fast tool ready to use securely in your browser.'}</p>
            </div>
        </div>
    `;
    window.tryCreateIcons();
};

window.renderCategoryPage = function(catId) {
    const cat = categoriesList.find(c => c.id === catId);
    if (!cat) return window.handleNavClick('home');
    const tools = typeof toolsData !== 'undefined' ? toolsData.filter(cat.filter) : [];

    document.getElementById('view-content').innerHTML = `
        <div class="px-6 md:px-16 py-10 md:py-16">
            <div class="flex items-center gap-4 mb-12 animate-fade-up">
                <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <i data-lucide="${cat.icon}" class="${cat.color} w-8 h-8"></i>
                </div>
                <h1 class="text-5xl md:text-6xl font-black text-white tracking-tighter">${cat.title}</h1>
            </div>
            <div class="grid-container">
                ${tools.map(t => window.createCard(t)).join('')}
            </div>
        </div>
    `;
    window.tryCreateIcons();
};

window.renderSettings = function() { 
    const isPC = window.innerWidth >= 1024;
    document.getElementById('view-content').innerHTML = `
        <div class="pt-16 pb-20 px-6 md:px-16 max-w-5xl mx-auto text-left animate-fade-up">
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Settings</h1>
            <p class="text-gray-400 mb-12 text-lg">Personalize your FORGENOS experience.</p>
            <div class="grid md:grid-cols-2 gap-6 md:gap-8">
                <div class="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] space-y-8">
                    <h2 class="text-xl font-bold text-white flex items-center gap-3"><i data-lucide="monitor" class="text-brand-accent"></i> Interface</h2>
                    ${window.createToggle('Space Background', 'Enable dynamic space and meteor effects.', 'interactiveBg')}
                    ${isPC ? window.createToggle('Smooth Scrolling', 'Enable buttery smooth scroll (PC only).', 'smoothScroll') : ''}
                </div>
                <div class="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] space-y-8">
                    <h2 class="text-xl font-bold text-white flex items-center gap-3"><i data-lucide="database" class="text-brand-accent"></i> Storage</h2>
                    <div class="flex items-center justify-between">
                        <div><h3 class="font-bold text-white">Clear Favorites</h3><p class="text-xs text-gray-400">Delete all saved items.</p></div>
                        <button onclick="window.resetStorage('saved')" class="text-[10px] font-black uppercase text-red-500 px-4 py-2 hover:bg-red-500/10 rounded-lg">Clear</button>
                    </div>
                </div>
            </div>
        </div>`;
    window.tryCreateIcons();
};

window.createToggle = function(title, desc, key) { 
    const isChecked = appSettings[key];
    const idValue = `toggle-${key}`;
    return `
        <div class="flex items-center justify-between group">
            <div><h3 class="font-bold text-white" id="${idValue}-label">${title}</h3><p class="text-xs text-gray-400">${desc}</p></div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="${idValue}" aria-labelledby="${idValue}-label" class="sr-only peer" ${isChecked ? 'checked' : ''} onchange="window.toggleSetting('${key}')">
                <div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
            </label>
        </div>`;
};

window.toggleSetting = function(key) { 
    appSettings[key] = !appSettings[key]; 
    localStorage.setItem('forgenos_settings', JSON.stringify(appSettings)); 
    if (key === 'smoothScroll') {
        setTimeout(() => { location.reload(); }, 1500);
    } else {
        window.applyImmediateSettings(); 
    }
};

window.applyImmediateSettings = function() {
    if (appSettings.privacyBlur) { 
        window.onblur = () => document.body.classList.add('privacy-blur'); 
        window.onfocus = () => document.body.classList.remove('privacy-blur'); 
    } else { 
        window.onblur = null; window.onfocus = null; 
    }
    const canvas = document.getElementById('particle-canvas');
    if (appSettings.interactiveBg) { 
        canvas.style.display = 'block'; canvas.style.opacity = '1'; window.initParticles(); 
    } else { 
        canvas.style.opacity = '0'; setTimeout(() => { canvas.style.display = 'none'; }, 1000);
    }
};

window.renderProjectsView = function() { 
    let html = `
        <div class="px-6 md:px-16 py-6 md:py-8">
            <div class="flex justify-between items-center mb-10 animate-fade-up">
                <h1 class="text-3xl md:text-5xl font-black text-white">My Projects</h1>
                <button onclick="window.openCreateProjectModal()" class="bg-white text-black font-bold px-5 py-2.5 rounded-xl flex items-center gap-2"><i data-lucide="plus" class="w-4 h-4"></i> Create</button>
            </div>
            ${myProjects.length === 0 ? `
                <div class="py-32 flex flex-col items-center text-center opacity-40 animate-fade-up">
                    <i data-lucide="folder-plus" class="w-20 h-20 mb-6 text-white"></i>
                    <h2 class="text-2xl font-bold text-white">No Toolkits Found</h2>
                </div>
            ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${myProjects.map(proj => {
                        const count = proj.toolIds.length;
                        return \`<button onclick="window.viewProjectTools(${proj.id})" class="bg-[#1c1c1e] border border-white/5 p-6 rounded-2xl text-left hover:border-white/20 transition-all group animate-fade-up">
                            <h3 class="text-xl font-bold text-white mb-2">\${proj.name}</h3>
                            <span class="text-brand-accent text-xs font-bold uppercase">\${count} Tools</span>
                        </button>\`;
                    }).join('')}
                </div>
            `}
        </div>
    `;
    document.getElementById('view-content').innerHTML = html;
    window.tryCreateIcons();
};

window.renderSavedView = function() { 
    const tools = typeof toolsData !== 'undefined' ? toolsData.filter(t => savedTools.includes(t.id)) : [];
    document.getElementById('view-content').innerHTML = `
        <div class="px-6 md:px-16 py-8 animate-fade-up">
            <h1 class="text-3xl md:text-5xl font-black text-white mb-10">My List</h1>
            ${tools.length === 0 ? `
                <div class="py-32 flex flex-col items-center opacity-40 text-center">
                    <i data-lucide="bookmark" class="w-20 h-20 mb-6 text-white"></i>
                    <h2 class="text-2xl font-bold text-white">Your list is empty</h2>
                </div>` : 
                `<div class="grid-container">${tools.map(t => window.createCard(t)).join('')}</div>`
            }
        </div>`;
    window.tryCreateIcons();
};

// ==========================================
// 🌟 4. UTILITY HANDLERS & MODALS 🌟
// ==========================================

window.startHeroCarousel = function() {
    if (heroInterval) clearInterval(heroInterval);
    const slider = document.getElementById('hero-slider');
    const dots = document.querySelectorAll('.hero-dot');
    if(!slider) return;
    
    heroInterval = setInterval(() => {
        currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
        if(typeof gsap !== 'undefined') gsap.to(slider, { xPercent: -100 * currentHeroIndex, duration: 1, ease: "expo.inOut" });
        dots.forEach((dot, i) => {
            if(i === currentHeroIndex) { dot.classList.add('w-8', 'bg-brand-accent'); dot.classList.remove('w-2', 'bg-white/30'); }
            else { dot.classList.add('w-2', 'bg-white/30'); dot.classList.remove('w-8', 'bg-brand-accent'); }
        });
    }, 5000);
};

window.toggleMobileMenu = function() {
    const m = document.getElementById('mobile-menu');
    const o = document.getElementById('mobile-menu-overlay');
    if(m.classList.contains('translate-x-full')) {
        window.lockScroll(); o.classList.remove('hidden'); void o.offsetWidth; o.classList.add('opacity-100'); m.classList.remove('translate-x-full');
    } else {
        window.unlockScroll(); o.classList.remove('opacity-100'); m.classList.add('translate-x-full'); setTimeout(() => o.classList.add('hidden'), 300);
    }
};

window.performInlineSearch = function() {
    const input = document.getElementById('inline-search-input');
    const clearBtn = document.getElementById('inline-search-clear');
    const resultsArea = document.getElementById('search-results-area');
    const resultsGrid = document.getElementById('search-results-grid');
    const emptyState = document.getElementById('search-results-empty');
    const mainContent = document.getElementById('home-main-content');
    const countText = document.getElementById('search-results-count');
    
    if(!input || !resultsArea) return;
    const query = input.value.toLowerCase().trim();
    
    if (query.length > 0) {
        clearBtn.style.display = 'block';
        resultsArea.classList.remove('hidden');
        if(mainContent) mainContent.classList.add('hidden'); 
        
        const filtered = typeof toolsData !== 'undefined' ? toolsData.filter(t => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)) : [];
        countText.innerText = `${filtered.length} found`;

        if(filtered.length === 0) {
            resultsGrid.innerHTML = ''; emptyState.style.display = 'flex'; emptyState.classList.remove('hidden');
        } else {
            emptyState.style.display = 'none'; emptyState.classList.add('hidden');
            resultsGrid.innerHTML = filtered.map((t) => `<div>${window.createCard(t)}</div>`).join('');
            window.tryCreateIcons();
        }
    } else { window.closeInlineSearch(); }
};

window.closeInlineSearch = function() {
    const input = document.getElementById('inline-search-input');
    const clearBtn = document.getElementById('inline-search-clear');
    const resultsArea = document.getElementById('search-results-area');
    const mainContent = document.getElementById('home-main-content');
    
    if(input) input.value = '';
    if(clearBtn) clearBtn.style.display = 'none';
    if(resultsArea) resultsArea.classList.add('hidden');
    if(mainContent) mainContent.classList.remove('hidden');
};

// Project Modals
window.openCreateProjectModal = function() { 
    selectedToolsForProject = []; document.getElementById('project-name-input').value = ''; 
    document.getElementById('modal-tool-search').value = ''; 
    window.renderToolSelectionGrid(); window.updateSelectedToolsList(); 
    const modal = document.getElementById('project-modal'); 
    window.lockScroll(); modal.classList.remove('hidden'); 
    if(typeof gsap !== 'undefined') gsap.to(modal.firstElementChild, { scale: 1, opacity: 1, duration: 0.4 }); 
};
window.closeProjectModal = function() { 
    const modal = document.getElementById('project-modal'); window.unlockScroll(); 
    if(typeof gsap !== 'undefined') { gsap.to(modal.firstElementChild, { scale: 0.95, opacity: 0, duration: 0.3, onComplete: () => modal.classList.add('hidden') }); } 
    else { modal.classList.add('hidden'); }
};
window.filterModalTools = function() {
    const query = document.getElementById('modal-tool-search').value.toLowerCase().trim();
    const filteredTools = typeof toolsData !== 'undefined' ? toolsData.filter(t => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)) : [];
    document.getElementById('tool-selection-grid').innerHTML = filteredTools.map(tool => window.createCard(tool, true)).join(''); 
    window.tryCreateIcons(); 
};
window.renderToolSelectionGrid = function() { 
    document.getElementById('tool-selection-grid').innerHTML = typeof toolsData !== 'undefined' ? toolsData.map(tool => window.createCard(tool, true)).join('') : ''; 
    window.tryCreateIcons(); 
};
window.toggleToolSelection = function(id) {
    const tool = typeof toolsData !== 'undefined' ? toolsData.find(t => t.id === id) : null; 
    if (tool && tool.disabled) return;
    if(selectedToolsForProject.includes(id)) selectedToolsForProject = selectedToolsForProject.filter(tid => tid !== id); 
    else selectedToolsForProject.push(id);
    window.filterModalTools(); window.updateSelectedToolsList();
};
window.updateSelectedToolsList = function() {
    document.getElementById('selected-count').innerText = selectedToolsForProject.length;
    const list = document.getElementById('selected-tools-list');
    if(selectedToolsForProject.length === 0) { 
        list.innerHTML = '<p class="text-gray-400 text-xs italic text-center py-4">Tap tools in the grid to add them.</p>'; 
    } else { 
        const selected = typeof toolsData !== 'undefined' ? toolsData.filter(t => selectedToolsForProject.includes(t.id)) : []; 
        list.innerHTML = selected.map(t => `<div class="flex items-center gap-3 bg-black p-3 rounded-xl border border-white/5"><span class="text-xs font-bold text-white truncate flex-1">${t.title}</span><button onclick="window.toggleToolSelection(${t.id})" class="text-gray-500 hover:text-red-500"><i data-lucide="x" class="w-3 h-3"></i></button></div>`).join(''); 
    }
    window.tryCreateIcons();
};
window.saveProject = function() {
    const name = document.getElementById('project-name-input').value.trim();
    if(!name) { window.showToast("Please enter a name", "alert"); return; }
    if(selectedToolsForProject.length === 0) { window.showToast("Please select tools", "alert"); return; }
    myProjects.push({ id: Date.now(), name, toolIds: [...selectedToolsForProject] });
    localStorage.setItem('forgenos_projects', JSON.stringify(myProjects));
    window.closeProjectModal(); window.handleNavClick('projects'); window.showToast("Toolkit Created!", 'success');
};
window.viewProjectTools = function(projId) {
    currentOpenProjectId = projId;
    const proj = myProjects.find(p => p.id === projId);
    if(!proj) return;
    const tools = typeof toolsData !== 'undefined' ? toolsData.filter(t => proj.toolIds.includes(t.id)) : [];
    document.getElementById('inner-project-title').innerText = proj.name;
    document.getElementById('inner-project-grid').innerHTML = tools.map((t, i) => `<div>${window.createCard(t)}</div>`).join('');
    window.tryCreateIcons();
    const modal = document.getElementById('inner-project-modal');
    window.lockScroll(); modal.classList.remove('hidden');
    if(typeof gsap !== 'undefined'){
        gsap.to('#inner-project-header', { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to('#inner-project-grid', { scale: 1, opacity: 1, duration: 0.4 });
    }
};
window.closeInnerProject = function() {
    const modal = document.getElementById('inner-project-modal'); window.unlockScroll();
    if(typeof gsap !== 'undefined') { gsap.to(['#inner-project-header', '#inner-project-grid'], { scale: 0.95, opacity: 0, duration: 0.2, onComplete: () => { modal.classList.add('hidden'); currentOpenProjectId = null; }}) } 
    else { modal.classList.add('hidden'); currentOpenProjectId = null; }
};
window.triggerDeleteProject = function(event, id) {
    if(event) { event.stopPropagation(); }
    projectToDeleteId = id; 
    const modal = document.getElementById('delete-modal'); modal.classList.remove('hidden');
    if(typeof gsap !== 'undefined') gsap.to(document.getElementById('delete-modal-content'), { scale: 1, opacity: 1, duration: 0.3 });
    document.getElementById('confirm-delete-btn').onclick = () => {
        myProjects = myProjects.filter(p => p.id !== projectToDeleteId); 
        localStorage.setItem('forgenos_projects', JSON.stringify(myProjects));
        window.closeDeleteModal(); 
        if(currentOpenProjectId === projectToDeleteId) { window.closeInnerProject(); } 
        window.renderProjectsView(); window.showToast("Toolkit Deleted", 'alert');
    };
};
window.closeDeleteModal = function() { 
    const modal = document.getElementById('delete-modal'); 
    if(typeof gsap !== 'undefined') { gsap.to(document.getElementById('delete-modal-content'), { scale: 0.9, opacity: 0, duration: 0.2, onComplete: () => { modal.classList.add('hidden'); projectToDeleteId = null; }}); } 
    else { modal.classList.add('hidden'); projectToDeleteId = null; } 
};
window.resetStorage = function(type) {
    if (confirm("Are you sure? This cannot be undone.")) {
        if (type === 'saved') { savedTools = []; localStorage.removeItem('forgenos_saved'); } 
        else { myProjects = []; localStorage.removeItem('forgenos_projects'); }
        window.renderSettings(); window.showToast("Data Wiped", "alert");
    }
};

window.initParticles = function() {
    const canvas = document.getElementById('particle-canvas'); 
    if(!canvas) return;
    const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let stars = []; let meteors = [];

    class Star {
        constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 1.0; this.alpha = Math.random() * 0.3; this.alphaChange = (Math.random() * 0.01) - 0.005; }
        draw() { this.alpha += this.alphaChange; if(this.alpha <= 0.05 || this.alpha >= 0.4) this.alphaChange *= -1; ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    class Meteor {
        constructor() { this.reset(); }
        reset() { if (Math.random() > 0.5) { this.x = Math.random() * canvas.width; this.y = -100; } else { this.x = -100; this.y = Math.random() * canvas.height; } this.length = Math.random() * 120 + 80; this.speed = Math.random() * 6 + 4; this.angle = Math.PI / 8; this.active = false; this.timer = Math.random() * 800 + 300; this.opacity = 0; this.fadeIn = true; }
        update() {
            if(!this.active) { this.timer--; if(this.timer <= 0) this.active = true; return; }
            this.x += this.speed * Math.cos(this.angle); this.y += this.speed * Math.sin(this.angle);
            if (this.fadeIn) { this.opacity += 0.005; if (this.opacity >= 0.7) this.fadeIn = false; } else { this.opacity -= 0.003; }
            if(this.x > canvas.width + 200 || this.y > canvas.height + 200 || (!this.fadeIn && this.opacity <= 0)) { this.reset(); }
        }
        draw() {
            if(!this.active || this.opacity <= 0) return;
            ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
            let gradient = ctx.createLinearGradient(0, 0, -this.length, 0); gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-this.length, 0); ctx.strokeStyle = gradient; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
        }
    }
    for(let i=0; i<50; i++) stars.push(new Star()); for(let i=0; i<3; i++) meteors.push(new Meteor()); 
    function animate() { 
        if(!appSettings.interactiveBg) return; 
        ctx.clearRect(0,0,canvas.width,canvas.height); 
        stars.forEach(s => s.draw()); meteors.forEach(m => { m.update(); m.draw(); }); 
        requestAnimationFrame(animate); 
    }
    animate();
};

window.playLogoAnim = function() {
    if (typeof gsap === 'undefined') return;
    gsap.killTweensOf('.forgenos-shape-left, .forgenos-shape-right');
    gsap.set('.forgenos-shape-left', { x: 0, y: 0 }); gsap.set('.forgenos-shape-right', { x: 0, y: 0 });
    const tl = gsap.timeline();
    tl.to('.forgenos-shape-left', { x: -8, y: 8,  duration: 0.18, ease: 'power2.out' })
      .to('.forgenos-shape-right', { x: 8,  y: -8, duration: 0.18, ease: 'power2.out' }, 0)
      .to('.forgenos-shape-left', { x: 0, y: 0, duration: 0.3, ease: 'back.out(3)' })
      .to('.forgenos-shape-right', { x: 0, y: 0, duration: 0.3, ease: 'back.out(3)' }, '-=0.3');
};
